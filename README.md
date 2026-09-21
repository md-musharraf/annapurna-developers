# Annapurna Developers — Ranchi

> Official website for **Annapurna Developers**, Ranchi's premier waterproofing, civil construction & structural rehabilitation specialist.
> Located in Morabadi, Ranchi (Jharkhand) • Contact: +91 96081 61738 • 4.9★ Rated

---

## 🚀 Vercel Deployment Guide

This project is 100% pre-configured and optimized for Vercel with zero-configuration static serving, security headers, edge caching, and asset compression.

### Option 1: One-Click CLI Deployment (Recommended)

1. Open PowerShell or Terminal in this folder:
   ```bash
   cd "c:\Users\mddil\OneDrive\Pictures\OneDrive\Desktop\anupurna developer"
   ```

2. Authenticate with your Vercel account:
   ```bash
   vercel login
   ```
   *(Select your login provider: GitHub, GitLab, Bitbucket, or Email)*

3. Deploy to Preview:
   ```bash
   vercel
   ```

4. Deploy directly to Production:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via GitHub / GitLab

1. Push this folder to a GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import the repository.
4. Framework Preset: **Other** (Static HTML).
5. Root Directory: `./` (leave default).
6. Build Command: Leave blank (static site).
7. Output Directory: Leave blank or `./`.
8. Click **Deploy**.

---

## ⚡ Performance & Vercel Optimizations Included

- **`vercel.json`**:
  - `cleanUrls: true` (strips `.html` extensions automatically)
  - Security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`)
  - Aggressive 1-year immutable caching on `/images/*` with `Vary: Accept`
  - Stale-while-revalidate 7-day caching on `/css/*` and `/js/*`
  - Zero-cache revalidation on `/index.html` for instant updates
- **Next-Gen WebP Images**: All 13 image assets pre-converted to modern `.webp` saving ~77% bandwidth (~1.6MB total).
- **Core Web Vitals**:
  - `fetchpriority="high"` + `<link rel="preload">` on the LCP hero image
  - Preconnect & dns-prefetch on external CDNs (Google Fonts, FontAwesome, unpkg)
  - `font-display=swap` on Playfair Display & Plus Jakarta Sans
- **SEO Ready**:
  - `sitemap.xml` with priority scores and section anchors
  - `robots.txt` pointing to sitemap
  - Schema.org `LocalBusiness` JSON-LD structured data
  - Open Graph & Twitter Cards

---

## 🛠 Local Development

```bash
# Preview locally with zero dependencies
npm run dev

# Or with Python
python -m http.server 3000
```
Visit `http://localhost:3000` in your browser.

---

## 📁 Project Structure

```
├── index.html          # Main application file (93 KB, 1,600+ lines)
├── vercel.json         # Vercel routing, caching, and security headers
├── package.json        # NPM scripts and project metadata
├── .vercelignore       # Build exclusion list
├── .gitignore          # Git exclusion list (strict secret isolation)
├── robots.txt          # Crawler instructions
├── sitemap.xml         # XML sitemap for search engines
├── css/
│   └── style.css       # Design tokens & responsive styles (65 KB)
├── js/
│   └── script.js       # Lenis smooth scroll, slider, estimator (22 KB)
└── images/             # Both .webp and .jpg versions of all 13 assets
    ├── logo.webp
    ├── hero-engineer.webp
    ├── before-damage.webp
    ├── after-waterproof.webp
    └── ...
```

---

## 🔒 Security Guidelines

- **Zero .env Leaks**: Strictly never create, commit, or deploy `.env` or credential files. Both `.gitignore` and `.vercelignore` actively block all `.env*` patterns.
- No backend API keys or secrets are required for this static presentation site.
