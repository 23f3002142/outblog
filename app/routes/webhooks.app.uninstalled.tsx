import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, session, topic } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  // Wipe ALL app data for this shop so reinstall is a completely fresh start.
  // Order matters: delete child records first, then parent, then sessions.

  // 1. Delete all OutblogPost records for this shop (blog posts synced from Outblog)
  const shopSettings = await db.shopSettings.findUnique({
    where: { shop },
  });

  if (shopSettings) {
    // OutblogPost has onDelete: Cascade, but we delete explicitly to be safe
    await db.outblogPost.deleteMany({
      where: { shopSettingsId: shopSettings.id },
    });

    // 2. Delete ShopSettings (API key, postAsDraft, lastSyncAt, etc.)
    await db.shopSettings.delete({
      where: { shop },
    });
  }

  // 3. Delete ALL sessions for this shop (access tokens, refresh tokens, OAuth state)
  //    This ensures no stale tokens remain and forces fresh OAuth on reinstall.
  await db.session.deleteMany({
    where: { shop },
  });

  return new Response();
};
