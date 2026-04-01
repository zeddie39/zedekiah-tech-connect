# ⚡ Zedekiah Tech Connect — ZTech Electronics

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3+-38B2AC)](https://tailwindcss.com)

**A modern full-stack electronics marketplace platform with M-Pesa payments, service booking, and admin dashboard.**

[Live Demo](https://ztechelectronics.co.ke) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 🎯 Overview

**ZTech Electronics** is a comprehensive full-stack web application for managing electronics services. Whether it's repairs, installations, or maintenance — this platform connects customers with services, streamlines booking, and handles secure M-Pesa payments seamlessly.

### ✨ Key Features

- 🛍️ **Service Catalog** — Browse and explore electronics services with detailed descriptions
- 🛒 **Shopping Cart** — Add services, manage cart, review before checkout
- 💳 **Secure Payments** — M-Pesa STK push integration for safe transactions
- 📊 **Real-time Status Tracking** — Monitor order and payment status live
- 🔐 **Authenticated Access** — Supabase auth with role-based access control
- 📱 **Responsive Design** — Works perfectly on desktop, tablet, and mobile devices
- ⚙️ **Admin Dashboard** — Manage orders, staff, and view analytics
- 🔄 **Webhook Integration** — Real-time payment updates from Safaricom

---

## 🏗️ Tech Stack

<table>
<tr>
<td>

**Frontend**
- React 18+ with TypeScript
- Vite (lightning-fast bundler)
- Tailwind CSS (utility-first styling)
- shadcn/ui (accessible components)
- Responsive & modern UI

</td>
<td>

**Backend**
- Node.js (minimal server)
- Express-like handlers
- Payment processing logic
- Webhook listeners

</td>
<td>

**Infrastructure**
- Supabase (PostgreSQL + Auth)
- Safaricom Daraja API (M-Pesa)
- Environment-based configuration
- RESTful API design

</td>
</tr>
</table>

---

## 📂 Project Structure

```
zedekiah-tech-connect/
├── 📁 public/                    # Static assets, screenshots, favicon
├── 📁 server/                    # Backend services
│  └── mpesa.js                   # M-Pesa payment processing & webhooks
├── 📁 src/                       # Frontend application
│  ├── 📁 components/             # Reusable React components
│  ├── 📁 pages/                  # Page-level views
│  ├── 📁 hooks/                  # Custom React hooks
│  ├── 📁 data/                   # Static data & seeds
│  ├── 📁 types/                  # TypeScript type definitions
│  ├── 📁 integrations/           # Supabase & external APIs
│  └── App.tsx                    # Main app component
├── 📄 package.json               # Dependencies & scripts
├── 📄 vite.config.ts             # Vite configuration
├── 📄 tailwind.config.ts         # Tailwind styling config
├── 📄 .env.example               # Environment template
└── 📄 README.md                  # This file
```

### 📌 Key Files

| File | Purpose |
|------|---------|
| `server/mpesa.js` | M-Pesa STK push, token generation, webhook handlers |
| `src/pages/ProductDetails.tsx` | Service detail & booking page |
| `src/data/servicesData.tsx` | Service catalog definitions |
| `src/integrations/` | Supabase auth & database integration |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18 or higher
- **npm**, **yarn**, or **bun** package manager
- **Git** for version control
- (Optional) **ngrok** for local M-Pesa webhook testing

### Installation Steps

**1. Clone the repository**

```bash
git clone https://github.com/zeddie39/zedekiah-tech-connect.git
cd zedekiah-tech-connect
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

Create a `.env` file in the project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# M-Pesa (Daraja) Configuration
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_SHORTCODE=your_shortcode
MPESA_PASSKEY=your_passkey
MPESA_CALLBACK_URL=https://your-domain.com/api/mpesa/callback

# Server Configuration
PORT=5002
NODE_ENV=development
```

**4. Start the backend server**

```bash
node server/mpesa.js
```

The backend will listen on `http://localhost:5002`

**5. Start the frontend development server** (in a new terminal)

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ⚙️ Configuration & Integration

### 🔐 Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | ✅ | `https://xxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service key (backend only) | ✅ | `eyJ...` |
| `MPESA_CONSUMER_KEY` | Daraja API consumer key | ✅ | `xxxxxxxxxxxx` |
| `MPESA_CONSUMER_SECRET` | Daraja API consumer secret | ✅ | `xxxxxxxxxxxx` |
| `MPESA_SHORTCODE` | M-Pesa paybill/till number | ✅ | `123456` |
| `MPESA_PASSKEY` | M-Pesa passkey | ✅ | `xxxxx` |
| `MPESA_CALLBACK_URL` | Public webhook URL | ✅ | `https://api.example.com/api/mpesa/callback` |
| `PORT` | Backend server port | ❌ | `5002` |

> ⚠️ **Security Note**: Keep `.env` secret. Never commit sensitive keys. Use `.env.example` as a template.

### 💳 M-Pesa Integration

#### Payment Flow

```
User selects services → Clicks checkout → Frontend sends request
    ↓
Backend generates access token from Safaricom Daraja
    ↓
Backend crafts STK Push payload (phone, amount, timestamp, password)
    ↓
Safaricom sends STK prompt to customer's phone
    ↓
Customer enters M-Pesa PIN and confirms
    ↓
Safaricom calls configured MPESA_CALLBACK_URL webhook
    ↓
Backend stores transaction in Supabase → Updates order status
    ↓
Frontend polls and displays "Payment Confirmed"
```

#### Testing M-Pesa Locally

Use **ngrok** to expose your local server:

```bash
gngrok http 5002
```

Update your `.env`:

```env
MPESA_CALLBACK_URL=https://your-ngrok-url.ngrok.io/api/mpesa/callback
```

**Sandbox test numbers:** Use Safaricom's official test credentials from [developer.safaricom.co.ke](https://developer.safaricom.co.ke)

#### Security Best Practices

✅ Store secrets server-side only (never in client-side code)
✅ Validate & sanitize webhook payloads
✅ Use HTTPS for all payment-related endpoints
✅ Implement rate limiting on payment endpoints
✅ Log all payment transactions for auditing

### 🗄️ Supabase Setup

#### Database Schema

Create the following tables in Supabase:

**`orders` table:**

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  items JSONB NOT NULL,
  total_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  mpesa_receipt TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

**`users` table:**

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMP DEFAULT now()
);
```

**`payments` table:**

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  mpesa_receipt TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT now()
);
```

#### Enable Supabase Auth

1. Go to Supabase Dashboard → Authentication
2. Enable Email/Password or OAuth providers
3. Copy your `SUPABASE_URL` and `SUPABASE_ANON_KEY`
4. Frontend integration is ready at `src/integrations/supabase`

---

## 📦 Available Scripts

```bash
# Development
npm run dev              # Start frontend dev server (Vite)
npm run build            # Build frontend for production
npm run preview          # Preview production build locally

# Backend
node server/mpesa.js    # Start payment backend server

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
npm run type-check       # TypeScript type checking
```

---

## 🧪 Testing & Debugging

### Browser DevTools

1. Open Chrome/Firefox DevTools (F12)
2. Network tab → Monitor API calls to `/api/mpesa/stkpush`
3. Console → Check for errors

### Local Payment Testing

```bash
# Terminal 1: Start backend
node server/mpesa.js

# Terminal 2: Expose with ngrok
ngrok http 5002

# Terminal 3: Start frontend
npm run dev
```

### Debug Checklist

- ✅ Is `.env` properly configured?
- ✅ Is Supabase URL and key correct?
- ✅ Are M-Pesa credentials valid?
- ✅ Is `MPESA_CALLBACK_URL` publicly reachable?
- ✅ Check server logs for token generation errors
- ✅ Verify timestamp & password Base64 encoding in `server/mpesa.js`

---

## 🌐 Deployment

### Frontend Deployment

Build the frontend:

```bash
npm run build  # Creates dist/ folder
```

Deploy to your host:

| Platform | Command |
|----------|---------|
| **Netlify** | Connect GitHub repo, auto-deploys |
| **Vercel** | `vercel deploy` |
| **Cloudflare Pages** | Connect GitHub, auto-deploys |
| **GitHub Pages** | Configure in repo settings |

### Backend Deployment

Deploy `server/mpesa.js` to any Node.js host:

| Platform | Notes |
|----------|-------|
| **Railway** | Simple: `railway up` |
| **Fly.io** | Global deployment, great uptime |
| **Heroku** | `git push heroku main` |
| **Render** | Easy GitHub integration |
| **AWS Lambda** | Requires Vercel adapter |

**Critical**: Update `MPESA_CALLBACK_URL` to your production URL.

### Environment Variables on Host

Set environment variables in your hosting platform's dashboard:

- Railway: Variables tab
- Vercel: Settings → Environment Variables
- Fly: `fly secrets set KEY=VALUE`
- Heroku: `heroku config:set KEY=VALUE`

### CI/CD Pipeline

Example GitHub Actions workflow:

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run type-check
      # Deploy steps...
```

---

## 🤝 Contributing

We'd love your contributions! Here's how:

### Contribution Steps

1. **Fork** the repository
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** with clear, descriptive commits
4. **Push** to your branch: `git push origin feature/amazing-feature`
5. **Open a Pull Request** with a detailed description

### Code Standards

- **Language**: TypeScript (strongly typed)
- **Frontend**: React functional components with hooks
- **Styling**: Tailwind CSS utilities
- **Commits**: Use conventional commits (`feat:`, `fix:`, `docs:`, etc.)
- **Testing**: Write tests for critical features

### Git Workflow

```bash
git checkout -b fix/payment-issue
git add src/
git commit -m "fix: resolve M-Pesa callback parsing error"
git push origin fix/payment-issue
# Open PR on GitHub
```

### Pull Request Checklist

- [ ] Code follows project style guidelines
- [ ] TypeScript compilation passes (`npm run type-check`)
- [ ] Tests pass (if applicable)
- [ ] Documentation updated
- [ ] No console errors or warnings
- [ ] Commit messages are clear and descriptive

---

## 📚 Documentation

- [Safaricom Daraja API Docs](https://developer.safaricom.co.ke/)
- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)

---

## 🐛 Troubleshooting

### Issue: STK Push Not Appearing

**Solution:**
- Verify `MPESA_CONSUMER_KEY` and `MPESA_CONSUMER_SECRET`
- Check phone number format: should be `254712345678`
- Ensure amount > 0
- Check server logs for token generation errors

### Issue: Callback Not Received

**Solution:**
- Is `MPESA_CALLBACK_URL` publicly accessible?
- If testing locally, use ngrok: `ngrok http 5002`
- Check firewall settings
- Verify URL is HTTPS (production)

### Issue: Supabase Connection Failed

**Solution:**
- Verify `VITE_SUPABASE_URL` is correct
- Check API key permissions in Supabase dashboard
- Ensure database tables exist
- Check network requests in DevTools

### Issue: Tailwind Styles Not Applying

**Solution:**
- Restart dev server: `npm run dev`
- Clear Tailwind cache: `npx tailwindcss -i ./src/styles.css -o ./dist/output.css`
- Verify `tailwind.config.ts` includes all template paths

---

## 📄 License & Attribution

This project is licensed under the **MIT License** — see [LICENSE](./LICENSE) file for details.

### Credits & Acknowledgments

- 🏦 [Safaricom Daraja](https://developer.safaricom.co.ke/) — M-Pesa API
- 🗄️ [Supabase](https://supabase.com) — PostgreSQL & Auth
- ⚡ [Vite](https://vitejs.dev) — Build tool
- 🎨 [Tailwind CSS](https://tailwindcss.com) — Utility-first CSS
- 🧩 [shadcn/ui](https://ui.shadcn.com) — Component library
- ⚛️ [React](https://react.dev) — UI library

---

## 📞 Support & Contact

Have questions or found a bug? 

- 📧 Open an [issue on GitHub](https://github.com/zeddie39/zedekiah-tech-connect/issues)
- 💬 Start a [discussion](https://github.com/zeddie39/zedekiah-tech-connect/discussions)
- 🔗 Check out the [project documentation](#-documentation)

---

<div align="center">

**Made with ❤️ by the ZTech Team**

⭐ If this project helped you, please star it!

[![GitHub](https://img.shields.io/badge/GitHub-zeddie39-black?logo=github)](https://github.com/zeddie39)

</div>
