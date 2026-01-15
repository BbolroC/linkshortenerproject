---
description: Read this before creating or modifying server actions for data mutations in the project.
---

# Server Actions Instructions

## Core Principles

- **ALL data mutations** must be done via server actions
- Server actions are called from **client components only**
- Server action files **MUST be named `actions.ts`**
- Files must be **collocated** in the same directory as the component that calls them
- **DO NOT throw errors** - return objects with `error` or `success` properties

## File Naming & Location

```
/app/dashboard/
  page.tsx          // Client component
  actions.ts        // Server actions for dashboard
/app/profile/
  page.tsx          // Client component
  actions.ts        // Server actions for profile
```

## Type Safety

- **DO NOT** use the `FormData` TypeScript type
- Define explicit TypeScript interfaces/types for all parameters
- Example:
  ```typescript
  type CreateLinkInput = {
    originalUrl: string;
    shortCode?: string;
    isActive?: boolean;
  };
  
  export async function createLink(input: CreateLinkInput) {
    // ...
  }
  ```

## Validation with Zod

- **ALL data** passed to server actions MUST be validated using Zod
- Define schemas at the top of the actions file
- Use `safeParse()` instead of `parse()` to avoid throwing errors
- Example:
  ```typescript
  import { z } from "zod";
  
  const createLinkSchema = z.object({
    originalUrl: z.string().url(),
    shortCode: z.string().min(3).optional(),
    isActive: z.boolean().optional(),
  });
  
  export async function createLink(input: CreateLinkInput) {
    const result = createLinkSchema.safeParse(input);
    
    if (!result.success) {
      return { error: "Invalid input data" };
    }
    
    const validated = result.data;
    // ...
  }
  ```

## Authentication Check

- **ALWAYS** check for authenticated user first
- Use `auth()` from `@clerk/nextjs/server`
- Return error if no user is authenticated
- Example:
  ```typescript
  import { auth } from "@clerk/nextjs/server";
  
  export async function createLink(input: CreateLinkInput) {
    const { userId } = await auth();
    
    if (!userId) {
      return { error: "Unauthorized" };
    }
    
    // Continue with validated logic
  }
  ```

## Database Operations

- **DO NOT** use Drizzle queries directly in server actions
- Use helper functions from `/data` directory
- Helper functions wrap and encapsulate Drizzle queries
- Example:
  ```typescript
  // ❌ WRONG - Direct Drizzle query
  export async function createLink(input: CreateLinkInput) {
    const [link] = await db.insert(links).values(input).returning();
    return { link };
  }
  
  // ✅ CORRECT - Use helper function
  import { createLinkInDb } from "@/data/links";
  
  export async function createLink(input: CreateLinkInput) {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };
    
    const result = createLinkSchema.safeParse(input);
    if (!result.success) return { error: "Invalid input" };
    
    const link = await createLinkInDb(userId, result.data);
    
    return { success: true, link };
  }
  ```

## Complete Pattern

```typescript
"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { createLinkInDb } from "@/data/links";

// 1. Define input type
type CreateLinkInput = {
  originalUrl: string;
  shortCode?: string;
};

// 2. Define validation schema
const createLinkSchema = z.object({
  originalUrl: z.string().url(),
  shortCode: z.string().min(3).optional(),
});

// 3. Implement server action
export async function createLink(input: CreateLinkInput) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return { error: "Unauthorized" };
    }
    
    // Validate input
    const result = createLinkSchema.safeParse(input);
    if (!result.success) {
      return { error: "Invalid input data" };
    }
    
    // Use helper function for DB operation
    const link = await createLinkInDb(userId, result.data);
    
    return { success: true, link };
  } catch (error) {
    console.error("Error creating link:", error);
    return { error: "Failed to create link" };
  }
}
```

## Error Handling

- **NEVER throw errors** in server actions
- Always return an object with either:
  - `{ error: string }` for failures
  - `{ success: true, ...data }` for successful operations
- Wrap server action logic in try-catch blocks
- Log errors to console for debugging
- Example:
  ```typescript
  export async function deleteLink(linkId: string) {
    try {
      const { userId } = await auth();
      if (!userId) return { error: "Unauthorized" };
      
      await deleteLinkFromDb(userId, linkId);
      
      return { success: true };
    } catch (error) {
      console.error("Error deleting link:", error);
      return { error: "Failed to delete link" };
    }
  }
  ```

## Summary Checklist

- [ ] File named `actions.ts` and collocated with calling component
- [ ] `"use server"` directive at top of file
- [ ] Explicit TypeScript types (no `FormData`)
- [ ] Zod validation with `safeParse()` (not `parse()`)
- [ ] Authentication check using `auth()`
- [ ] Database operations via `/data` helpers only
- [ ] No direct Drizzle queries in server actions
- [ ] Return objects with `error` or `success` properties
- [ ] Never throw errors - use try-catch and return error objects
