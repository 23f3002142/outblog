# Shopify App Deployment to Vercel - Step-by-Step Guide

This guide walks you through deploying your **outblog** Shopify plugin to Vercel following Shopify's official deployment guidelines.

## 📋 Prerequisites

- [x] Vercel account (sign up at https://vercel.com)
- [x] Shopify Partner account with app created
- [x] PostgreSQL database (Vercel Postgres, Neon, or Supabase)
- [x] Shopify CLI installed (`npm install -g @shopify/cli @shopify/app`)
- [x] Git repository (GitHub, GitLab, or Bitbucket)

---

## 🎯 Deployment Overview

Your app uses:
- **Framework:** React Router v7
- **Database:** PostgreSQL (via Prisma)
- **Session Storage:** Prisma-based (production-ready)
- **Hosting:** Vercel (serverless)

---

## 📝 Step 1: Set Up PostgreSQL Database

### Option A: Vercel Postgres (Recommended)

1. Go to your Vercel dashboard
2. Navigate to **Storage** tab
3. Click **Create Database** → **Postgres**
4. Name it `outblog-db` and select your region
5. Copy the `DATABASE_URL` connection string

### Option B: Neon (Free tier available)

1. Sign up at https://neon.tech
2. Create a new project
3. Copy the connection string (format: `postgresql://user:password@host/dbname`)

### Option C: Supabase

1. Sign up at https://supabase.com
2. Create a new project
3. Go to **Settings** → **Database**
4. Copy the **Connection String** (URI format)

**Save your `DATABASE_URL` - you'll need it in Step 4!**

---

## 📝 Step 2: Prepare Your App Configuration

### 2.1 Update shopify.app.toml

Your `shopify.app.toml` needs to point to your production URL. Initially, you'll deploy with a placeholder, then update it.

**Current configuration:**
```toml
application_url = "https://api.outblogai.com/shopify"
redirect_urls = [ "https://api.outblogai.com/shopify/api/auth" ]
```

**Note:** If deploying to a new Vercel URL, you'll update this after first deployment.

### 2.2 Verify Your Build Script

Check `package.json` - your build script should be:
```json
"build": "react-router build"
```
✅ Already configured correctly!

### 2.3 Verify Vercel Configuration

Check `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install"
}
```
✅ Already configured!

---

## 📝 Step 3: Get Shopify API Credentials

Run this command in your project directory:

```bash
cd /home/kshitij/work/outblog
shopify app env show
```

This will display:
- `SHOPIFY_API_KEY`
- `SHOPIFY_API_SECRET`
- `SCOPES`

**Save these values!** You'll need them in the next step.

---

## 📝 Step 4: Set Up Environment Variables in Vercel

### 4.1 Via Vercel Dashboard (Recommended for first deployment)

1. Go to https://vercel.com/dashboard
2. Click **Add New** → **Project**
3. Import your GitHub/GitLab repository
4. Before deploying, click **Environment Variables**
5. Add the following variables:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `SHOPIFY_API_KEY` | Your API key from Step 3 | Production |
| `SHOPIFY_API_SECRET` | Your API secret from Step 3 | Production (Secret) |
| `SHOPIFY_APP_URL` | `https://your-app.vercel.app` | Production |
| `SCOPES` | `read_content,write_content` | Production |
| `DATABASE_URL` | Your PostgreSQL URL from Step 1 | Production (Secret) |
| `PORT` | `3000` | Production |
| `NODE_ENV` | `production` | Production |

**Important:** 
- Mark `SHOPIFY_API_SECRET` and `DATABASE_URL` as **Secrets** (click the eye icon)
- For first deploy, use a placeholder for `SHOPIFY_APP_URL` (you'll update it)

### 4.2 Via Vercel CLI (Alternative)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link project
vercel link

# Add environment variables
vercel env add SHOPIFY_API_KEY production
vercel env add SHOPIFY_API_SECRET production
vercel env add DATABASE_URL production
vercel env add SHOPIFY_APP_URL production
vercel env add SCOPES production
vercel env add PORT production
```

---

## 📝 Step 5: Run Database Migrations

Before deploying, you need to set up your database schema.

### 5.1 Set DATABASE_URL Locally (Temporary)

```bash
export DATABASE_URL="your_postgresql_url_here"
```

### 5.2 Generate Prisma Client and Run Migrations

```bash
cd /home/kshitij/work/outblog

# Generate Prisma client for PostgreSQL
npx prisma generate

# Create migration
npx prisma migrate dev --name init_production

# Or if database is empty, push schema directly
npx prisma db push
```

**Note:** Vercel will automatically run `npm run setup` (which includes `prisma migrate deploy`) during deployment.

---

## 📝 Step 6: Deploy to Vercel

### Option A: Deploy via GitHub Integration (Recommended)

1. **Push your code to GitHub:**
   ```bash
   cd /home/kshitij/work/outblog
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Go to Vercel Dashboard:**
   - Click **Add New** → **Project**
   - Select your repository
   - Vercel will auto-detect settings from `vercel.json`
   - Click **Deploy**

3. **Wait for deployment** (usually 2-5 minutes)

4. **Copy your deployment URL** (e.g., `https://outblog-xyz.vercel.app`)

### Option B: Deploy via Vercel CLI

```bash
cd /home/kshitij/work/outblog

# First deployment
vercel --prod

# Follow prompts:
# - Link to existing project? No
# - Project name? outblog
# - Which scope? [Your account]
# - Deploy? Yes
```

**Save your deployment URL!**

---

## 📝 Step 7: Update Shopify Configuration

Now that you have your Vercel URL, update your Shopify app configuration.

### 7.1 Update Environment Variable

Go back to Vercel → Your Project → **Settings** → **Environment Variables**

Update `SHOPIFY_APP_URL` to your actual Vercel URL:
```
https://outblog-xyz.vercel.app
```

### 7.2 Update shopify.app.toml

Edit your local `shopify.app.toml`:

```toml
application_url = "https://your-actual-vercel-url.vercel.app"

[auth]
redirect_urls = [ "https://your-actual-vercel-url.vercel.app/api/auth" ]
```

### 7.3 Deploy Configuration to Shopify

```bash
cd /home/kshitij/work/outblog

# Deploy the updated configuration
shopify app deploy

# Or if you want to use a specific config
shopify app config push
```

This updates your app URLs in the Shopify Partner Dashboard.

### 7.4 Redeploy to Vercel

After updating environment variables, trigger a redeployment:

**Via Dashboard:** Go to Deployments → Click **...** → **Redeploy**

**Via CLI:**
```bash
vercel --prod
```

---

## 📝 Step 8: Test Your Deployed App

### 8.1 Check Health

Visit your deployment URL:
```
https://your-app.vercel.app
```

You should see your Shopify app interface.

### 8.2 Test Installation

1. Go to Shopify Partner Dashboard
2. Navigate to your app
3. Click **Test on development store**
4. Install the app on a test store
5. Verify authentication works
6. Test app functionality

### 8.3 Check Logs

Monitor deployment logs in Vercel:
- Go to your project → **Deployments**
- Click on latest deployment
- View **Function logs** for any errors

---

## 📝 Step 9: Verify Database Connection

Check that your app is correctly using PostgreSQL:

```bash
# Connect to your production database
npx prisma studio --schema=./prisma/schema.prisma

# Or use Vercel's database dashboard
# Or use your database provider's UI (Neon/Supabase dashboard)
```

Verify that:
- Session table exists
- ShopSettings table exists
- OutblogPost table exists

---

## 🔄 Re-deploying Your App (Updates)

When you make changes to your app:

### Via GitHub (Automatic)

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Vercel will automatically deploy on push to main branch.

### Via Vercel CLI (Manual)

```bash
vercel --prod
```

### Update Environment Variables

If you change environment variables:
1. Update in Vercel Dashboard → Settings → Environment Variables
2. Redeploy the app (automatic deployment won't pick up env changes)

---

## ⚠️ Troubleshooting

### Issue: "Cannot connect to database"

**Solution:**
- Verify `DATABASE_URL` is correct in Vercel environment variables
- Check database is accessible (some providers restrict IPs)
- Vercel Functions run in AWS us-east-1 by default

### Issue: "Session storage error"

**Solution:**
- Ensure Prisma migrations ran successfully
- Check Session table exists in database
- Verify PrismaClient is initialized correctly

### Issue: "Module not found" errors

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "Update dependencies"
git push
```

### Issue: "Build timeout"

**Solution:**
- Vercel has 10-minute build timeout
- Check your build logs for hanging processes
- May need to optimize build scripts

### Issue: Shopify OAuth not working

**Solution:**
- Verify `SHOPIFY_APP_URL` matches your Vercel URL exactly
- Check redirect URLs in `shopify.app.toml` are correct
- Run `shopify app deploy` to sync configuration

---

## 📊 Monitoring & Maintenance

### Vercel Analytics

Enable analytics in Vercel dashboard to monitor:
- Request volume
- Response times
- Error rates
- Geographic distribution

### Database Monitoring

- Monitor connection pool usage
- Set up alerts for database errors
- Regular backups (most providers auto-backup)

### Logs

View logs in real-time:
```bash
vercel logs your-deployment-url --follow
```

---

## 🚀 Production Checklist

Before going live with real users:

- [ ] Database is PostgreSQL (not SQLite)
- [ ] Session storage is Prisma-based (not Memory)
- [ ] All environment variables are set correctly
- [ ] `SHOPIFY_API_SECRET` and `DATABASE_URL` marked as secrets
- [ ] App URLs match in Shopify config and Vercel
- [ ] Database migrations completed successfully
- [ ] App tested on development store
- [ ] Error monitoring enabled
- [ ] Database backups configured
- [ ] SSL/HTTPS enabled (automatic with Vercel)

---

## 📚 Additional Resources

- **Shopify Deployment Docs:** https://shopify.dev/docs/apps/launch/deployment/deploy-to-hosting-service
- **Vercel Docs:** https://vercel.com/docs
- **Prisma Docs:** https://www.prisma.io/docs
- **React Router Docs:** https://reactrouter.com/

---

## 🎉 Success!

Your Shopify app is now deployed to Vercel! 

**Next Steps:**
1. Complete Shopify app store review process
2. Set up production monitoring
3. Configure custom domain (optional)
4. Enable Vercel Pro for better performance (optional)

Need help? Check the troubleshooting section or Shopify community forums.
