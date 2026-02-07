import type { LoaderFunctionArgs } from "react-router";
import { redirect, Form, useLoaderData } from "react-router";

import { login } from "../../shopify.server";

import styles from "./styles.module.css";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  return { showForm: Boolean(login) };
};

export default function App() {
  const { showForm } = useLoaderData<typeof loader>();

  return (
    <div className={styles.index}>
      <div className={styles.content}>
        <h1 className={styles.heading}>Outblog — AI Blog Posts for Shopify</h1>
        <p className={styles.text}>
          Automatically generate and publish SEO-optimized blog posts to your Shopify store.
        </p>
        {showForm && (
          <Form className={styles.form} method="post" action="/auth/login">
            <label className={styles.label}>
              <span>Shop domain</span>
              <input className={styles.input} type="text" name="shop" />
              <span>e.g: my-shop-domain.myshopify.com</span>
            </label>
            <button className={styles.button} type="submit">
              Log in
            </button>
          </Form>
        )}
        <ul className={styles.list}>
          <li>
            <strong>AI-powered content</strong>. Generate high-quality,
            SEO-optimized blog posts tailored to your store.
          </li>
          <li>
            <strong>One-click publishing</strong>. Sync and publish posts
            directly to your Shopify blog with a single click.
          </li>
          <li>
            <strong>Daily auto-sync</strong>. New posts are fetched
            automatically every day so your blog stays fresh.
          </li>
        </ul>
      </div>
    </div>
  );
}
