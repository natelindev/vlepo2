declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ALGOLIA_API_KEY: string;
      API_PORT?: number;
      AZURE_STORAGE_ACCOUNT_KEY: string;
      AZURE_STORAGE_ACCOUNT: string;
      CDN_ENDPOINT: string;
      NEXT_PUBLIC_SITE_URL?: string;
      DATABASE_URL?: string;
      DEFAULT_ADMIN_ID?: string;
      DEFAULT_ADMIN_PASSWORD: string;
      GITHUB_OAUTH_CLIENT_ID?: string;
      GITHUB_OAUTH_CLIENT_SECRET?: string;
      GOOGLE_OAUTH_CLIENT_ID?: string;
      GOOGLE_OAUTH_CLIENT_SECRET?: string;
      GRAPHQL_INTROSPECT_SECRET: string;
      MAILGUN_API_KEY: string;
      MAILGUN_DOMAIN: string;
      NEXT_PUBLIC_ALGOLIA_APP_ID: string;
      NEXT_PUBLIC_ALGOLIA_INDEX_NAME: string;
      NEXT_PUBLIC_API_ENDPOINT: string;
      NEXT_PUBLIC_DEFAULT_CLIENT_ID: string;
      DEFAULT_BLOG_ID?: string;
      NEXT_PUBLIC_DEFAULT_BLOG_NAME?: string;
      NEXT_PUBLIC_DEFAULT_CLIENT_ID?: string;
      PORT?: string;
      REDDIT_OAUTH_CLIENT_ID?: string;
      REDDIT_OAUTH_CLIENT_SECRET?: string;
      USER_SESSION_KEY?: string;
      LOG_LEVEL?: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent';
    }
  }
}

export {};
