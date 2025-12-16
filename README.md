# My React web stack (BETC Stack Template)

> I was tired of configuring tech stack every time I wanted to start new web app so i created this repo. This is exactly how I would start new web app today.

_**This repo is meant to be cloned and used as a starting point for a your web app.**_

# Getting Started

You can wire everything up yourself if you like, but I propose you just clone this repo to have my exact setup.

> Remember to delete the .git folder, and init a new repo after cloning :)

```bash
git clone https://github.com/antoni-ostrowski/BETC-stack.git
cd BETC-stack
bun install
bun run dev
bunx convex dev
```


> To make auth work, you need to have convex project, generate better-auth secret and generate schema ([docs](https://convex-better-auth.netlify.app/framework-guides/react#set-environment-variables))

# Technologies

These technologies create in my opinion the best web stack for complex web apps. Everything is fully typesafe and DX is next level.

- [Tanstack (Start & Router & Query)](https://tanstack.com/) (React framework & tools)
- [Convex](https://www.convex.dev/) (Backend)
- [Better-auth](https://www.better-auth.com/) (Auth) 
- [EffectTS](https://effect.website/) (Production-grade TypeScript)

## Tooling

- Package manager - [Bun](https://bun.com/docs/pm/cli/install)
- Linter - [Oxlint](https://oxc.rs/docs/guide/usage/linter.html)
- Formatter - [Prettier](https://prettier.io/docs/install)
  - Waits to be replaced by [Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html)
- Bundler - [Vite](https://vite.dev/) (Tanstack Start foundation)

## Styles

- CSS - [Tailwindcss](https://tailwindcss.com/)
- Base components - [Shadcn](https://ui.shadcn.com/)

# Some of the features in this template

- Full authentication setup with Better-Auth + Convex adapter (Its a more flexible, "local install" version, which should enable better plugin support [docs](https://convex-better-auth.netlify.app/features/local-install))
  - Example of protected route
- Simple repository pattern implemented with EffectTS for data access layer (abstracted away from convex functions) with todo example
- Full Tanstack query + Convex integration setup (you can use tanstack query with convex functions)
- Typesafe enviroment variables with [T3 Env](https://env.t3.gg/docs/introduction) validated with Effect Schema
- Basic utils (e.g tryCatch wrapper)
- Light/dark mode setup
- Generic components like FullScreenLoading and FullScreenError (which i use all the time)
- Prettier setup with plugins for organizing tailwind classess and imports

### Media

> Its really minimalistic, just a handy starter point

<img src="https://github.com/user-attachments/assets/b6e00cbc-a500-4284-a0ef-4a3c94c2b306" width="60%" height="60%" />

<img src="https://github.com/user-attachments/assets/1d42bafe-57cc-4b96-a312-46a1c93fca96" width="60%" height="60%" />

<img src="https://github.com/user-attachments/assets/503e93ed-d02d-4921-a2f5-5c1bd965f034" width="60%" height="60%" />


# Todo

- [ ] Add payments integration (Polar.sh)
- [ ] Migrate from prettier to oxfmt
- [ ] Add Posthog
