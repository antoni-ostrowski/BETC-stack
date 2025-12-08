# CBET React Web Stack (Template)

> I was tired of configuring nice tech stack every time I wanted to start new web app and I tried template generators but they just don't feel right for me. I wanted a simple template thats was personalized for me and exactly to my way of building stuff so i created one.

# Usage

You can wire everything up yourself if you like, but I propose you just clone this repo to have my exact setup.

```bash
git clone https://github.com/antoni-ostrowski/CBET-stack.git
cd CBET-stack

bun install

bun run dev
bunx convex dev
```
> Repo contains all the boilerplate for Better-auth + Convex usage (Github sign in, protected route). Also some basic examples of Effect in convex functions.

# Stack

These technologies create in my opinion the best web stack for complex web apps. Everything is fully typesafe.

- [Convex](https://www.convex.dev/) (The best backend)
- [Better-auth](https://www.better-auth.com/) (The best auth solution)
- [EffectTS](https://effect.website/) (The best way to write backend in TS)
- [Tanstack (Start & Router & Query)](https://tanstack.com/) (The best react framework & react tools)

## Tooling

- Package manager - [Bun](https://bun.com/docs/pm/cli/install)
- Linter - [Oxlint](https://oxc.rs/docs/guide/usage/linter.html)
- Formatter - [Prettier](https://prettier.io/docs/install)
  - Waiting for [Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html)
- Typesafe env vars - [T3 Env](https://env.t3.gg/docs/introduction)

## Styles

- CSS - [Tailwindcss](https://tailwindcss.com/)
- Base components - [Shadcn](https://ui.shadcn.com/)

# Todo

- [ ] Add payments integration (Polar.sh)
- [ ] Migrate from prettier to oxfmt
- [ ] Add Posthog
