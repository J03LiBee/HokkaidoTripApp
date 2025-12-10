# 北海道冬之旅 ❄️ - Hokkaido Trip App

A modern, responsive trip planning application built with React, Firebase, and Tailwind CSS. This app helps you organize your Hokkaido winter vacation with itinerary planning, packing checklists, and budget tracking.

## 🌟 Features

- **📅 Interactive Itinerary**: Grid-based calendar view for day-by-day trip planning
- **✅ Packing Checklist**: Organized checklist categorized by importance
- **💰 Budget Tracker**: Monitor expenses and payment status
- **📊 Dashboard**: Overview with countdown, next event, and quick stats
- **🔄 Real-time Sync**: Automatic data synchronization using Firebase Firestore
- **❄️ Beautiful UI**: Winter-themed interface with snowfall animations
- **📱 Responsive**: Works seamlessly on desktop and mobile devices

## 🏗️ Project Structure

```
HokkaidoTripApp/
├── src/
│   ├── components/          # React components
│   │   ├── common/          # Reusable UI components
│   │   ├── layout/          # Layout components (Header, Nav)
│   │   ├── modals/          # Modal dialogs
│   │   └── views/           # Main view components
│   ├── constants/           # App constants and initial data
│   ├── hooks/              # Custom React hooks
│   ├── services/           # Firebase and external services
│   ├── styles/             # Global styles
│   ├── utils/              # Utility functions
│   ├── App.jsx             # Main app component
│   └── main.jsx            # Application entry point
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── .env.example            # Environment variables template

```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**

```bash
cd HokkaidoTripApp
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure Firebase**

Create a `.env` file in the root directory by copying `.env.example`:

```bash
cp .env.example .env
```

Fill in your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_APP_ID=hokkaido-2025-v2
```

4. **Start development server**

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 📦 Build for Production

Build the application for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## 🌐 Deployment

### Option 1: Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts and add environment variables in Vercel dashboard

### Option 2: Netlify

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to Netlify
3. Add environment variables in Netlify dashboard

### Option 3: Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Initialize Firebase:
```bash
firebase init hosting
```

3. Build and deploy:
```bash
npm run build
firebase deploy
```

## 🔧 Configuration

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Firestore Database**
3. Enable **Authentication** > **Anonymous** sign-in method
4. Set Firestore security rules:

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

### Path Aliases

The project uses path aliases configured in `vite.config.js`:

- `@` → `./src`
- `@components` → `./src/components`
- `@hooks` → `./src/hooks`
- `@utils` → `./src/utils`
- `@services` → `./src/services`
- `@constants` → `./src/constants`

## 📱 Usage

### Dashboard
- View countdown to trip
- See next upcoming event
- Quick access to budget and checklist status

### Itinerary
- Click any time slot to add an event
- Click existing events to edit or delete
- Color-coded by type (activity, food, transport, stay)

### Checklist
- Click items to mark as checked/unchecked
- Organized by category

### Budget
- View all expenses
- Track payment status

## 🛠️ Technology Stack

- **Frontend**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Firestore + Authentication)
- **Icons**: Lucide React
- **Language**: JavaScript (ES6+)

## 📄 License

This project is open source and available for personal use.

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Powered by [Firebase](https://firebase.google.com/)
- Built with [Vite](https://vitejs.dev/) and [React](https://react.dev/)

---

**Enjoy planning your Hokkaido trip! ❄️🗾**

