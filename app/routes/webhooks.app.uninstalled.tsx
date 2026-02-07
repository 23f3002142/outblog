import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, session, topic } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  // Clean up all app data for this shop so that reinstall starts from a clean state.
  // This removes:
  // - ShopSettings for the shop (API key, postAsDraft, lastSyncAt, etc.)
  // - All related OutblogPost records (cascade delete via foreign key)
  //
  // Publishing logic and other routes will recreate ShopSettings as needed
  // when the app is reinstalled, so this won't break the publish flow.
  const shopSettings = await db.shopSettings.findUnique({
    where: { shop },
  });

  if (shopSettings) {
    await db.shopSettings.delete({
      where: { shop },
    });
  }

  return new Response();
};
