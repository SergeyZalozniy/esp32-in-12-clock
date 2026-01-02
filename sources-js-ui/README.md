# Nixie Clock

A nixie clock web application built with Vanilla TypeScript + Vite + SCSS

## Tech Stack

- **TypeScript** - Type-safe modern JavaScript
- **Vite** - Fast dev server and build tool
- **SCSS** - CSS preprocessor
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Commands

### Development
```bash
npm start
# or
npm run dev
```
Starts dev server with hot reload at `http://localhost:5173`

### Production Build
```bash
npm run build
```
Type-checks TypeScript and creates optimized build in `dist/` folder

### Type Checking
```bash
npm run type-check
```
Checks TypeScript types without building

### Linting
```bash
npm run lint        # Check code
npm run lint:fix    # Auto-fix issues
```

### Formatting
```bash
npm run format
```

## Project Structure

```
nixie-clock/
├── src/
│   ├── script/         # TypeScript files
│   │   └── index.ts    # Entry point
│   ├── styles/         # SCSS styles
│   │   ├── main.scss   # Main styles file
│   │   ├── reset.scss  # CSS reset
│   │   └── header.scss # Component styles
│   ├── components/     # Components (Web Components)
│   ├── assets/         # Static assets
│   └── vite-env.d.ts   # TypeScript types for Vite
├── public/             # Public files
│   └── clock.svg       # Icon
├── index.html          # HTML entry point
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Dependencies and scripts
```

## Path Aliases

Configured aliases for convenient imports:

```typescript
import '@styles/main.scss';
import '@scripts/utils';
import '@components/NixieDigit';
import '@assets/image.png';
```

## Getting Started

1. Install dependencies: `npm install`
2. Start dev server: `npm start`
3. Open browser at `http://localhost:5173`
