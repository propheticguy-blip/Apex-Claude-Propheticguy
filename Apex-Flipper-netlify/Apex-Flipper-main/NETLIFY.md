# Deploying ApexFlipper on Netlify

Everything is already configured (`netlify.toml`, `netlify/functions/api.ts`).

## Easiest: Git
1. Put this folder in a GitHub repo (no `node_modules`/`dist`).
2. Netlify → Add new site → Import from Git → pick the repo. Settings are read from `netlify.toml`
   (build: `npm run build`, publish: `dist`, Node 22).
3. Site configuration → Environment variables → add `GEMINI_API_KEY` (optional; powers AI news + neural voice).
4. Deploy.

## Or CLI
    npm install
    npx netlify-cli deploy --build --prod

## How it works
- The React app builds to `dist/` as static files.
- `/api/*` is redirected to one Netlify Function that runs the same Express routes as `server.ts` (`api-app.ts`).
- `npm run dev` still runs the original local server unchanged.

## Notes
- Free-tier functions time out at ~10s; slow Gemini calls (news/voice) may fall back or fail.
- The in-memory cache resets when a function goes cold; that only affects speed.
