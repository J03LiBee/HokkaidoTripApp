# Deployment Guide

This guide provides step-by-step instructions for deploying the Hokkaido Trip App to various hosting platforms.

## Prerequisites

Before deployment, ensure you have:

- ✅ Completed local setup and testing
- ✅ Firebase project created and configured
- ✅ Environment variables ready
- ✅ Build tested locally (`npm run build` && `npm run preview`)

## Platform-Specific Guides

### 1. Vercel (Recommended) ⚡

**Pros**: Zero-config, automatic deployments, great DX, free tier

**Steps**:

1. **Install Vercel CLI** (optional, for CLI deployment):
   ```bash
   npm install -g vercel
   ```

2. **Via GitHub** (Recommended):
   - Push your code to GitHub
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your repository
   - Vercel auto-detects Vite configuration

3. **Add Environment Variables**:
   - Go to Project Settings > Environment Variables
   - Add all `VITE_*` variables from your `.env` file
   - Save and redeploy

4. **Deploy**:
   ```bash
   vercel
   ```

**Configuration**: No extra config needed! Vercel auto-detects Vite.

---

### 2. Netlify 🌐

**Pros**: Easy setup, great free tier, edge functions support

**Steps**:

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Via Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   netlify init
   netlify deploy --prod
   ```

3. **Via Web UI**:
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `dist` folder
   - Or connect GitHub repository

4. **Configure Build Settings** (if using Git):
   - Build command: `npm run build`
   - Publish directory: `dist`

5. **Add Environment Variables**:
   - Site Settings > Environment Variables
   - Add all `VITE_*` variables

**netlify.toml** (optional):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### 3. Firebase Hosting 🔥

**Pros**: Integrated with Firebase backend, CDN, free SSL

**Steps**:

1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Initialize Firebase Hosting**:
   ```bash
   firebase init hosting
   ```
   
   Configuration:
   - Public directory: `dist`
   - Single-page app: `Yes`
   - Automatic builds with GitHub: `Optional`

3. **Build the app**:
   ```bash
   npm run build
   ```

4. **Deploy**:
   ```bash
   firebase deploy --only hosting
   ```

**firebase.json**:
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

---

### 4. GitHub Pages 📄

**Pros**: Free, simple, good for demos

**Steps**:

1. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update vite.config.js**:
   ```javascript
   export default defineConfig({
     base: '/HokkaidoTripApp/', // Replace with your repo name
     // ... rest of config
   });
   ```

3. **Add deploy script to package.json**:
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

4. **Deploy**:
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages**:
   - Repository Settings > Pages
   - Source: `gh-pages` branch

---

### 5. Cloudflare Pages ☁️

**Pros**: Global CDN, fast, generous free tier

**Steps**:

1. **Via Git Integration**:
   - Go to [Cloudflare Pages](https://pages.cloudflare.com)
   - Connect your Git repository
   - Configure build:
     - Build command: `npm run build`
     - Build output: `dist`

2. **Add Environment Variables**:
   - Settings > Environment Variables
   - Add all `VITE_*` variables

3. **Deploy**: Automatic on git push!

---

## Environment Variables Checklist

Make sure to add these to your hosting platform:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_APP_ID=hokkaido-2025-v2
```

## Post-Deployment Checklist

- [ ] Test authentication (anonymous sign-in)
- [ ] Test itinerary CRUD operations
- [ ] Test checklist toggle
- [ ] Verify real-time sync works
- [ ] Check responsive design on mobile
- [ ] Verify all environment variables loaded
- [ ] Test on different browsers
- [ ] Check console for errors

## Troubleshooting

### Issue: Blank page after deployment
- **Solution**: Check browser console for errors
- Verify all environment variables are set
- Ensure Firebase configuration is correct

### Issue: 404 on page refresh
- **Solution**: Configure rewrites/redirects for SPA
- Most platforms: redirect all routes to `/index.html`

### Issue: Firebase connection failed
- **Solution**: Check Firebase project permissions
- Verify environment variables are prefixed with `VITE_`
- Ensure Anonymous auth is enabled in Firebase Console

### Issue: Build fails
- **Solution**: 
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  npm run build
  ```

## Custom Domain Setup

### Vercel
1. Domains > Add domain
2. Configure DNS (A/CNAME records)
3. SSL auto-configured

### Netlify
1. Domain Settings > Add custom domain
2. Configure DNS
3. SSL auto-provisioned

### Firebase
1. `firebase hosting:channel:deploy production`
2. Add custom domain in Firebase Console
3. Configure DNS records

## Performance Optimization

1. **Enable Gzip/Brotli compression** (usually automatic)
2. **Configure caching headers**
3. **Enable HTTP/2**
4. **Use CDN** (most platforms include this)

## Continuous Deployment

For automatic deployments on git push:

1. **Connect Git Repository** to your hosting platform
2. **Configure branch**: Usually `main` or `master`
3. **Set build command**: `npm run build`
4. **Set publish directory**: `dist`

Now every push to your repository will trigger a new deployment!

---

**Need help?** Check the platform-specific documentation:
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)

