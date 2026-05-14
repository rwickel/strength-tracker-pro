# Installation & Setup Guide

Run the following commands to set up the **OneRep Strength Tracker** project for development and mobile deployment.

## 1. Prerequisites
Ensure you have the following installed on your system:
- **Node.js** (v18+)
- **Git**
- **Android Studio** (for Android builds)

## 2. One-Click Setup Script (PowerShell)
Copy and paste this into your terminal inside the project folder:

```powershell
# Install project dependencies
npm install

# Build the production web assets
npm run build

# Initialize and sync Capacitor
npx cap sync

# Optional: Generate mobile icons (requires icon.png in assets folder)
# npm install -D @capacitor/assets
# npx @capacitor/assets generate --android
```

## 3. Core Libraries Used
The project relies on these high-performance libraries:

### Frontend
- `react` & `react-dom` (v19)
- `@tanstack/react-router` (Type-safe routing)
- `@tanstack/react-query` (State & Data fetching)
- `tailwindcss` (Styling)
- `lucide-react` (Icons)
- `recharts` (Data visualization)
- `date-fns` (Date manipulation)

### UI Components (Shadcn/UI)
- Radix UI primitives (Accordion, Dialog, Select, etc.)
- `vaul` (Drawer components)
- `sonner` (Toast notifications)

### Native / Mobile
- `@capacitor/core` & `@capacitor/cli`
- `@capacitor/android`
- `@capacitor/assets` (Icon generation)

## 4. Development Commands
- **Start Dev Server:** `npm run dev`
- **Build Web App:** `npm run build`
- **Open Android Studio:** `npx cap open android`
