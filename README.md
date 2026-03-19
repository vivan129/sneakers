# NO LOGO JUST VIBE

Full-stack ecommerce app (Vite + React + Express + SQLite) with:
- Storefront (shoes + apparel)
- Admin dashboard (product CRUD, image upload, stock toggles)
- Auth (signup/login)
- Orders + user profile

## Local Development

### Prerequisites
- Node.js 20+
- Bun (optional, for faster local scripts)

### Run
```bash
npm install
npm run dev
```

App URLs:
- Frontend: `http://localhost:5173`
- API: `http://localhost:3001`

## Product Model

Products support:
- `productType`: `shoes` | `apparel`
- `description`: required
- `sizes`: numeric (shoe sizes) or string (`XS`..`XXL`) for apparel
- `image`: uploaded asset URL (stored under `/uploads/...`)

## Media / Uploads

Uploaded images are served from:
- `server/uploads`
- API route: `POST /api/upload`

Important: production API now returns absolute URLs for `/uploads/...`, so frontend can be hosted on a different domain.

## Deploying on Render (Recommended Full-Stack)

This repo includes `render.yaml` for one-click setup.

### Manual Render setup
1. Create a new **Web Service** from this repo.
2. Use:
   - Build command: `npm install && npm run build`
   - Start command: `npm run start`
3. Runtime: Node 20+
4. Deploy.

The app runs as one service:
- React frontend served by Express in production
- API under `/api/*`
- uploads under `/uploads/*`

## Deploying on Vercel (Frontend) + Render (API)

Because this app uses SQLite on the server, best practice is:
- Host API on Render
- Host frontend on Vercel

### Steps
1. Deploy backend on Render first and copy the API base URL.
   - Example: `https://your-render-service.onrender.com`
2. On Vercel, add environment variable:
   - `VITE_API_BASE=https://your-render-service.onrender.com`
3. Deploy this repo to Vercel (uses `vercel.json`).

Frontend will call:
- `${VITE_API_BASE}/api/...`
- `${VITE_API_BASE}/uploads/...` (via API-returned absolute image URLs)

## Scripts

- `npm run dev` -> Vite + API concurrently
- `npm run build` -> frontend production build
- `npm run start` -> production API/frontend server

## Notes

- DB file: `server/shop.db`
- Hero video path: `public/hero.mp4`
- If hero video does not autoplay in some browsers, re-encode to H.264/AAC MP4.
