# Kairos Studio website

Next.js App Router site for Kairos Studio. The homepage is static, and project pages are generated from the records in `src/data/projects.ts`.

## Run locally

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`. Before deploying, set `NEXT_PUBLIC_SITE_URL` to the site's public origin so project Open Graph image URLs resolve correctly.

## Project structure

```text
src/app/                 Routes, root layout, and global styles
src/components/home/     Homepage sections and their local styles
src/components/projects/ Project page templates and galleries
src/components/site/     Shared navigation, footer, and scrolling
src/components/motion/   Reusable reveal effects
src/components/ui/       Small reusable controls
src/data/                Homepage copy and project records
src/lib/                 Shared runtime utilities and site constants
public/                  Images, fonts, and video referenced by the site
```

To publish another project, add its content and images under `public/projects/<slug>/`, then add a record to `src/data/projects.ts`. The route uses that record for static generation and metadata.

## Checks

```bash
npm run check
npm audit --omit=dev
```

`check` runs ESLint, TypeScript, and a production build. The project uses the installed Next.js guides in `node_modules/next/dist/docs/` for framework conventions.
