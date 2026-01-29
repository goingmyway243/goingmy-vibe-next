# GoingMy Vibe Next - AI Coding Assistant Instructions

## Project Overview

This is a **social networking app** ("Vibe") built with Next.js 16 App Router, React 19, TypeScript 5, and Tailwind CSS v4. Features include user authentication, feed posts, profiles, and theme management.

## Tech Stack & Key Dependencies

- **Framework**: Next.js 16.1.4 (App Router architecture)
- **React**: 19.2.3 (with Context API for state management)
- **Styling**: Tailwind CSS v4 with PostCSS plugin, dark mode support
- **Testing**: Jest 30 + React Testing Library + @testing-library/user-event
- **Icons**: lucide-react for all UI icons
- **TypeScript**: Strict mode enabled - all types must be explicit
- **Date handling**: date-fns library

## Project Architecture

```
app/
  layout.tsx                    # Root - wraps with ThemeProvider > AuthProvider
  page.tsx                      # Homepage (redirects or landing)
  globals.css                   # Tailwind v4 imports + CSS variables
  
  context/                      # Global state management
    AuthContext.tsx            # Mock auth with localStorage persistence
    ThemeContext.tsx           # Theme (light/dark/system) with matchMedia
    __tests__/                 # Context tests (8 tests each)
  
  components/
    auth/                      # LoginForm, SignupForm
    feed/                      # PostCard, CreatePost
    shared/                    # Button, Input, Avatar, Navbar, ThemeToggle
    
  [route]/
    layout.tsx                 # Route-specific layouts (must use 'use client' if using context)
    page.tsx                   # Route pages
    
types/
  index.ts                     # Shared interfaces: User, Post, Comment
```

## Critical Development Patterns

### 1. **Context API Usage Pattern**
All global state uses React Context. **Critical**: Contexts require `'use client'` directive.

```tsx
// app/context/AuthContext.tsx pattern
'use client';
import { createContext, useContext } from 'react';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // State management with localStorage persistence
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);
  
  return <AuthContext.Provider value={{...}}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
```

**Provider nesting order in layout.tsx**: `ThemeProvider > AuthProvider > {children}`

### 2. **'use client' Directive Rules**
Mark components with `'use client'` when they use:
- Event handlers (onClick, onChange, onSubmit)
- React hooks (useState, useEffect, useContext, useRef)
- Browser APIs (localStorage, window.matchMedia)
- Context consumers (useAuth, useTheme)

**All route layouts using contexts need `'use client'`** (see `app/feed/layout.tsx`, `app/settings/layout.tsx`)

### 3. **Styling with Tailwind v4**
- **Import**: `@import "tailwindcss"` in globals.css (NOT `@tailwind` directives)
- **Theme variables**: Define in `@theme inline {}` block in globals.css
- **Dark mode**: Use `dark:` prefix classes + `prefers-color-scheme` media query
- **Component pattern**: Inline utility classes only (no component CSS files)
- **Responsive**: Mobile-first with `sm:`, `md:`, `lg:` breakpoints

Example from ThemeToggle:
```tsx
<button className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700">
```

### 4. **Theme System Architecture**
- `ThemeContext` manages 'light' | 'dark' | 'system' preference
- Applies/removes `dark` class on `<html>` element via useEffect
- Listens to `matchMedia('(prefers-color-scheme: dark)')` changes
- Persists to localStorage as 'theme' key
- **Access via**: `const { theme, setTheme, resolvedTheme } = useTheme()`

### 5. **Mock Data & Authentication**
Auth is **mock-only** - no backend. See `app/context/AuthContext.tsx`:
- Hardcoded MOCK_USERS array with pre-existing users
- Email: `john@example.com` / `jane@example.com`, Password: `password123`
- localStorage key: `'user'` stores current user JSON
- Sign up creates new user with auto-generated ID (Date.now())
- **Type definitions in `types/index.ts`**: User, Post, Comment interfaces

### 6. **Testing Best Practices**
All components have co-located tests in `__tests__/` directories:

```bash
npm test -- ComponentName.test.tsx    # Run specific test
npm run test:watch                    # Watch mode
npm run test:coverage                 # Coverage report
```

**Critical test setup (jest.setup.ts)**:
- Mocks `next/navigation` (useRouter, usePathname)
- Mocks localStorage with jest.fn() implementations
- Mocks matchMedia for theme tests
- Imports `@testing-library/jest-dom` for matchers

**Test pattern for color verification**:
```tsx
// Check Tailwind color classes with documented hex/RGB values
expect(element).toHaveClass('bg-gray-100'); // #f3f4f6 = rgb(243, 244, 246)
expect(element).toHaveClass('text-indigo-600'); // #4f46e5 = rgb(79, 70, 229)
```
Don't use `getComputedStyle()` - jsdom doesn't compute CSS properly.

### 7. **TypeScript & Import Aliases**
- Path alias: `@/*` maps to project root (`@/app/...`, `@/types/...`)
- JSX mode: `react-jsx` (no React import needed)
- Strict mode - all types explicit, no `any`
- Share types via `types/index.ts` exports

## Development Workflow

### Essential Commands
```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build (run before deploying)
npm start        # Serve production build locally
npm run lint     # Run ESLint (checks .ts, .tsx, .mts files)
```

### ESLint Configuration
- Uses ESLint 9 flat config format (`eslint.config.mjs`)
- Ignores: `.next/`, `out/`, `build/`, `next-env.d.ts`
- Enforces Next.js best practices and TypeScript rules

## Component Creation Guidelines

1. **Default to Server Components** - only add `'use client'` when needed for:
   - Event handlers (onClick, onChange, etc.)
   - Browser APIs (window, localStorage)
   - React hooks (useState, useEffect, etc.)

2. **Type all Props** explicitly:
   ```tsx
   interface PageProps {
     params: { id: string };
     searchParams: { [key: string]: string | string[] | undefined };
   }
   ```

3. **Follow responsive design patterns** from `app/page.tsx`:
   - Mobile-first with `sm:`, `md:` breakpoints
   - Flexbox layouts with `flex-col` mobile, `sm:flex-row` desktop

## Common Pitfalls

- **Don't import React** - JSX transform handles it (`jsx: "react-jsx"`)
- **Don't use .js extensions** - TypeScript project uses `.ts`/`.tsx` only
- **Don't modify `next-env.d.ts`** - auto-generated by Next.js
- **Tailwind v4 differences**: Uses `@import "tailwindcss"` instead of `@tailwind` directives

## When Adding New Features

1. **New pages**: Create `app/[route]/page.tsx` 
2. **Shared layouts**: Create `app/[route]/layout.tsx`
3. **API routes**: Create `app/api/[route]/route.ts` (export GET, POST functions)
4. **Components**: Create in `app/components/` or colocate with routes
5. **Types**: Add to `types/index.ts` or export from component files
6. **Tests**: Create `__tests__/ComponentName.test.tsx` next to component
