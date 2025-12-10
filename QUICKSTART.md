# Quick Start Guide

Get your Hokkaido Trip App up and running in 5 minutes! ⚡

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Configure Firebase

### Option A: Quick Test (Use Demo Config)

For quick testing, you can use Firebase's demo mode:

1. Create `.env` file:
```bash
cp .env.example .env
```

2. Update with test values:
```env
VITE_FIREBASE_API_KEY=demo-api-key
VITE_FIREBASE_AUTH_DOMAIN=demo.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=demo-project
VITE_FIREBASE_STORAGE_BUCKET=demo.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=demo-app-id
VITE_APP_ID=hokkaido-2025-v2
```

⚠️ **Note**: Demo config won't persist data. For real usage, follow Option B.

### Option B: Production Setup (Recommended)

1. **Create Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add Project"
   - Follow the wizard

2. **Enable Services**:
   - **Firestore Database**: 
     - Click "Create Database"
     - Start in "Test Mode" (change later)
   - **Authentication**:
     - Click "Get Started"
     - Enable "Anonymous" sign-in method

3. **Get Configuration**:
   - Project Settings (⚙️ icon) > General
   - Scroll to "Your apps" > Web app
   - Copy the configuration values

4. **Update `.env`**:
```bash
cp .env.example .env
```

Paste your Firebase config:
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-app
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123
VITE_APP_ID=hokkaido-2025-v2
```

5. **Set Firestore Security Rules**:

Go to Firestore > Rules and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /artifacts/{appId}/users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Click "Publish"

## Step 3: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## Step 4: Test Features

### ✅ Dashboard
- You should see a countdown to December 31, 2025
- Budget summary showing $6,168
- Checklist progress
- Next upcoming event

### ✅ Itinerary
- Click any time slot to add an event
- Click existing events to edit
- Test delete functionality

### ✅ Checklist
- Click items to check/uncheck
- Progress updates in real-time

### ✅ Budget
- View expense list
- Check payment statuses

## Step 5: Build for Production

```bash
npm run build
```

Preview the build:
```bash
npm run preview
```

## Common Issues & Solutions

### Issue: "npm: command not found"
**Solution**: Install [Node.js](https://nodejs.org/) (v18 or higher)

### Issue: "Module not found" errors
**Solution**: 
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Blank screen
**Solution**: 
1. Open browser console (F12)
2. Check for errors
3. Verify `.env` file exists and has correct values
4. Make sure Firebase Anonymous auth is enabled

### Issue: Data not saving
**Solution**: 
1. Check Firebase Console > Firestore Database is created
2. Verify security rules are set
3. Check Anonymous authentication is enabled
4. Open browser console for error messages

## What's Next?

- 📖 Read [README.md](README.md) for detailed documentation
- 🚀 See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment guides
- 🔄 Check [MIGRATION.md](MIGRATION.md) to understand the architecture

## Useful Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Deployment
vercel              # Deploy to Vercel
netlify deploy      # Deploy to Netlify
firebase deploy     # Deploy to Firebase
```

## Project Structure Overview

```
src/
├── components/     # React components
│   ├── common/     # Reusable UI (Modal, Snowfall)
│   ├── layout/     # Layout (Header, Nav)
│   ├── modals/     # Dialogs (EventModal)
│   └── views/      # Main views (Dashboard, etc.)
├── hooks/          # Custom hooks (useAuth, etc.)
├── services/       # Firebase services
├── utils/          # Helper functions
├── constants/      # App constants
└── styles/         # Global CSS
```

## Need Help?

1. Check the [README.md](README.md)
2. Review [DEPLOYMENT.md](DEPLOYMENT.md)
3. Read [MIGRATION.md](MIGRATION.md)
4. Search existing issues on GitHub

---

**Happy coding! ❄️ Enjoy your Hokkaido trip planning!**

