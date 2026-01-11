# Agent Instructions for Link Shortener Project

## Purpose

This document provides comprehensive coding standards and guidelines for AI agents (LLMs) working on this Link Shortener project. All code generated must adhere to these standards to ensure consistency, quality, and maintainability.

## ⚠️ CRITICAL: Read Documentation First

**BEFORE generating ANY code, you MUST read the relevant documentation files in the `/docs` directory:**

- **Authentication & Authorization**: Read [docs/authentication.md](docs/authentication.md) for Clerk integration patterns, protected routes, modal-based sign in/sign up, and security requirements
- **UI Components**: Read [docs/ui-components.md](docs/ui-components.md) for shadcn/ui component usage standards and requirements - ALL UI elements must use shadcn/ui components

**This is NOT optional. Failure to consult these files will result in code that does not meet project requirements.**

## Core Principles

### 1. Type Safety First
- **Always** use explicit TypeScript types
- **Never** use `any` - use `unknown` if type is uncertain
- Leverage Drizzle ORM's type inference for database models
- Use strict mode TypeScript settings

### 2. Server-First Architecture
- Default to Server Components (Next.js App Router)
- Only use `"use client"` when necessary (interactivity, hooks, browser APIs)
- Fetch data directly in Server Components
- Keep client-side JavaScript minimal

### 3. Database Best Practices
- Use Drizzle ORM for all database operations
- Always use `.returning()` after INSERT/UPDATE operations
- Leverage type inference with `InferSelectModel` and `InferInsertModel`
- Handle errors explicitly with try/catch blocks

### 4. Authentication Pattern
- Always verify authentication in protected routes and API endpoints
- Use `auth()` from `@clerk/nextjs/server` in Server Components and API routes
- Store Clerk user IDs in database for user relations
- Never assume a user is authenticated without checking

### 5. Styling Consistency
- Use Tailwind CSS utility classes exclusively
- Utilize the `cn()` utility from `@/lib/utils` for conditional classes
- Support dark mode with `dark:` variants
- Follow shadcn/ui New York style patterns

### 6. Code Quality
- Write clean, readable code with proper error handling
- Use early returns to reduce nesting
- Prefer async/await over promises
- Follow ESLint rules and fix warnings
- Include meaningful comments for complex logic only

## Critical Requirements

### Import Aliases
Always use configured path aliases:
```typescript
import { Button } from "@/components/ui/button";  // ✅
import { cn } from "@/lib/utils";                 // ✅
import { db } from "@/db";                        // ✅

import { Button } from "../components/ui/button"; // ❌
```

### File Structure
```
/app              # Next.js App Router pages
  /api            # API routes (route.ts files)
  layout.tsx      # Root layout with ClerkProvider
  page.tsx        # Page components
/components
  /ui             # shadcn/ui components
/db
  schema.ts       # Drizzle schema definitions
  index.ts        # Database connection
/lib
  utils.ts        # Utility functions (includes cn())
/docs             # Agent instruction files (this folder)
```

### Environment Variables
Required variables (must be set in `.env.local`):
- `DATABASE_URL` - Neon PostgreSQL connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk publishable key
- `CLERK_SECRET_KEY` - Clerk secret key

### Technology Stack
- **Next.js 16.1.1** with App Router
- **TypeScript 5.x** in strict mode
- **React 19.2.3**
- **Tailwind CSS v4** with shadcn/ui (New York style)
- **Drizzle ORM** with Neon Database (PostgreSQL)
- **Clerk** for authentication
- **Lucide React** for icons

## Common Patterns

### Protected Page Pattern
```typescript
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { links } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function ProtectedPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }
  
  const userLinks = await db.query.links.findMany({
    where: eq(links.userId, userId),
  });
  
  return <div>{/* Render content */}</div>;
}
```

### API Route Pattern
```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { links } from "@/db/schema";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await request.json();
    
    const [link] = await db
      .insert(links)
      .values({ userId, ...body })
      .returning();
    
    return NextResponse.json({ link }, { status: 201 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### Component with Styling Pattern
```typescript
import { cn } from "@/lib/utils";

type CardProps = {
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
};

export function Card({ title, description, className, children }: CardProps) {
  return (
    <div className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}>
      <div className="p-6">
        <h3 className="text-2xl font-semibold">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        {children}
      </div>
    </div>
  );
}
```

### Database Query Pattern
```typescript
import { db } from "@/db";
import { links } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";

// Find with conditions
const activeLinks = await db.query.links.findMany({
  where: and(
    eq(links.userId, userId),
    eq(links.isActive, true)
  ),
  orderBy: [desc(links.createdAt)],
});

// Create with returning
const [newLink] = await db
  .insert(links)
  .values({
    userId,
    originalUrl: url,
    shortCode: generateCode(),
  })
  .returning();

// Update with returning
const [updatedLink] = await db
  .update(links)
  .set({ 
    clicks: links.clicks + 1,
    updatedAt: new Date(),
  })
  .where(eq(links.id, id))
  .returning();
```

## Error Prevention Checklist

Before generating code, verify:

- [ ] **READ relevant /docs files first** (authentication.md, ui-components.md, etc.)
- [ ] Using TypeScript with explicit types
- [ ] Server Components by default (no `"use client"` unless needed)
- [ ] Authentication checked for protected routes/APIs
- [ ] Path aliases used (`@/components`, `@/lib`, etc.)
- [ ] Tailwind classes used for styling
- [ ] `cn()` utility used for conditional classes
- [ ] Database queries use Drizzle ORM
- [ ] `.returning()` used after INSERT/UPDATE
- [ ] Error handling with try/catch
- [ ] Import organization follows convention
- [ ] Dark mode variants included (`dark:`)
- [ ] Responsive design with Tailwind breakpoints
- [ ] No hardcoded environment variables
- [ ] ESLint rules followed

## Documentation Files - Required Reading

**⚠️ MANDATORY: You MUST read the relevant documentation files BEFORE writing any code.**

The `/docs` directory contains detailed specifications that override any assumptions:

- **[docs/authentication.md](docs/authentication.md)** - Clerk integration patterns, protected routes, modal-based sign in/sign up, security requirements. READ THIS before implementing ANY authentication-related code.
- **[docs/ui-components.md](docs/ui-components.md)** - shadcn/ui component usage standards and requirements. READ THIS before creating ANY UI components or pages.

**Do NOT skip this step. Do NOT assume you know the requirements. ALWAYS read the relevant documentation file first.**

## Summary

This Link Shortener project prioritizes:
1. **Type safety** - Strict TypeScript throughout
2. **Performance** - Server-first with minimal client JS
3. **Security** - Authentication on all protected resources
4. **Consistency** - Standardized patterns and conventions
5. **Maintainability** - Clean code with proper error handling

Follow these guidelines to ensure all generated code integrates seamlessly with the existing codebase.
