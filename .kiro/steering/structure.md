# Project Structure

## Root Configuration
- `vite.config.ts` - Vite configuration with path aliases, SWC plugin, and Tailwind CSS v4
- `components.json` - shadcn/ui component configuration

## Source Directory (`src/`)

### Entry Points
- `main.jsx` - Application entry point, renders App component
- `App.jsx` - Root component with providers and routing setup
- `router.jsx` - Legacy router configuration (not actively used)

### Pages (`src/pages/`)
All page components for main routes:
- `LandingPage.jsx` - Marketing landing page
- `AuthPage.jsx` - Phone-based authentication
- `Dashboard.jsx` - Main dashboard with weather
- `ChatPage.jsx` - AI chat interface
- `DiseasePage.jsx` - Disease detection
- `NewsPage.jsx` - Agricultural news
- `ProfilePage.jsx` - User profile management
- `NotFound.jsx` - 404 page
- `Index.jsx` - Welcome/landing page (legacy)

### Components (`src/components/`)
- `ui/` - shadcn/ui components (Radix UI wrappers)
- `navigation/BottomNav.jsx` - Mobile bottom navigation
- `NavLink.jsx` - Custom navigation link component

### State Management (`src/contexts/`)
- `AuthContext.jsx` - Authentication state and user management
- `LanguageContext.jsx` - i18n language switching

### Internationalization (`src/i18n/`)
- `index.js` - i18next configuration
- `locales/` - Translation files (en.json, hi.json, te.json)

### Services (`src/api/`, `src/services/`)
- `api/mockApi.js` - Mock API for development
- `services/weatherService.js` - Weather data integration
- `services/authService.js` - Firebase authentication service

### Configuration (`src/config/`)
- `firebase.js` - Firebase configuration and initialization

### Utilities (`src/lib/`)
- `utils.js` - Utility functions (cn for className merging)

### Hooks (`src/hooks/`)
- `use-mobile.jsx` - Mobile detection hook
- `use-toast.js` - Toast notification hook

## Styling
- `src/index.css` - Global styles and CSS variables
- `src/App.css` - App-specific styles

## Architecture Patterns

### Component Organization
- Page components in `pages/` directory
- Reusable UI components in `components/ui/`
- Feature-specific components in `components/[feature]/`

### State Management
- Context API for global state (auth, language)
- React Query for server state
- Firebase Authentication for user sessions
- Firestore for user data persistence

### Routing
- React Router v6 with BrowserRouter
- Route definitions in App.tsx
- Protected routes via AuthContext

### Styling Conventions
- Tailwind CSS v4 utility classes
- CSS custom properties for theming (OKLCH color system)
- Theme configuration in `@theme` block in index.css
- Use `cn()` utility from `@/lib/utils` for conditional classes

### Internationalization
- Translation keys in JSON files
- Use `useLanguage()` hook for language switching
- Use `t()` function for translations
- Font families configured per language (Devanagari, Telugu)

### Code Quality
- Zod schemas for form validation
- PropTypes for component validation (optional)
