# Deployment Guide for My Fitness Pro

## Quick Deployment Options

### 🚀 Option 1: Vercel (Recommended - Easiest for Next.js)

**Pros:**
- Made by Next.js creators, optimized for Next.js
- Free tier includes SSL, CDN, and automatic deployments
- Easy PostgreSQL integration via Supabase or Neon
- Automatic Prisma migrations on deploy

**Steps:**

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Set up PostgreSQL Database:**
   - Option A: Use **Supabase** (recommended - free tier available)
     - Go to https://supabase.com
     - Create new project
     - Copy the connection string from Settings → Database
   
   - Option B: Use **Neon** (serverless PostgreSQL)
     - Go to https://neon.tech
     - Create new project
     - Copy connection string

3. **Deploy to Vercel:**
   - Go to https://vercel.com
   - Sign in with GitHub
   - Click "Add New Project"
   - Import your repository
   - Configure environment variables:
     ```
     DATABASE_URL=postgresql://...
     NEXTAUTH_SECRET=your-secret-key-here (generate with: openssl rand -base64 32)
     NEXTAUTH_URL=https://your-app.vercel.app
     ```
   - Click "Deploy"

4. **Run Database Migrations:**
   ```bash
   # On Vercel dashboard, go to your project → Settings → Build & Development Settings
   # Add build command: npm run build
   # Add install command: npm install && npx prisma generate
   
   # Or manually run migrations after first deploy:
   npx prisma migrate deploy
   ```

**Cost:** Free tier available, scales automatically

---

### 🚂 Option 2: Railway (All-in-one Solution)

**Pros:**
- Can provision PostgreSQL database directly
- Simple environment variable management
- Automatic deployments from GitHub

**Steps:**

1. **Push code to GitHub** (same as above)

2. **Deploy on Railway:**
   - Go to https://railway.app
   - Sign in with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

3. **Add PostgreSQL Database:**
   - In your project dashboard, click "+ New"
   - Select "Database" → "Add PostgreSQL"
   - Railway automatically creates `DATABASE_URL` environment variable

4. **Configure Environment Variables:**
   - Go to your service → Variables tab
   - Add:
     ```
     NEXTAUTH_SECRET=your-secret-key
     NEXTAUTH_URL=https://your-app.up.railway.app
     ```

5. **Run Migrations:**
   - Railway will automatically run `postinstall` script (prisma generate)
   - Run migrations via Railway CLI or manually:
     ```bash
     railway run npx prisma migrate deploy
     ```

**Cost:** $5/month starter plan, includes database

---

### 🌐 Option 3: Render (Good Free Tier)

**Pros:**
- Generous free tier
- Built-in PostgreSQL option
- Easy setup

**Steps:**

1. **Push code to GitHub**

2. **Create Web Service on Render:**
   - Go to https://render.com
   - Sign in with GitHub
   - Click "New +" → "Web Service"
   - Connect your repository

3. **Configure Build Settings:**
   - Build Command: `npm run build`
   - Start Command: `npm start`

4. **Add PostgreSQL Database:**
   - Click "New +" → "PostgreSQL"
   - Copy the internal database URL

5. **Set Environment Variables:**
   - In your Web Service settings → Environment
   - Add:
     ```
     DATABASE_URL=<from PostgreSQL service>
     NEXTAUTH_SECRET=<generate with openssl rand -base64 32>
     NEXTAUTH_URL=https://your-app.onrender.com
     ```

6. **Run Migrations:**
   - Use Render Shell or add to build command

**Cost:** Free tier available (sleeps after inactivity), $7/month for always-on

---

## Required Environment Variables

Make sure to set these in your deployment platform:

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# NextAuth
NEXTAUTH_SECRET=your-random-secret-key-here
NEXTAUTH_URL=https://your-domain.com

# Optional - for production optimizations
NODE_ENV=production
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

---

## Pre-Deployment Checklist

- [ ] Push code to GitHub/GitLab/Bitbucket
- [ ] Set up PostgreSQL database (Supabase/Neon/Railway/etc.)
- [ ] Run database migrations locally to test:
  ```bash
  npx prisma migrate deploy
  ```
- [ ] Update `NEXTAUTH_URL` in production environment
- [ ] Generate and set `NEXTAUTH_SECRET`
- [ ] Test build locally:
  ```bash
  npm run build
  npm start
  ```
- [ ] Ensure `.env` is in `.gitignore` (never commit secrets!)

---

## Database Migration Commands

### For Vercel (after deployment):
```bash
# Install Vercel CLI
npm i -g vercel

# Link to your project
vercel link

# Run migrations
vercel env pull .env.production
npx prisma migrate deploy
```

### For Railway:
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and run migrations
railway login
railway run npx prisma migrate deploy
```

---

## Post-Deployment

1. **Verify database connection** - Check if tables are created
2. **Test authentication** - Try signing up/logging in
3. **Test API routes** - Verify workouts API works
4. **Set up custom domain** (optional) - Most platforms support this

---

## Recommended Stack

**Best combination for your app:**
- **Frontend/Backend:** Vercel (optimized for Next.js)
- **Database:** Supabase PostgreSQL (free tier, good performance)
- **Alternative:** Railway (all-in-one, $5/month)

---

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment

