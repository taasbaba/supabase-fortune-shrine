# Fortune Shrine Demo — Supabase × React × Edge Functions
**Live Demo:** [supabase-fortune-shrine.vercel.app](https://supabase-fortune-shrine.vercel.app)

This is a technical demo of a real-time fortune draw app inspired by Japanese omikuji shrines.  
Designed as a showcase of full-stack skills with Supabase, Edge Functions, TypeScript, and modern frontend.

The project handles each step with async-safe logic, edge-case fallback, and clear separation between backend routing, session validation, and UI flow control.

---

## Why This Demo Matters

Many frontend demos only look good on the surface. This project focuses on:

- **One-click fortune draw with state-controlled frontend mask and timeout protection**
- **Supabase Edge Function with secure user parsing from Bearer token (not client-trusted params)**
- **Public/private chat-style message panel based on login state, using efficient polling**
- **Weather API proxying with OpenWeatherMap, including full CORS preflight handling**
- **Icons are served locally from /public/, ensuring full offline support, consistent styling, and zero reliance on third-party CDNs.**

If you're hiring someone who understands system integrity, real-time feedback, and user session protection — this demo reflects that mindset.

---

## Tech Highlights

### Backend

- **Supabase Edge Function**  
  - Single endpoint, multi-action routing via `?action=xxx`
  - Handles CORS preflight (`OPTIONS`) with full headers
  - Authenticated user parsing via `Authorization: Bearer` token (no spoofable email param)
  - Fortune result saved with user ID/email, fallback to guest if unauthenticated
  - Weighted draw logic for fairness

- **Supabase Database**
  - `draw_history` table with full timestamped records
  - `fortune_templates` table to control weight and content dynamically
  - Auth integrated with row-level security protection (if extended)

### Frontend (React)

- **Bubble message panel**  
  - Auto-polls every 10 seconds (basic strategy), shows public draw results
  - If user is logged in, filters only their own draw history
  - Optimized to prevent over-fetching

- **Draw button logic**
  - Shows fullscreen loading overlay when drawing
  - Protects with 10-second timeout fallback (user never gets stuck)
  - Mask disables rest of UI during async operation

- **Weather info display**
  - Fetches from edge function proxy to OpenWeatherMap
  - Weather icons loaded from `/public/icons/weather/*.svg`, no external CDNs
  - Display adjusts for offline or invalid API data

---

## Setup

```bash
npm install
npx supabase start
````

Create `.env`:

```env
REACT_APP_EDGE_FORTUNE_URL=http://localhost:54321/functions/v1/fortune-shrine-action-gateway
```

Then:

```bash
npm run dev
```

---

## Project Structure

| File/Folder                         | Description                                       |
| ----------------------------------- | ------------------------------------------------- |
| `src/App.tsx`                      | Root of app lifecycle: fetch, session, layout
| `src/components/WeatherIcon.tsx`    | Local SVG renderer, maps OpenWeather icon code    |
| `src/components/LoadingOverlay.tsx` | Full-screen loading mask during async action      |
| `src/components/ShrineFortune.tsx`  | Fortune button + result display + name greeting   |
| `src/components/BubbleMessages.tsx` | Realtime draw result panel, public/private switch |
| `functions/edge/index.ts`           | Supabase Edge Function for all API entry          |
| `public/icons/weather/*.svg`        | Full-color weather icons, CDN-free                |

---

## Why You Can Trust This Work

- I've built production-grade systems involving concurrency, wallet transactions, and player integrity for live gaming platforms.
- This demo implements key real-world patterns: edge routing, bearer-based auth, CORS control, client masking, and polling efficiency.
- Every feature is actually working — no placeholders, no dead buttons. What's shown is what runs.
- My focus is backend logic, real-time UX safeguards, API reliability, and smooth integration.

This isn't a frontend mockup. It's a working full-stack implementation designed to prove that I can ship reliable backend-powered applications — even without client trust yet.

---

If you're hiring someone who builds with stability, edge-case awareness, and long-term maintainability in mind — I'm ready to join your project.

## Credits

- Weather icons adapted from the open-source [Weather Icons](https://github.com/basmilius/weather-icons) by Basmilius.  
  Icons were downloaded and served locally for performance and stability.

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/api), accessed via a custom Supabase Edge Function proxy.

- Application backend, database, authentication, and serverless function routing powered by [Supabase](https://supabase.com).

