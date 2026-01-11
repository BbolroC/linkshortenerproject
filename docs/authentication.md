# Authentication Instructions

## Overview

All authentication in this application is handled exclusively by **Clerk**. No other authentication methods or providers should be implemented.

## Core Authentication Rules

### 1. Clerk is the Only Auth Provider
- **NEVER** implement custom authentication logic
- **NEVER** use alternative auth providers (NextAuth, Auth.js, etc.)
- All auth operations must go through Clerk's SDK

### 2. Protected Routes

#### Dashboard Protection
The `/dashboard` route is protected and requires authentication:

```typescript
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }
  
  // Dashboard content
}
```

#### Homepage Redirect
Authenticated users accessing the homepage (`/`) should be redirected to `/dashboard`:

```typescript
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const { userId } = await auth();
  
  if (userId) {
    redirect("/dashboard");
  }
  
  // Homepage content for unauthenticated users
}
```

### 3. Sign In and Sign Up Modals

**ALWAYS** configure Clerk to use modal-based authentication flows:

- Sign in should launch as a modal overlay
- Sign up should launch as a modal overlay
- Never redirect to separate `/sign-in` or `/sign-up` pages

Configure in the root layout or Clerk provider:

```typescript
<ClerkProvider
  appearance={{
    // Configure modal appearance
  }}
>
  {children}
</ClerkProvider>
```

Trigger modals using Clerk components:

```typescript
import { SignInButton, SignUpButton } from "@clerk/nextjs";

// Sign in modal trigger
<SignInButton mode="modal">
  <Button>Sign In</Button>
</SignInButton>

// Sign up modal trigger
<SignUpButton mode="modal">
  <Button>Sign Up</Button>
</SignUpButton>
```

### 4. API Route Protection

All API routes that require authentication must verify the user:

```typescript
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  
  // Protected API logic
}
```

### 5. User ID Storage

- Store Clerk's `userId` in database for user relations
- Use `userId` from `auth()` for all database queries involving users
- Never store passwords or sensitive auth data

```typescript
import { InferInsertModel } from "drizzle-orm";
import { links } from "@/db/schema";

type NewLink = InferInsertModel<typeof links>;

const newLink: NewLink = {
  userId, // Clerk userId from auth()
  originalUrl,
  shortCode,
};
```

## Clerk Setup Checklist

Before implementing auth features, ensure:

- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set in `.env.local`
- [ ] `CLERK_SECRET_KEY` is set in `.env.local`
- [ ] Root layout wraps app with `<ClerkProvider>`
- [ ] Sign in/sign up buttons use `mode="modal"`
- [ ] Protected routes check `userId` and redirect if null
- [ ] Homepage redirects authenticated users to `/dashboard`

## Common Patterns

### Server Component Auth Check
```typescript
const { userId } = await auth();
if (!userId) redirect("/sign-in");
```

### Client Component Auth Check
```typescript
"use client";
import { useAuth } from "@clerk/nextjs";

export function ClientComponent() {
  const { userId, isLoaded } = useAuth();
  
  if (!isLoaded) return <div>Loading...</div>;
  if (!userId) return <div>Please sign in</div>;
  
  // Component content
}
```

### Getting User Information
```typescript
import { currentUser } from "@clerk/nextjs/server";

const user = await currentUser();
// Access user.emailAddresses, user.firstName, etc.
```

## Security Requirements

1. **Always** verify authentication in protected routes and API endpoints
2. **Never** trust client-side auth state for security decisions
3. **Always** use server-side `auth()` for authorization checks
4. **Never** expose API keys or secrets in client-side code
5. **Always** validate user ownership of resources before allowing modifications

## Summary

- **Provider**: Clerk only
- **Protected Routes**: `/dashboard` (requires auth), `/` (redirects if authenticated)
- **Sign In/Up**: Modal mode only
- **Verification**: Server-side `auth()` in all protected contexts
