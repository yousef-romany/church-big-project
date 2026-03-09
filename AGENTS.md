# AGENTS.md

This file provides guidelines for AI agents working on the Church Management System codebase.

## Project Overview

This is a Next.js 15 application for comprehensive church management with role-based portals for different user types (admin, priests, servants, parents, children). It uses TypeScript, Prisma ORM with PostgreSQL, Tailwind CSS, and ShadCN UI components.

## Build & Development Commands

### Primary Commands
- `npm run dev` - Start development server with Turbopack (http://localhost:3000)
- `npm run build` - Build application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality checks
- `npm run typecheck` - Run TypeScript compiler type checking without emitting files

### Database Commands
- `npx prisma db push` - Push schema changes to database (use after modifying prisma/schema.prisma)
- `npm run prisma:generate` - Generate Prisma Client

### AI Development
- `npm run genkit:dev` - Start Genkit development server for AI features
- `npm run genkit:watch` - Start Genkit with file watching

### Testing
No testing framework is currently configured in this project.

## Code Style Guidelines

### File Structure
```
src/
├── app/                    # Next.js app router pages
│   ├── auth/              # Authentication pages
│   ├── [panel-name]/      # Role-based panels (e.g., visitation-servant-panel)
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # ShadCN UI components
│   ├── shared/            # Shared components across features
│   └── [feature]/         # Feature-specific components
├── hooks/                 # Custom React hooks
└── lib/                   # Utility functions and configurations
```

### Import Organization
1. External libraries (React, Next.js, third-party)
2. UI components (@/components/ui/*)
3. Feature components (@/components/[feature]/*)
4. Shared components (@/components/shared/*)
5. Hooks (@/hooks/*)
6. Utilities (@/lib/*)
7. Relative imports

```typescript
// Example import order
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { useInstallPWA } from '@/hooks/useInstallPWA';
```

### TypeScript Guidelines
- Use strict TypeScript mode (already configured)
- Always define types for props and return values
- Prefer type aliases over interfaces for simple types
- Use interfaces for object shapes that might be extended
- Avoid using `any` type - use `unknown` or proper typing instead

### React Component Patterns
1. Use functional components with TypeScript
2. Add "use client" directive at the top of client components
3. Follow this order:
   - Imports
   - Type definitions
   - Component function
   - Export default

```typescript
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';

type ComponentProps = {
  title: string;
  onClick: () => void;
};

export default function Component({ title, onClick }: ComponentProps) {
  return <Button onClick={onClick}>{title}</Button>;
}
```

### Naming Conventions
- Components: PascalCase (e.g., `UserProfile.tsx`)
- Files: kebab-case for utilities, PascalCase for components
- Variables: camelCase
- Constants: UPPER_SNAKE_CASE
- CSS Classes: Tailwind classes (no custom CSS unless necessary)

### Styling
- Use Tailwind CSS for all styling
- Follow the design system with ShadCN UI components
- Use semantic color tokens (primary, secondary, muted, etc.)
- For animations, use Framer Motion or Tailwind animation classes
- Maintain consistent spacing and sizing (4px base unit)

### Database & Prisma
- Database is PostgreSQL with Prisma ORM
- Always generate Prisma Client after schema changes: `npm run prisma:generate`
- Use type-safe Prisma queries
- Follow the existing naming patterns in schema.prisma
- CUID is preferred for primary keys

### Error Handling
- Use try-catch blocks for async operations
- Display user-friendly error messages (consider Arabic translation)
- Log errors appropriately (console.error for development)
- Handle loading states properly

### Authentication & Authorization
- NextAuth.js is used for authentication
- User roles are: ADMIN, PRIEST, SERVANT, PARENT, CHILD
- Protect routes using middleware or page-level checks
- Check user permissions before showing sensitive data

### Accessibility
- Use semantic HTML elements
- Add proper ARIA labels where needed
- Ensure keyboard navigation works
- Include screen reader text for icons
- Use semantic color contrasts

### Performance Considerations
- Use Next.js Image component for optimized images
- Implement lazy loading for heavy components
- Use React.memo for expensive components
- Optimize re-renders with proper dependencies in useEffect/useMemo

### Internationalization
- UI text is primarily in Arabic (RTL layout)
- Maintain consistency in Arabic terminology
- Use proper HTML dir attribute for RTL support

## Special Notes

- This is a church management application - maintain respectful and professional tone
- All user interfaces should be responsive (mobile-first approach)
- Progressive Web App features are enabled
- The application uses dark mode support with theme toggle
- Database models include user profiles for different roles (priest, servant, parent, child)
- Each user role has a dedicated panel with specific functionality
- Arabic text is used throughout the interface - ensure proper RTL support