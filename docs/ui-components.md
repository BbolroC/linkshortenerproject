# UI Components - shadcn/ui

## Core Principle

**ALL UI elements in this application MUST use shadcn/ui components. DO NOT create custom UI components from scratch.**

## Component Usage Rules

### 1. Always Use shadcn/ui Components

When implementing any UI element, use the existing shadcn/ui component library:

```typescript
// ✅ Correct - Using shadcn/ui Button
import { Button } from "@/components/ui/button";

<Button variant="default">Click me</Button>

// ❌ Wrong - Creating custom button
<button className="px-4 py-2 bg-blue-500">Click me</button>
```

### 2. Available Component Categories

shadcn/ui provides components for:
- **Buttons**: Button
- **Forms**: Input, Textarea, Select, Checkbox, Radio, Switch, Label
- **Layout**: Card, Separator, Tabs, Dialog, Sheet
- **Feedback**: Alert, Toast, Progress, Skeleton
- **Navigation**: NavigationMenu, Dropdown, Menubar
- **Data Display**: Table, Badge, Avatar, Tooltip
- **Overlays**: Dialog, Popover, HoverCard, Sheet

### 3. Adding New Components

If you need a component not yet installed:

```bash
npx shadcn@latest add [component-name]
```

This ensures consistency with the existing design system.

### 4. Styling Components

Use the `className` prop to customize shadcn/ui components with Tailwind:

```typescript
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

<Card className={cn(
  "hover:shadow-lg transition-shadow",
  isActive && "border-primary"
)}>
  {/* Content */}
</Card>
```

### 5. Component Variants

Leverage built-in variants instead of custom styling:

```typescript
// ✅ Use variants
<Button variant="destructive" size="lg">Delete</Button>
<Alert variant="warning">Warning message</Alert>

// ❌ Don't recreate variants
<button className="bg-red-500 text-white px-8 py-4">Delete</button>
```

### 6. Form Components Pattern

Always use shadcn/ui form components with proper labels:

```typescript
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

<div className="space-y-2">
  <Label htmlFor="url">URL</Label>
  <Input 
    id="url" 
    type="url" 
    placeholder="https://example.com"
  />
</div>
```

### 7. Component Composition

Compose shadcn/ui components together for complex UI:

```typescript
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

<Card>
  <CardHeader>
    <CardTitle>Link Statistics</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Content here</p>
    <Button className="mt-4">View Details</Button>
  </CardContent>
</Card>
```

## Common Components Reference

### Button
```typescript
<Button variant="default | destructive | outline | secondary | ghost | link">
  Click me
</Button>
```

### Input
```typescript
<Input type="text | email | password | url" placeholder="..." />
```

### Card
```typescript
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer actions</CardFooter>
</Card>
```

### Dialog
```typescript
<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    {/* Content */}
  </DialogContent>
</Dialog>
```

## Forbidden Practices

❌ **Never** create custom components that replicate shadcn/ui functionality  
❌ **Never** use raw HTML elements when a shadcn/ui component exists  
❌ **Never** build custom dialogs, modals, or overlays from scratch  
❌ **Never** create custom form controls without using shadcn/ui base components

## Benefits

- **Consistency**: All UI follows the same design system (New York style)
- **Accessibility**: shadcn/ui components include proper ARIA attributes
- **Dark Mode**: Built-in dark mode support
- **Type Safety**: Full TypeScript support
- **Maintainability**: Centralized component updates

## Summary

When implementing any UI feature:
1. Check if a shadcn/ui component exists for that purpose
2. Use that component with variants and className for customization
3. Only if absolutely no suitable component exists, install it via shadcn CLI
4. Never build custom UI components from scratch
