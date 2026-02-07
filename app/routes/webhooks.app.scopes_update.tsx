import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { payload, session, topic, shop } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  // Shopify manages scopes for the current session via Prisma session storage.
  // We log the current scopes for debugging.
  const current = payload.current as string[];
  if (session) {
    console.log(`Updated scopes for ${shop}:`, current.join(","));
  }

  return new Response();
};
