# My FullStack Template (monorepo)

_**This repo is meant to be cloned and used as a starting point for a your next project.**_

# Getting Started

> Remember to delete the .git folder, and init a new repo after cloning :)

```bash
git clone https://github.com/antoni-ostrowski/BETC-stack.git
cd BETC-stack
bun install
bun dev:web
bun dev:convex
```

# Technologies

- [Tanstack (Start & Router & Query & ...)](https://tanstack.com/) (React framework & tools)
- [Convex](https://www.convex.dev/) (Backend)
- [Better-auth](https://www.better-auth.com/) (Auth, with [better-convex](https://www.better-convex.com/))
- [Effect v4](https://effect.website/) (best way to write TypeScript)

## Tooling

- Package manager & runtime & monorepo - [Bun](https://bun.com/docs/pm/cli/install)
- Toolchain - [Vite+](https://viteplus.dev/guide/)

## Styles

- CSS - [Tailwindcss](https://tailwindcss.com/)
- Base components - [Shadcn](https://ui.shadcn.com/)

> I'm still experimenting with the best way to make the effect code interact correctly with convex functions. For now, I created a utility to run an effect and wrap any failures in ConvexError and throw it. Then client can use parseConvexError util to read exact error message. This approach preserves the nature of js exceptions and doesn't break convex assumptions. This is how that looks like. Im using [fluent convex](https://github.com/mikecann/fluent-convex) - simple lib that enables TRPC style procedures and middlewares.

```typescript
export const list = authedQuery
  .handler(async (ctx) => {
    const program = Effect.gen(function* () {
      return yield* effectifyPromise(() => ctx.db.query("todos").collect())
    })

    return runEffOrThrow(appRuntime, program)
  })
  .public()
```
