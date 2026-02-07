export default function HelpPage() {
  return (
    <s-page heading="Help & Support">
      <s-section heading="Getting Started">
        <s-paragraph>
          Welcome to Outblog! Follow these steps to start publishing
          AI-generated blog posts to your Shopify store.
        </s-paragraph>
        <s-ordered-list>
          <s-list-item>
            Get your API key from the{" "}
            <s-link href="https://app.outblogai.com/dashboard" target="_blank">
              Outblog Dashboard
            </s-link>
            .
          </s-list-item>
          <s-list-item>
            Go to the Home tab and enter your API key in the setup screen.
          </s-list-item>
          <s-list-item>
            Click "Fetch Blogs" to sync your posts from Outblog.
          </s-list-item>
          <s-list-item>
            Publish individual posts or use "Publish All" to push them to your
            Shopify blog.
          </s-list-item>
        </s-ordered-list>
      </s-section>

      <s-section heading="How It Works">
        <s-paragraph>
          Outblog connects to your Outblog AI account using an API key. Once
          connected, your AI-generated blog posts are synced to this app. You
          can then review and publish them to your Shopify store with a single
          click.
        </s-paragraph>
        <s-paragraph>
          Posts are automatically synced once per day. You can also manually
          fetch new posts at any time using the "Fetch Blogs" button on the
          Home tab.
        </s-paragraph>
      </s-section>

      <s-section heading="FAQ">
        <s-paragraph>
          <s-text fontWeight="bold">
            Where do I find my API key?
          </s-text>
        </s-paragraph>
        <s-paragraph>
          Log in to your account at{" "}
          <s-link href="https://app.outblogai.com/dashboard" target="_blank">
            app.outblogai.com/dashboard
          </s-link>{" "}
          and navigate to the API Keys section.
        </s-paragraph>

        <s-paragraph>
          <s-text fontWeight="bold">
            Can I edit posts before publishing?
          </s-text>
        </s-paragraph>
        <s-paragraph>
          Posts are published as-is from Outblog. To edit content, update the
          post in your Outblog dashboard and then re-fetch.
        </s-paragraph>

        <s-paragraph>
          <s-text fontWeight="bold">
            What happens when I uninstall the app?
          </s-text>
        </s-paragraph>
        <s-paragraph>
          All synced data (API key, post records) is removed from our database.
          Articles already published to your Shopify blog will remain on your
          store.
        </s-paragraph>
      </s-section>

      <s-section slot="aside" heading="Support">
        <s-paragraph>
          Need help? Reach out to us and we'll get back to you as soon as
          possible.
        </s-paragraph>
        <s-unordered-list>
          <s-list-item>
            <s-link href="mailto:support@outblogai.com">
              support@outblogai.com
            </s-link>
          </s-list-item>
          <s-list-item>
            <s-link href="https://www.outblogai.com" target="_blank">
              outblogai.com
            </s-link>
          </s-list-item>
        </s-unordered-list>
      </s-section>

      <s-section slot="aside" heading="Resources">
        <s-unordered-list>
          <s-list-item>
            <s-link href="https://app.outblogai.com/dashboard" target="_blank">
              Outblog Dashboard
            </s-link>
          </s-list-item>
          <s-list-item>
            <s-link href="https://www.outblogai.com/privacy" target="_blank">
              Privacy Policy
            </s-link>
          </s-list-item>
        </s-unordered-list>
      </s-section>
    </s-page>
  );
}
