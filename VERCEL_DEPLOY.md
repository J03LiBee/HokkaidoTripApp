# Vercel Deployment Guide 🚀

## ✅ Issues Fixed

1. **Blank page issue**: Removed conflicting root `main.jsx` file
2. **Snow visibility**: Updated snow to darker blue with gradient (visible on light background)
3. **Build warnings**: These are safe to ignore (they're about outdated dependencies)

---

## Quick Deploy to Vercel

### Method 1: Via Vercel Dashboard (Easiest)

1. **Push to GitHub** (if not done already):
```bash
git add .
git commit -m "Fix: Remove conflicting main.jsx and improve snow visibility"
git push origin main
```

2. **Go to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Click "Add New" > "Project"
   - Import your GitHub repo: `J03LiBee/HokkaidoTripApp`

3. **Configure Environment Variables**:
   Click "Environment Variables" and add these:
   ```
   VITE_FIREBASE_API_KEY=AIzaSyBEslfg-pYzciTrfOwgyvQm9F_ow_5YHYo
   VITE_FIREBASE_AUTH_DOMAIN=hokkaidowebapp.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=hokkaidowebapp
   VITE_FIREBASE_STORAGE_BUCKET=hokkaidowebapp.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=975455254658
   VITE_FIREBASE_APP_ID=1:975455254658:web:483047a19033b2ede55c9b
   VITE_APP_ID=hokkaido-2025-v2
   ```

4. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes
   - Done! 🎉

---

### Method 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? HokkaidoTripApp
# - Directory? ./
# - Override settings? No
```

Then add environment variables via dashboard or CLI.

---

## Expected Build Output

✅ **Normal warnings** (safe to ignore):
```
- npm WARN deprecated rimraf@3.0.2
- npm WARN deprecated eslint@8.57.1
- Chunk size warning (optional optimization)
```

✅ **Successful build**:
```
✓ built in XXs
✓ Deploying...
✓ Deployment ready!
```

---

## After Deployment Checklist

### 1. Test the App
- [ ] Login with Google works
- [ ] Anonymous login works
- [ ] Can add/edit itinerary items
- [ ] Data persists after refresh
- [ ] Snowfall is visible ❄️
- [ ] Mobile view works

### 2. Check Firebase Console
- [ ] See authentication events
- [ ] See Firestore writes
- [ ] No errors in logs

### 3. Performance Check
- [ ] Page loads quickly (< 3 seconds)
- [ ] No console errors (F12)
- [ ] Images/icons load properly

---

## Troubleshooting

### Issue: Still blank page
**Solution**:
1. Check browser console (F12) for errors
2. Verify environment variables are set in Vercel
3. Check build logs in Vercel dashboard

### Issue: Firebase errors
**Solution**:
1. Verify Firebase config in Vercel environment variables
2. Check Firebase Console > Authentication is enabled
3. Make sure domain is authorized in Firebase

### Issue: Can't see snowfall
**Solution**: Clear browser cache and hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

---

## Production URL

After deployment, your app will be available at:
```
https://hokkaido-trip-app-xxxx.vercel.app
```

You can also add a custom domain in Vercel settings!

---

## Updates & Redeployment

Any push to `main` branch will auto-deploy:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Vercel will automatically rebuild and redeploy! 🔄

---

## Performance Optimization (Optional)

After successful deployment, consider:
- Enable Vercel Analytics
- Set up custom domain
- Enable Edge caching
- Add monitoring

---

**Need help?** Check [Vercel Documentation](https://vercel.com/docs) or the build logs in Vercel Dashboard.


