# My React web stack (BETC Stack Template)

_**This repo is meant to be cloned and used as a starting point for a your next web app.**_

# Getting Started

You can wire everything up yourself if you like, but I propose you just clone this repo to have my exact setup.

> Remember to delete the .git folder, and init a new repo after cloning :)
> Main branch contains new approach with better-convex, but theres also branch with simpler setup (which has some perf implications thats why i moved to better-convex)

```bash
git clone https://github.com/antoni-ostrowski/BETC-stack.git
cd BETC-stack
rm -rf .git
bun install
bun dev
bun backend
bun backend:env-sync
```

# Technologies

These technologies create in my opinion the best web stack for complex web apps. Everything is fully typesafe and DX is next level.

- [Tanstack (Start & Router & Query & ...)](https://tanstack.com/) (React framework & tools)
- [Convex](https://www.convex.dev/) (Backend)
- [Better-auth](https://www.better-auth.com/) (Auth)
- [EffectTS](https://effect.website/) (Production-grade TypeScript)
- [Better Convex](https://www.better-convex.com/) (convex "framework")

## Tooling

- Package manager & runtime - [Bun](https://bun.com/docs/pm/cli/install)
- Linter - [Oxlint](https://oxc.rs/docs/guide/usage/linter.html)
- Formatter - [Prettier](https://prettier.io/docs/install)

> this is how i handle effect in convex functions (with few wrappers)
```typescript
export const list = authQuery
  .output(z.array(todoZod))
  .query(async ({ ctx }) => {
    const program = Effect.gen(function* () {
      // special convex service wrapper, that gives access
      // to convex ctx, executes promise and fails with DatabaseError,
      // can take custom err message
      const example1 = yield* ctx.effQuery(
        async (c) => c.table("todo").docs(),
        "custom err message"
      )
      // wrap default error to specific one
      const example2 = yield* ctx
        .effQuery(async (c) => c.table("todo").docs())
        .pipe(
          Effect.mapError(
            (dbError) =>
              new ServerError({ message: "another custom err message" })
          )
        )
      // general purpose promise wrapper, works with any promise,
      // allows to associate specific error to that promise
      const example3 = yield* effectifyPromise(
        () => ctx.table("todo").docs(),
        ({ cause, message }) => new DatabaseError({ cause, message }),
        "custom err message"
      )
      return example1
    })
    // exec program, throw crpc error if program fails
    return await execEff(ctx, appRuntime, program)
  })
// similar with mutatations
export const create = authMutation
  .input(z.object({ text: z.string() }))
  .mutation(async ({ ctx, input: { text } }) => {
    const program = ctx.effMutate(async (c) =>
      c.table("todo").insert({ text, completed: false, userId: ctx.user.id })
    )
    return await execEff(ctx, appRuntime, program)
  })
// or full repo pattern (little clunky)
export const toggle = mutation({
  args: { id: v.id("todos") },
  handler: async ({ db }, { id }) => {
    const program = Effect.gen(function* () {
      const todoApi = yield* TodoApi
      const todo = yield* todoApi.getTodo({ db, todoId: id })
      yield* todoApi.toggleTodo({ db, todo })
    }).pipe(Effect.tapError((err) => Effect.logError(err)))

    return await runEffOrThrow(appRuntime, program)
  }
})

```

# Media

> Its really minimalistic, just a handy starter point

<img width="1804" height="929" alt="image" src="https://github.com/user-attachments/assets/c256eac7-37b0-4310-8393-07c9026338ac" />
<img width="1215" height="638" alt="image" src="https://github.com/user-attachments/assets/ff20038a-fcb0-4d8f-91fe-26a90f762837" />
<img width="1391" height="675" alt="image" src="https://github.com/user-attachments/assets/d340ad33-80f5-419e-914c-085350ff9b79" />


