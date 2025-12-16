# QUICK DEPLOYMENT GUIDE

## 🚀 Deploy to Vercel in 3 Steps

### Step 1: Install Vercel CLI
```bash
npm install
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```
Follow the prompts to authenticate.

### Step 3: Deploy!
```bash
vercel --prod
```

That's it! Your site will be live at the URL provided by Vercel.

---

## 🔗 Alternative: GitHub + Vercel

### 1. Initialize Git & Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit - JSHA Web App"
git remote add origin https://github.com/YOUR_USERNAME/jsha.git
git branch -M main
git push -u origin main
```

### 2. Import in Vercel Dashboard
1. Go to https://vercel.com/new
2. Click "Import Project"
3. Select your GitHub repository
4. Click "Deploy"

---

## ✅ Testing Locally First (Recommended)

```bash
cd c:\Users\jake7\IdeaProjects\Streethockey
npm install
npm run dev
```

Open: http://localhost:3000

Test all pages:
- Home: http://localhost:3000/?page=home
- Photos: http://localhost:3000/?page=photos
- Stats: http://localhost:3000/?page=stats
- Admin: http://localhost:3000/?page=admin-upload (password: jsha2025)

---

## 📋 Project Checklist

- [x] 10 Web Components Created
  - [x] jsha-logo
  - [x] jsha-header
  - [x] jsha-footer
  - [x] jsha-hero-banner
  - [x] jsha-cta-button
  - [x] jsha-upcoming-games
  - [x] jsha-photo-card
  - [x] jsha-modal
  - [x] jsha-stats-table
  - [x] jsha-upload-form

- [x] 4 Pages with Routing
  - [x] Home (with hero, news, games, sponsors)
  - [x] Photos (Instagram-style grid)
  - [x] Stats (team & player statistics)
  - [x] Admin Upload (password protected)

- [x] 5 API Endpoints
  - [x] /api/menu
  - [x] /api/schedule
  - [x] /api/photos
  - [x] /api/stats
  - [x] /api/upload

- [x] Branding & Design
  - [x] Custom color scheme
  - [x] Responsive layout
  - [x] Dark mode support
  - [x] Mobile hamburger menu

- [x] Deployment Ready
  - [x] vercel.json configured
  - [x] .gitignore set up
  - [x] package.json ready

---

## 🎯 Next Steps After Deployment

1. **Custom Domain** (optional)
   - Go to Vercel Dashboard > Settings > Domains
   - Add your custom domain (e.g., jsha.com)

2. **Environment Variables** (for production)
   - Dashboard > Settings > Environment Variables
   - Add: ADMIN_PASSWORD, API_SECRET, etc.

3. **Analytics** (optional)
   - Enable Vercel Analytics in dashboard
   - Track visitor stats

4. **Continuous Deployment**
   - Any push to your GitHub main branch = automatic deployment
   - Perfect for updates!

---

## 🆘 Need Help?

Check the full README.md for:
- Troubleshooting guide
- Customization instructions
- Security recommendations
- Performance tips

**Ready to go live? Run: `vercel --prod`** 🚀
