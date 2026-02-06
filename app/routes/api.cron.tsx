import type { LoaderFunctionArgs } from "react-router";
import db from "../db.server";

const OUTBLOG_API_URL = "https://api.outblogai.com";

// This endpoint is called by Vercel Cron (daily) to sync blogs for all shops with configured API keys.
// It can also be triggered manually via GET /api/cron?secret=<CRON_SECRET>
export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Verify cron secret to prevent unauthorized access
  const url = new URL(request.url);
  const cronSecret = url.searchParams.get("secret");

  if (cronSecret !== process.env.CRON_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Find all shops that have an API key configured
  const shopsWithKeys = await db.shopSettings.findMany({
    where: { apiKey: { not: null } },
  });

  if (shopsWithKeys.length === 0) {
    return Response.json({ success: true, message: "No shops with API keys found. Nothing to sync." });
  }

  const results: { shop: string; synced: number; error?: string }[] = [];

  for (const shopSettings of shopsWithKeys) {
    if (!shopSettings.apiKey) continue;

    try {
      const response = await fetch(`${OUTBLOG_API_URL}/blogs/posts/wp`, {
        headers: { "x-api-key": shopSettings.apiKey },
      });

      if (!response.ok) {
        results.push({ shop: shopSettings.shop, synced: 0, error: `HTTP ${response.status}` });
        continue;
      }

      const data = await response.json();
      const posts = data.data?.posts || [];

      for (const post of posts) {
        const slug = post.slug || post.title?.toLowerCase().replace(/\s+/g, "-") || "untitled";

        await db.outblogPost.upsert({
          where: {
            shopSettingsId_slug: {
              shopSettingsId: shopSettings.id,
              slug,
            },
          },
          update: {
            externalId: post.id,
            title: post.title || "Untitled",
            content: post.content,
            metaDescription: post.blog_meta_data?.meta_description,
            featuredImage: post.featured_image,
            categories: JSON.stringify(post.blog_meta_data?.categories || []),
            tags: JSON.stringify(post.blog_meta_data?.tags || []),
          },
          create: {
            shopSettingsId: shopSettings.id,
            externalId: post.id,
            slug,
            title: post.title || "Untitled",
            content: post.content,
            metaDescription: post.blog_meta_data?.meta_description,
            featuredImage: post.featured_image,
            categories: JSON.stringify(post.blog_meta_data?.categories || []),
            tags: JSON.stringify(post.blog_meta_data?.tags || []),
          },
        });
      }

      // Update last sync time
      await db.shopSettings.update({
        where: { id: shopSettings.id },
        data: { lastSyncAt: new Date() },
      });

      results.push({ shop: shopSettings.shop, synced: posts.length });
    } catch (error) {
      console.error(`Cron sync error for shop ${shopSettings.shop}:`, error);
      results.push({
        shop: shopSettings.shop,
        synced: 0,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  const totalSynced = results.reduce((sum, r) => sum + r.synced, 0);
  console.log(`Cron sync complete: ${totalSynced} posts synced across ${results.length} shops`);

  return Response.json({ success: true, totalSynced, shops: results });
};
