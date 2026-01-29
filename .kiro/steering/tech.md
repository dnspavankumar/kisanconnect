# Technology Stack

## Core Technologies
- **Build Tool**: Vite 5.4
- **Framework**: React 18.3 with JavaScript
- **Bundler**: SWC (via @vitejs/plugin-react-swc)
- **Styling**: Tailwind CSS v4 with @tailwindcss/vite plugin
- **UI Components**: shadcn/ui (Radix UI primitives)

## Key Libraries
- **Authentication**: Firebase 11.x (Auth + Firestore)
- **Routing**: react-router-dom 6.30
- **State Management**: React Context API + @tanstack/react-query 5.83
- **Forms**: react-hook-form 7.70 + @hookform/resolvers + zod 3.25
- **Internationalization**: i18next 25.7 + react-i18next 16.5
- **HTTP Client**: axios 1.13
- **Icons**: lucide-react 0.462
- **Animations**: framer-motion 12.23
- **Notifications**: sonner 1.7
- **Date Handling**: date-fns 3.6
- **Charts**: recharts 2.15

## Development Tools
- **Linting**: ESLint 9.32

## Common Commands

```bash
# Development server (port 8080)
npm run dev

# Production build
npm run build

# Development build
npm run build:dev

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Path Aliases
- `@/*` maps to `./src/*`
