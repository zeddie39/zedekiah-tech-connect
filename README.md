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
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## 🚀 Demo

🌍 **Live Preview:** [https://ztechelectronics.co.ke](https://ztechelectronics.co.ke)

![Demo GIF](public/screenshots/demo.gif)

> _Want to see it in action? Check out the live demo above or the GIF!_

---

## 🚀 Features

- 🛒 **Service Catalog**: Browse, search, and book electronics services (repairs, installations, consultations, and more).
- 💳 **M-Pesa Payments**: Secure, real-time mobile payments via Safaricom Daraja STK Push.
- 🧑‍💻 **Modern UI/UX**: Lightning-fast, responsive frontend built with React, Vite, and Tailwind CSS.
- 🗄️ **Supabase Backend**: Orders, users, and payments stored securely in a scalable Postgres database.
- 🔒 **Environment Config**: All secrets and keys managed via `.env` for maximum security.
- 📱 **Mobile Friendly**: Fully responsive design for all devices.
- 🛠️ **Easy Customization**: Add new services, tweak styles, or extend payment logic in minutes.

---

## 🖼️ Screenshots

> _Add your own screenshots here!_

| Home Page | Service Booking | Payment Flow |
|-----------|----------------|--------------|
| ![Home](public/screenshots/home.png) | ![Booking](public/screenshots/booking.png) | ![Payment](public/screenshots/payment.png) |

---

## 🛠️ Tech Stack

| Layer      | Technology                                  |
|------------|---------------------------------------------|
| Frontend   | React, TypeScript, Vite, Tailwind CSS, Shadcn UI |
| Backend    | Node.js, Express, Axios                     |
| Database   | Supabase (Postgres)                         |
| Payments   | Safaricom M-Pesa Daraja API                 |
| Auth       | Supabase Auth (optional)                    |
| Dev Tools  | VS Code, ESLint, Prettier                   |


## 🗂️ Project Structure

```
zedekiah-tech-connect/
├── public/                  # Static assets (images, manifest, etc.)
│   ├── screenshots/         # (Add your screenshots here for README)
│   └── ...
├── server/                  # Backend API (Express, M-Pesa logic)
│   └── mpesa.js             # M-Pesa payment integration logic
├── src/                     # Frontend source (React components, data, styles)
│   ├── components/          # Reusable UI components
│   ├── data/                # Static data (e.g., servicesData.tsx)
│   ├── hooks/               # Custom React hooks
│   ├── integrations/        # Third-party integrations (e.g., supabase)
│   ├── lib/                 # Utility functions
│   ├── pages/               # Page-level React components
│   ├── types/               # TypeScript type definitions
│   └── ...
├── .env                     # Environment variables (not committed)
├── package.json             # Project scripts and dependencies
├── tailwind.config.ts       # Tailwind CSS config
├── vite.config.ts           # Vite config
├── README.md                # Project documentation
└── ...
```

**Key Files & Folders:**
- `server/mpesa.js`: Handles all M-Pesa payment logic and callbacks.
- `src/components/`: All UI building blocks (Navbar, Footer, etc).
- `src/data/servicesData.tsx`: List of services offered.
- `src/pages/`: Main app pages (Home, Shop, Contact, etc).
- `public/`: Static files and images.
- `.env`: Store your API keys and secrets here (never commit this!).

## 🏗️ Architecture

```
[ React Frontend ]  <--->  [ Express API ]  <--->  [ Supabase DB ]
         |                        |
         |                        |
         |----> [ M-Pesa Daraja API ] <----|
```

- **Frontend**: Handles UI, service browsing, and payment initiation.
- **Backend**: Handles API requests, payment processing, and database updates.
- **Supabase**: Stores users, orders, and payment records.
- **M-Pesa**: Processes mobile payments via STK Push.

---

## ⚙️ Getting Started

### 1. **Clone the Repository**

```sh
git clone https://github.com/yourusername/ztech-electronics.git
cd ztech-electronics
```

### 2. **Install Dependencies**

```sh
npm install
```

### 3. **Configure Environment Variables**

Create a `.env` file in the root directory:

```env
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# M-Pesa (Daraja)
MPESA_CONSUMER_KEY=your_mpesa_consumer_key
MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
MPESA_SHORTCODE=your_mpesa_shortcode
MPESA_PASSKEY=your_mpesa_passkey
MPESA_CALLBACK_URL=https://yourdomain.com/api/mpesa/callback

# Server
PORT=5002
```

### 4. **Run the Backend Server**

```sh
node server/mpesa.js
```

### 5. **Run the Frontend**

```sh
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) to view the app!

---

## 🔑 Environment Variables

| Variable                      | Description                                 |
|-------------------------------|---------------------------------------------|
| SUPABASE_URL                  | Your Supabase project URL                   |
| SUPABASE_SERVICE_ROLE_KEY     | Supabase service role key                   |
| MPESA_CONSUMER_KEY            | M-Pesa Daraja consumer key                  |
| MPESA_CONSUMER_SECRET         | M-Pesa Daraja consumer secret               |
| MPESA_SHORTCODE               | M-Pesa Paybill/Shortcode                    |
| MPESA_PASSKEY                 | M-Pesa Daraja passkey                       |
| MPESA_CALLBACK_URL            | Public callback URL for payment updates     |
| PORT                          | Backend server port (default: 5002)         |

---

## 💳 M-Pesa Integration

- **Initiate Payment:**  
  The frontend sends a POST request to `/api/mpesa/stkpush` with payment details.
- **STK Push:**  
  The backend (see [`server/mpesa.js`](server/mpesa.js)) generates an access token, builds the payload, and sends it to Safaricom's sandbox endpoint.
- **Callback Handling:**  
  Safaricom calls your `/api/mpesa/callback` endpoint with payment results. The backend updates the order status in Supabase.
- **Testing:**  
  Use [Safaricom's test credentials](https://developer.safaricom.co.ke/test_credentials) for sandbox mode.

---

## 🗄️ Supabase Integration

- **Orders Table:**  
  Stores order details, payment status, and M-Pesa receipt numbers.
- **User Management:**  
  (Optional) Use Supabase Auth for user sign-up and login.
- **Customization:**  
  Modify the Supabase schema to fit your business needs.

---

## 🎨 Customization

- **Add/Edit Services:**  
  Update [`src/data/servicesData.tsx`](src/data/servicesData.tsx) to add or modify services.
- **Styling:**  
  Tweak [`tailwind.config.ts`](tailwind.config.ts) and [`src/App.css`](src/App.css) for custom styles.
- **Payment Logic:**  
  Extend or modify payment handling in [`server/mpesa.js`](server/mpesa.js).
- **UI Components:**  
  Use [Shadcn UI](https://ui.shadcn.com/) for beautiful, accessible components.

---

## 🧩 Troubleshooting

- **M-Pesa Errors:**  
  - Double-check your credentials in `.env`.
  - Ensure your callback URL is publicly accessible (use [ngrok](https://ngrok.com/) for local testing).
  - Check Safaricom sandbox status [here](https://developer.safaricom.co.ke/).

- **Dependency Issues:**  
  - Delete `node_modules` and `package-lock.json`, then run `npm install` again.

- **Supabase Issues:**  
  - Verify your table names and keys match those in the backend code.

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

---

## 🌟 Credits

- [Safaricom Daraja API](https://developer.safaricom.co.ke/)
- [Supabase](https://supabase.com/)
- [Vite](https://vitejs.dev/)
- [Shadcn UI](https://ui.shadcn.com/)

---

> **Built with ❤️ by ZTech