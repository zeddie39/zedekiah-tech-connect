# ⚡️ ZTech Electronics - Fullstack App

Welcome to **ZTech Electronics** — your one-stop platform for all things electronics!  
From seamless service booking to secure M-Pesa payments, this app is built for speed, reliability, and a delightful user experience.

---


## ✨ Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [M-Pesa Integration](#m-pesa-integration)
- [Supabase Integration](#supabase-integration)
- [Customization](#customization)
```md
# ⚡️ Zedekiah Tech Connect — ZTech Electronics

This repository contains a full-stack web application for an electronics services marketplace: product/service listings, booking & repair requests, secure M‑Pesa payments, and a Supabase-backed data store. The app is built with modern tooling (React + TypeScript, Vite, Tailwind CSS) and a small Node backend for payment/webhook handling.

This README is a complete reference for contributors and maintainers — setup, architecture, environment variables, integrations, common tasks, and troubleshooting are covered below.

---

## Table of contents

- [Quick demo](#quick-demo)
- [What this project does](#what-this-project-does)
- [Tech stack](#tech-stack)
- [Repository layout](#repository-layout)
- [Local development (quickstart)](#local-development-quickstart)
- [Environment variables](#environment-variables)
- [M‑Pesa (Daraja) integration details](#m-pesa-daraja-integration-details)
- [Supabase integration](#supabase-integration)
- [Testing and debugging tips](#testing-and-debugging-tips)
- [Deployment notes](#deployment-notes)
- [Contributing & code style](#contributing--code-style)
- [License & credits](#license--credits)

---

## Quick demo

- Live site (if deployed): https://ztechelectronics.co.ke (may be a demo domain)
- Screenshots and demo GIFs are kept under `public/screenshots/` — add your own before publishing.

---

## What this project does

- Showcases services (repairs, installations, maintenance) and allows customers to:
  - Browse services and view details
  - Add services to a cart and checkout
  - Initiate mobile payments via M‑Pesa STK push
  - Track order/payment status (via Supabase)
- Provides a small admin/dashboard area for managing orders, staff, and analytics.

---

## Tech stack

- Frontend: React + TypeScript, Vite, Tailwind CSS, shadcn/ui components
- Backend: Minimal Node.js server in `server/` (Express-like handlers, payment logic)
- Database & Auth: Supabase (Postgres + optional Supabase Auth)
- Payments: Safaricom Daraja (M‑Pesa STK Push)
- Tooling: ESLint, Prettier, Husky (if configured), npm/bun for package management

---

## Repository layout

Top-level layout (relevant files and folders):

```
zedekiah-tech-connect/
├─ public/                    # Static assets and screenshots
├─ server/                    # Small backend for payments and webhooks (mpesa.js)
│  └─ mpesa.js
├─ src/                       # Frontend application
│  ├─ components/             # Reusable UI components
│  ├─ pages/                  # Page-level components (Home, Shop, ProductDetails, etc.)
│  ├─ data/                   # Static seeds like servicesData.tsx
│  ├─ hooks/                  # Custom React hooks
│  └─ integrations/           # Supabase / other integrations
├─ README.md
├─ package.json
├─ vite.config.ts
└─ tailwind.config.ts
```

Important files:

- `server/mpesa.js` — contains the M‑Pesa token generation, STK push logic, and callback handlers.
- `src/pages/ProductDetails.tsx` — current working file (product/service detail page).
- `src/data/servicesData.tsx` — where services are defined for the frontend.

---

## Local development (quickstart)

Prerequisites:

- Node.js (v18+ recommended)
- npm (or bun/pnpm if you prefer; `package.json` scripts assume npm)
- Optional: ngrok for exposing local webhooks during M‑Pesa testing

1) Clone

```powershell
git clone https://github.com/zeddie39/zedekiah-tech-connect.git
cd zedekiah-tech-connect
```

2) Install

```powershell
npm install
```

3) Create `.env` (see next section) and populate required values.

4) Start the backend (payment/webhook listener)

```powershell
node server/mpesa.js
```

5) Start the frontend

```powershell
npm run dev
```

Open http://localhost:5173 in your browser (Vite default).

---

## Environment variables

Create a `.env` file at the repository root. Do NOT commit this file.

Minimum variables used by the project:

```env
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# M‑Pesa (Daraja)
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_SHORTCODE=your_short_code_or_paybill
MPESA_PASSKEY=your_passkey
MPESA_CALLBACK_URL=https://your-public-domain/api/mpesa/callback

# Server
PORT=5002
```

Notes:

- `MPESA_CALLBACK_URL` must be publicly accessible for Safaricom to call it. For local testing use `ngrok http 5002` and set the public URL.
- `SUPABASE_SERVICE_ROLE_KEY` is sensitive — keep it secret and use server-side only.

---

## M‑Pesa (Daraja) integration details

- Flow summary:
  1. Frontend posts payment request to the backend (`/api/mpesa/stkpush`).
  2. Backend uses `MPESA_CONSUMER_KEY` and `MPESA_CONSUMER_SECRET` to request an access token from Safaricom.
  3. Backend constructs STK Push payload (including timestamp, passkey, amount, phone number) and calls the Daraja endpoint.
  4. User receives STK prompt; on completion Safaricom calls the configured `MPESA_CALLBACK_URL`.
  5. Backend webhook parses callback and stores payment result to Supabase.

- Sandbox/testing:
  - Use Safaricom developer sandbox credentials and their test numbers.
  - If testing locally, expose your webhook URL using `ngrok` and update `MPESA_CALLBACK_URL` accordingly.

Security tips:

- Never store consumer secret or passkey in client code.
- Validate and sanitize any incoming webhook payloads.

---

## Supabase integration

- The app expects basic tables for `orders`, `users`, and `payments` (see `server/mpesa.js` for exact field names). If you want a starting schema, create a table `orders` with at least:
  - id (uuid)
  - user_id (uuid)
  - items (jsonb)
  - total_amount (numeric)
  - status (text) — e.g. `pending`, `paid`, `failed`
  - mpesa_receipt (text)

- Use Supabase Auth if you need sign-up/login flows. The frontend includes integration points under `src/integrations/supabase`.

---

## Testing and debugging tips

- To inspect network calls from the frontend, use your browser devtools.
- To debug payment flows locally:
  - Start the backend on port `5002`.
  - Run `ngrok http 5002` and update `MPESA_CALLBACK_URL` to the ngrok URL.
- If STK push fails, check:
  - Your consumer key/secret
  - Passkey & shortcode
  - Correct timestamp and Base64 encoded password generation (see `server/mpesa.js`)

---

## Deployment notes

- Backend: any Node host (Heroku, Fly, Railway, Vercel Serverless functions with adjustments). Ensure `MPESA_CALLBACK_URL` is the publicly reachable URL.
- Frontend: static build via `npm run build` + host on Netlify/Vercel/Cloudflare Pages or any static host.

CI/CD tips:

- Keep secrets in your host environment variables (do not commit `.env`).
- Run a quick smoke test after deployment to verify STK push and webhook processing.

---

## Common commands

- Install dependencies: `npm install`
- Run dev frontend: `npm run dev`
- Build frontend for production: `npm run build`
- Start backend: `node server/mpesa.js`

---

## Contributing & code style

- Follow these steps:
  1. Create an issue for larger changes.
  2. Create a branch: `git checkout -b feature/your-feature`.
  3. Push your branch and open a PR.

- Code style:
  - TypeScript for frontend code. Keep types in `src/types/`.
  - Prefer small, focused commits and clear commit messages. For docs changes use `docs:` or `chore(docs):` prefixes.

---

## License & credits

- MIT — see the `LICENSE` file.

Credits:

- Safaricom Daraja API — https://developer.safaricom.co.ke/
- Supabase — https://supabase.com/
- Vite — https://vitejs.dev/

---

If you'd like, I can also:

- Add a small CONTRIBUTING.md with PR checklist
- Create a `schema.sql` or Supabase migration snippet for the `orders` table
- Add example screenshots to `public/screenshots/`

Thanks for working on this — say the word and I will commit & push the README update for you.
```