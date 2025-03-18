## Context

You are an AI embed in a project that use :

- TypeScript
- Node.js with Next.js
- React
- TailwindCSS and Shadcn UI

## Style and Structure

- Write concise, technical TypeScript code using functional and declarative programming patterns.
- Avoid classes; prefer iteration and modularization over code duplication.
- Use descriptive variable names with auxiliary verbs (e.g., `isLoading`, `hasError`).
- Structure files into: exported component, subcomponents, helpers, static content, and types.

## Naming Conventions

- Use lowercase with dashes for directories (e.g., `components/auth-wizard`).
- Favor named exports for components.

## TypeScript Usage

- Use TypeScript for all code; prefer types over interfaces.
- Avoid enums; use maps instead.
- Use functional components with TypeScript types.

## Synthax and Formatting

- Avoid unnecessary curly braces in conditionals; use concise syntax for simple statements.
- Write declarative JSX.

## UI and Styling

- Use Shadcn UI, Radix, and Tailwind for components and styling.
- Implement responsive design with Tailwind CSS using a mobile-first approach.
- UI components should be reusable and composable.
- UI components should be responsive and accessible.
- Ensure accessibility with ARIA roles and semantics.

## Performance Optimization

- Minimize `use client`, `useEffect`, and `setState`; favor React Server Components (RSC).
- Wrap client components in `Suspense` with fallback.
- Use dynamic loading for non-critical components.
- Optimize images: use WebP format, include size data, and implement lazy loading.

## Database Querying and Data Model Creation

- Use Prisma SDK to query the database.
- For data models, read the `.prisma` files.

## Key Conventions

- Use 'nuqs' for URL search parameter state management.
- Optimize Web Vitals (LCP, CLS, FID).
- Limit 'use client': Favor server components and Next.js SSR for data fetching or state management.
- Use 'use client' only for Web API access in small components.

## PostgreSql

- Use valid PostgresQL syntax with guillemet for table and column names.

## Next 15 and React 19

- Utilize React 19 with Server Components. Implement Prisma queries and backend logic inside `page` or `layout` files like this:

```tsx
// Use "async" for server components
export default async function Page() {
  // Use "await" for async operations
  const result = await prisma.user.findMany();
  return (
    <div>
      {result.map((user) => (
        <p>{user.name}</p>
      ))}
    </div>
  );
}
```

- Avoid using React hooks within server components.

## Creating a Component

- You always use `export function` without "default" or named export.
- You always use an object "props" as the first argument of your component, and add type directly in the object.

Example :

```tsx
export function MyComponent(props: { prop1: string; prop2: number }) {
  return <div>{props.prop1}</div>;
}
```

## Toast Example

If you need to use "toast", use the following example :

```ts
import { toast } from "sonner";

toast.success("Success message");

toast.error("Error message");
```

## Form Example

If you need to create form, you need to follow the following example :

```tsx
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useZodForm,
} from "@/components/ui/form";
import { z } from "zod";

const Schema = z.object({
  name: z.string(),
});

export const Form = () => {
  const form = useZodForm({
    schema: Schema,
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof Schema>) => {
    console.log(data);
  };

  return (
    <Form form={form} onSubmit={async (data) => onSubmit(data)}>
       <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </Form>
  );
};
```

## Server Action Usage

Server Action is a way to execute server-side code like to mutate database etc... but without API endpoint. It's a React abstraction to handle the server-code.

To create and use server-action, you muse follow the following process.

1. Create a server action files

We use `server-action-name.action.ts` converntion to easily reconize server-action.

```ts
// All server action must start with "use server" to inform NextJS that this method must be executed on the server
"use server";

// orgAction is a utility from the library "next-safe-action" that handle middleware to verify the permission of the user.
// use `authAction` for not-org-related actions.
import { orgAction } from "@/lib/actions/safe-actions";

export const demoAction = orgAction
  // We can limit the action to a specific role
  .metadata({
    roles: ["OWNER", "ADMIN"],
  })
  // The schema is used to validate the input of the action
  .schema(DatabaseFormSchema)
  .action(async ({ parsedInput: input, ctx }) => {
    // we can do async code here
    const database = await prisma.database.create({
      data: {
        name: input.name,
        schema: input.schema,
        organizationId: ctx.org.id,
      },
    });

    return database;
  });
```

2. Use the server action in a client component

In any client component we can use Server Action like the following example :

```tsx
import { demoAction } from "./server-action-name.action";
import { useMutation } from "@tanstack/react-query";
import { resolveActionResult } from "@/lib/actions/actions-utils";

export const Form = () => {
  // ...

  const mutation = useMutation({
    mutationFn: async (data: FormData) =>
      resolveActionResult(demoAction(data)),
    onError: (error) => toast.error(error.message),
    onSuccess: (result) => {
      toast.success("Demo Action executed!");
    },
  });
```

## Safe Route

You need to use next-zod-route to create a safe route.

```ts
// app/api/org/[orgId]/route.ts
import { prisma } from "@/lib/prisma";
import { orgRoute } from "@/lib/safe-route";
import { z } from "zod";

export const POST = orgRoute
  // Path params = /orgs/:orgId
  .params(
    z.object({
      orgId: z.string(),
    }),
  )
  // Body params = { name: "John" }
  .body(z.object({ name: z.string() }))
  // Query params = ?a=1&b=2
  .query(z.object({ query: z.string() }))
  .handler(async (req, { params, body, query, context }) => {
    // Safe check orgId
    const orgId = params.orgId;
    await prisma.organization.update({
      where: {
        id: params.orgId,
      },
      data: {
        name: body.name,
      },
    });
  });
```

<!-- - Always create org related routes insides `/api/org/[orgId]/*` -->
<!-- - Always use `orgRoute` to create safe routes inside `/api/org/[orgId]/*` -->
<!-- - In general, you can use `authRoute` to create safe routes that is NOT related to orgs. -->

## Auth

To get the current user, you must use `auth` function.

```ts
import { authClient } from "@/lib/auth-client";

export function User(){

    const {
        data: session,
        isPending, //loading state
        error, //error object
        refetch //refetch the session
    } = authClient.useSession()

    return (
        //...
    )
}
```

<!-- ## Org

- You muse always use organisation for ressources. Everything must be linked to an organisation, not a user.

- To get an organisation, you can use `getCurrentOrgCache` or `getRequiredCurrentOrgCache` function.

```ts
import { getCurrentOrgCache } from "@/lib/react/cache";

const org = await getCurrentOrgCache();
``` -->

## Professional Commit Message Prompt

### Instructions

Use the following structure to write clear and professional commit messages that accurately describe the changes made in each commit.

#### Structure

1. **Header**: A concise summary of the changes (max 50 characters).
2. **Body** (optional): Detailed explanation of the changes, including the reason for the change and any relevant context. Use bullet points or paragraphs as needed.
3. **Footer** (optional): Include any references to issues, pull requests, or other relevant information.

#### Example

```
feat: Add user authentication

- Implemented login and registration functionality
- Added password encryption using bcrypt
- Updated database schema to include user table

Closes #123
```

#### Guidelines

- Use the imperative mood in the header (e.g., "Add" instead of "Added").
- Limit the header to 50 characters.
- Keep the body at 72 characters per line.
- Explain the "why" and "what" in the body, not the "how".
- Reference issues or pull requests in the footer when applicable.

### Template

```
<type>: <subject>

<body>

<footer>
```

#### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semi-colons, etc)
- `refactor`: Code refactoring (no functional changes)
- `test`: Adding or updating tests
- `chore`: Maintenance tasks (updating dependencies, etc)

#### Subject

A brief description of the changes.

#### Body

- Detailed explanation of what changes were made and why.
- Use bullet points for multiple changes.
- Include any relevant context or background information.

#### Footer

- Reference any related issues or pull requests (e.g., "Closes #123").
