# BETC React Web Stack (Template)

> I was tired of configuring nice tech stack every time I wanted to start new web app and I tried template generators but they just don't feel right for me. I wanted a simple template thats was personalized for me and exactly to my way of building stuff so i created one.

# Getting Started

You can wire everything up yourself if you like, but I propose you just clone this repo to have my exact setup.

```bash
git clone https://github.com/antoni-ostrowski/BETC-stack.git
cd BETC-stack

bun install

bun run dev
bunx convex dev
```
> to make auth work, you need to generate better-auth secret and generate schema ([docs](https://convex-better-auth.netlify.app/framework-guides/react#set-environment-variables))

# Stack

These technologies create in my opinion the best web stack for complex web apps. Everything is fully typesafe.

- [Tanstack (Start & Router & Query)](https://tanstack.com/) (The best react framework & react tools)
- [Convex](https://www.convex.dev/) (The best backend)
- [Better-auth](https://www.better-auth.com/) (The best auth solution)
- [EffectTS](https://effect.website/) (The best way to write backend in TS)

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
  - Current signed in user globally accessible in router context
- Simple repository pattern implemented with EffectTS for data access layer (abstracted away from convex functions) with todo example
- Full Tanstack query + Convex integration setup (you can use tanstack query with convex functions)
- Typesafe enviroment variables with [T3 Env](https://env.t3.gg/docs/introduction) validated with Effect Schema
- Lots of my most used helpers utils (e.g tryCatch wrapper)
- Light/dark mode setup
- Generic components like FullScreenLoading and FullScreenError (which i use all the time)
- Prettier setup with plugins for organizing tailwind classess and imports
  

# Todo

- [ ] Add payments integration (Polar.sh)
- [ ] Migrate from prettier to oxfmt
- [ ] Add Posthog


### Media 
> Its really minimalistic, just a handy starter point


<img src="https://github.com/user-attachments/assets/b6e00cbc-a500-4284-a0ef-4a3c94c2b306" width="60%" height="60%" />


<img src="https://github.com/user-attachments/assets/1d42bafe-57cc-4b96-a312-46a1c93fca96" width="60%" height="60%" />

<img src="https://github.com/user-attachments/assets/503e93ed-d02d-4921-a2f5-5c1bd965f034" width="60%" height="60%" />
