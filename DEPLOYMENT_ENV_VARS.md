# Environment Variables for Vercel Deployment

These environment variables must be set in your Vercel project settings before deploying.

## Required Environment Variables

### Shopify Configuration
| Variable | Description | How to Get |
|----------|-------------|------------|
| `SHOPIFY_API_KEY` | Your app's API key | From Shopify Partner Dashboard or run `shopify app env show` |
| `SHOPIFY_API_SECRET` | Your app's API secret | From Shopify Partner Dashboard or run `shopify app env show` (⚠️ KEEP SECRET) |
| `SHOPIFY_APP_URL` | Your deployed app URL | `https://your-app.vercel.app` (set after first deploy) |
| `SCOPES` | API access scopes | `read_content,write_content` (from shopify.app.toml) |

### Database Configuration
| Variable | Description | How to Get |
|----------|-------------|------------|
| `DATABASE_URL` | PostgreSQL connection string | From your database provider (e.g., Vercel Postgres, Neon, Supabase) |

### Server Configuration
| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment mode | `production` |

### Optional Configuration
| Variable | Description | Default |
|----------|-------------|---------|
| `SHOP_CUSTOM_DOMAIN` | Custom shop domain if applicable | - |

## Security Notes

⚠️ **NEVER commit these values to your repository**
- `SHOPIFY_API_SECRET` must be stored as a secret in Vercel
- `DATABASE_URL` contains credentials and must be kept secure

## Getting Shopify Credentials

Run this command in your project directory:
```bash
shopify app env show
```

This will display all the environment variables needed for your app.

## Database Setup

For Vercel deployment, you need a persistent database. Options:
1. **Vercel Postgres** (recommended) - Integrated with Vercel
2. **Neon** - Serverless PostgreSQL
3. **Supabase** - PostgreSQL with additional features
4. **Railway** - Simple PostgreSQL hosting

After creating your database, you'll receive a `DATABASE_URL` connection string.
