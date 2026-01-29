# 🌾 KisanMitra - Smart Agricultural Assistant

A multilingual agricultural assistance application designed for farmers in India, providing AI-powered farming advice, disease detection, weather updates, and more.

![React](https://img.shields.io/badge/React-18.3-blue)
![Vite](https://img.shields.io/badge/Vite-5.4-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-cyan)
![Firebase](https://img.shields.io/badge/Firebase-11.x-orange)

## ✨ Features

### 🔐 Authentication
- Phone number authentication with OTP
- Firebase Authentication integration
- Secure user sessions
- Onboarding flow with voice input

### 🤖 AI Assistant
- Multilingual chat interface
- Agricultural advisory
- Instant farming advice
- Voice input support

### 📸 Disease Detection
- Crop disease identification
- Photo analysis
- Treatment recommendations
- Medicine suggestions with purchase links

### 🌤️ Weather Integration
- Real-time weather updates
- Location-based forecasts
- Farming recommendations based on weather

### 📰 News & Updates
- Government schemes
- Market prices
- Agricultural news
- Trending updates

### 👤 Profile Management
- User profile with Firestore
- Farm details
- Language preferences
- Location settings

### 🌍 Multilingual Support
- **English** 🇬🇧
- **Hindi (हिंदी)** 🇮🇳
- **Telugu (తెలుగు)** 🇮🇳

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Firebase account
- OpenWeather API key (optional)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd kisan-connect
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your Firebase credentials:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
# ... other Firebase config
```

See [ENV_SETUP.md](./ENV_SETUP.md) for detailed instructions.

4. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:8080`

## 📁 Project Structure

```
kisan-connect/
├── src/
│   ├── pages/              # Page components
│   │   ├── LandingPage.jsx
│   │   ├── AuthPage.jsx
│   │   ├── OnboardingPage.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ChatPage.jsx
│   │   ├── DiseasePage.jsx
│   │   ├── NewsPage.jsx
│   │   └── ProfilePage.jsx
│   ├── components/         # Reusable components
│   │   ├── ui/            # shadcn/ui components
│   │   └── navigation/    # Navigation components
│   ├── contexts/          # React Context providers
│   │   ├── AuthContext.jsx
│   │   └── LanguageContext.jsx
│   ├── services/          # API services
│   │   ├── authService.js
│   │   ├── weatherService.js
│   │   └── mockApi.js
│   ├── config/            # Configuration
│   │   └── firebase.js
│   ├── i18n/              # Internationalization
│   │   ├── index.js
│   │   └── locales/
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   └── index.css          # Global styles
├── .env                   # Environment variables (not in git)
├── .env.example           # Environment template
└── package.json
```

## 🛠️ Tech Stack

### Core
- **React 18.3** - UI framework
- **Vite 5.4** - Build tool
- **Tailwind CSS v4** - Styling
- **JavaScript** - Programming language

### Backend & Database
- **Firebase Authentication** - Phone OTP authentication
- **Cloud Firestore** - User data storage
- **Firebase Analytics** - Usage tracking

### UI Components
- **shadcn/ui** - Component library
- **Radix UI** - Headless UI primitives
- **Lucide React** - Icons
- **Sonner** - Toast notifications

### Internationalization
- **i18next** - Translation framework
- **react-i18next** - React integration

### Other Libraries
- **React Router v6** - Routing
- **React Query** - Server state management
- **Framer Motion** - Animations
- **date-fns** - Date utilities
- **recharts** - Charts

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start dev server (port 8080)

# Build
npm run build           # Production build
npm run build:dev       # Development build

# Preview
npm run preview         # Preview production build

# Linting
npm run lint            # Run ESLint
```

## 🔥 Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or use existing: `kisanconnect-402db`
3. Add a web app to your project

### 2. Enable Authentication

1. Go to Authentication > Sign-in method
2. Enable **Phone** authentication
3. Add authorized domains

### 3. Create Firestore Database

1. Go to Firestore Database
2. Create database (start in production mode)
3. Set up security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 4. Get Configuration

1. Go to Project Settings
2. Scroll to "Your apps"
3. Copy the Firebase configuration
4. Add to `.env` file

See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed instructions.

## 🌐 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Netlify

1. Connect repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables
5. Deploy

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 📱 Features Walkthrough

### Landing Page
- Professional marketing page
- Feature showcase
- Multilingual support
- Call-to-action buttons

### Authentication Flow
1. User enters phone number
2. Receives OTP via SMS
3. Verifies OTP (6 digits)
4. Redirected to onboarding

### Onboarding (4 Steps)
1. **Name** - Text or voice input
2. **Phone** - Confirmation with voice input
3. **Language** - Select preferred language
4. **Location** - Enter farming location

### Dashboard
- Weather widget
- Quick actions
- Recent activity
- Navigation to features

### AI Chat
- Ask farming questions
- Get instant answers
- Voice input support
- Suggested questions

### Disease Detection
- Upload or capture photo
- AI analysis
- Disease identification
- Treatment steps
- Medicine recommendations

### News Feed
- Government schemes
- Market prices
- Agricultural news
- Trending updates

### Profile
- Edit personal information
- Update farm details
- Change language
- Logout option

## 🎤 Voice Input

The app supports voice input for:
- **Name entry** (Onboarding)
- **Phone number** (Onboarding)
- **Chat messages** (AI Assistant)

Uses Web Speech API with support for:
- English (en-IN)
- Hindi (hi-IN)
- Telugu (te-IN)

## 🌍 Internationalization

### Adding New Language

1. Create translation file: `src/i18n/locales/[code].json`
2. Add language to `src/i18n/index.js`:
```javascript
export const languages = [
  // ... existing languages
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
];
```
3. Import and add to i18n resources

### Translation Keys

All translations are in JSON format:
```json
{
  "common": {
    "appName": "KisanMitra",
    "loading": "Loading..."
  },
  "auth": {
    "welcome": "Welcome"
  }
}
```

## 🔒 Security

- Firebase Authentication for secure login
- Firestore security rules
- Environment variables for sensitive data
- HTTPS only in production
- reCAPTCHA for phone authentication

## 📊 Performance

- Code splitting with React.lazy
- Image optimization
- Lazy loading
- Service worker ready
- Lighthouse score: 90+

## 🐛 Troubleshooting

### Firebase Connection Issues
- Check `.env` file has correct values
- Verify Firebase project is active
- Check authorized domains in Firebase Console

### Voice Input Not Working
- Ensure HTTPS (required for Web Speech API)
- Check browser compatibility
- Allow microphone permissions

### Build Errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `rm -rf dist`
- Check Node.js version: `node --version` (should be 18+)

## 📚 Documentation

- [Firebase Setup](./FIREBASE_SETUP.md) - Detailed Firebase configuration
- [Environment Variables](./ENV_SETUP.md) - Environment setup guide
- [Deployment](./DEPLOYMENT.md) - Deployment instructions
- [Conversion Summary](./CONVERSION_SUMMARY.md) - Project conversion details

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Development Team - KisanMitra

## 🙏 Acknowledgments

- Firebase for authentication and database
- shadcn/ui for beautiful components
- OpenWeather for weather data
- All farmers who inspired this project

## 📞 Support

For support, email support@kisanmitra.com or open an issue.

---

Made with ❤️ for Indian Farmers
