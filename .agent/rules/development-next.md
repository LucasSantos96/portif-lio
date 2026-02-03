---
trigger: always_on
---

# Antigravity Development Rule

## Stack & Architecture
- Next.js 14+ with App Router
- TypeScript strict mode
- React Server Components (RSC) by default
- Client Components only when necessary (`'use client'`)
- Tailwind CSS for styling
- Zod for validation
- React Hook Form for forms

## Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Route groups
│   ├── (dashboard)/
│   ├── api/               # API routes
│   └── layout.tsx
├── components/
│   ├── ui/                # Shadcn/ui components
│   ├── forms/             # Form components
│   ├── layouts/           # Layout components
│   └── features/          # Feature-specific components
├── lib/
│   ├── actions/           # Server actions
│   ├── api/               # API clients
│   ├── hooks/             # Custom hooks
│   ├── utils/             # Utility functions
│   └── validations/       # Zod schemas
├── types/                 # TypeScript types
└── config/                # Configuration files
```

## Naming Conventions

### Files
- Components: `PascalCase.tsx` (UserProfile.tsx)
- Utilities: `camelCase.ts` (formatDate.ts)
- Hooks: `use*.ts` (useAuth.ts)
- Actions: `*.actions.ts` (user.actions.ts)
- Types: `*.types.ts` (user.types.ts)
- Constants: `UPPER_SNAKE_CASE.ts` (API_ENDPOINTS.ts)

### Components
```typescript
// ✅ Good
export function UserProfileCard({ userId }: UserProfileCardProps) {}

// ❌ Bad
export default function userProfile() {}
```

## Component Patterns

### Server Components (Default)
```typescript
// app/users/[id]/page.tsx
import { getUserById } from '@/lib/api/users';

interface PageProps {
  params: { id: string };
}

export default async function UserPage({ params }: PageProps) {
  const user = await getUserById(params.id);
  
  return <UserProfile user={user} />;
}
```

### Client Components
```typescript
// components/forms/UserForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSchema } from '@/lib/validations/user';

export function UserForm() {
  const form = useForm({
    resolver: zodResolver(userSchema),
  });
  
  // Component logic
}
```

### Composition Pattern
```typescript
// ✅ Good - Composable
export function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg border">{children}</div>;
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="p-6">{children}</div>;
}

// Usage
<Card>
  <CardHeader>
    <h2>Title</h2>
  </CardHeader>
</Card>
```

## Server Actions
```typescript
// lib/actions/user.actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { userSchema } from '@/lib/validations/user';

export async function createUser(data: z.infer<typeof userSchema>) {
  try {
    const validated = userSchema.parse(data);
    
    // Database operation
    const user = await db.user.create({ data: validated });
    
    revalidatePath('/users');
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: 'Failed to create user' };
  }
}
```

## Data Fetching

### Server-side
```typescript
// lib/api/users.ts
import { cache } from 'react';

export const getUserById = cache(async (id: string) => {
  const response = await fetch(`/api/users/${id}`, {
    next: { revalidate: 3600 }, // ISR
  });
  
  if (!response.ok) throw new Error('Failed to fetch user');
  return response.json();
});
```

### Client-side (when needed)
```typescript
// lib/hooks/useUsers.ts
import useSWR from 'swr';

export function useUsers() {
  const { data, error, isLoading } = useSWR('/api/users', fetcher);
  
  return {
    users: data,
    isLoading,
    isError: error,
  };
}
```

## Type Safety
```typescript
// types/user.types.ts
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export type UserCreateInput = Omit<User, 'id' | 'createdAt'>;
export type UserUpdateInput = Partial<UserCreateInput>;
```

## Validation with Zod
```typescript
// lib/validations/user.ts
import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  age: z.number().int().positive().optional(),
});

export type UserFormData = z.infer<typeof userSchema>;
```

## Styling Guidelines

### Tailwind Best Practices
```typescript
// ✅ Good - Use cn() utility for conditional classes
import { cn } from '@/lib/utils';

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded-md font-medium transition-colors',
        variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',
        variant === 'secondary' && 'bg-gray-200 text-gray-900 hover:bg-gray-300',
        className
      )}
      {...props}
    />
  );
}
```

### Component Variants (CVA)
```typescript
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);
```

## Error Handling

### Error Boundaries
```typescript
// components/ErrorBoundary.tsx
'use client';

import { useEffect } from 'react';

export function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

## Performance Optimization

### Dynamic Imports
```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});
```

### Image Optimization
```typescript
import Image from 'next/image';

<Image
  src="/avatar.jpg"
  alt="User avatar"
  width={200}
  height={200}
  priority // For LCP images
  placeholder="blur"
/>
```

## Testing Patterns
```typescript
// __tests__/UserProfile.test.tsx
import { render, screen } from '@testing-library/react';
import { UserProfile } from '@/components/UserProfile';

describe('UserProfile', () => {
  it('renders user information', () => {
    const user = { id: '1', name: 'John Doe', email: 'john@example.com' };
    render(<UserProfile user={user} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

## Code Quality Rules

1. **Single Responsibility**: Each component/function does one thing
2. **DRY**: Extract repeated logic into hooks/utilities
3. **Immutability**: Never mutate state directly
4. **Type Everything**: No `any` types allowed
5. **Early Returns**: Reduce nesting with guard clauses
6. **Semantic Naming**: Names should describe purpose
7. **Small Functions**: Max 50 lines per function
8. **Props Destructuring**: Always destructure props
9. **Avoid Magic Numbers**: Use named constants
10. **Comment Why, Not What**: Code should be self-documenting

## Git Commit Convention
```
feat: add user authentication
fix: resolve navigation bug on mobile
refactor: simplify user profile component
perf: optimize image loading
docs: update API documentation
test: add unit tests for UserForm
chore: update dependencies
```

## Environment Variables
```typescript
// config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXT_PUBLIC_API_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'production', 'test']),
});

export const env = envSchema.parse(process.env);
```

## Code Review Checklist

- [ ] TypeScript strict mode passing
- [ ] No console.logs in production code
- [ ] Proper error handling
- [ ] Accessibility attributes (aria-labels, roles)
- [ ] Responsive design tested
- [ ] Loading states implemented
- [ ] Proper Server/Client component usage
- [ ] Validation schemas for forms
- [ ] Meaningful variable names
- [ ] Component extracted if >100 lines

---

**Remember**: Prefer composition over inheritance, Server Components over Client Components, and progressive enhancement over JavaScript-heavy solutions.
