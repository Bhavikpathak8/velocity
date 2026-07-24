# ⚡ VELOCITY Athletics

**India's Premier High-Performance Athletic Footwear & Apparel E-Commerce Platform**  
*React 18 • Vite • Tailwind CSS • Three.js • PostgreSQL • Express*

A full-stack e-commerce store built as a 3rd year university project.  
Engineered for speed and motion — buy kinetic carbon footwear, apparel, and get AI-assisted precision sizing recommendations.

---

## ✨ Features

### 👤 User Features

| Feature | Description |
| :--- | :--- |
| 🔐 **Auth** | Email/password login, account registration & persistent session state |
| 👟 **Browse Products** | Multi-category sorting (*Footwear, Apparel*), price slider, brand filter & rating filters |
| 🔍 **Search Autocomplete** | Live suggestions as you type in the search modal |
| 📖 **Product Detail** | Full product info, 360° 3D Shoe Orbit Inspector & HD 2.5x Lens Zoom on hover |
| 🤖 **Smart Fit AI** | Precision size recommendation calculator based on current shoe brand & foot width |
| ⚖️ **Gear Comparison** | Side-by-side spec comparison table for up to 3 products |
| 🛒 **Cart & Drawer** | Real-time cart calculation, free shipping progress bar & coupon entry |
| 💳 **Checkout** | Multiple payment methods: Credit/Debit Card, **Cash on Delivery (COD)**, UPI, PayPal |
| 📦 **Order Tracking** | Live progress bar (*Processing ➔ Shipped ➔ Delivered ➔ Cancelled*) |
| ❌ **Order Cancellation** | Instant 1-click user order cancellation from account dashboard |
| 📄 **Invoice Generation** | Printable PDF receipt download on order confirmation |
| 💬 **VELOCITY AI Chat** | Floating AI chatbot for instant customer support (orders, returns, sizing) |
| 💱 **Multi-Currency** | Real-time currency switcher (**USD $**, **EUR €**, **GBP £**, **INR ₹**) |
| 🌙 **Dark Mode** | Modern HSL token-based light/dark theme switcher |

---

### 🛡️ Admin Features

| Feature | Description |
| :--- | :--- |
| 📊 **Dashboard** | Revenue metrics, total orders processed, active customers, and average order value |
| 📦 **Product Management** | Add, edit (title, price, stock, category, SKU), and delete products with clean action controls |
| 👥 **User Management** | View registered customer directory, emails, roles, and order history |
| 🚚 **Order Fulfillment** | Change live fulfillment status (*Processing ➔ Shipped ➔ Delivered ➔ Cancelled*) |
| 🎟️ **Discount Control** | Issue, edit, and track usage for promo codes (*WELCOME20*, *VELOCITY10*) |

---

## 🛠️ Tech Stack

### Backend & Database
- **Node.js + Express** — REST API endpoints
- **PostgreSQL 16** — Relational database
- **pgAdmin 4** — Database management GUI
- **LocalStorage API** — Client-side fallback state engine

### Frontend
- **React 18 + Vite** — UI framework & lightning-fast build tool
- **Tailwind CSS v4** — Utility-first styling & design token system
- **Three.js** — 360° Interactive 3D shoe orbit renderer
- **React Router v6** — Client-side routing
- **Canvas Confetti** — Celebratory purchase animations

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm
- PostgreSQL 16+
- pgAdmin 4

---

### 1. Clone the Repository

```bash
git clone https://github.com/Bhavikpathak8/stitch_premium_e_commerce_homepage.git
cd stitch_premium_e_commerce_homepage
```

---

### 2. Setup Database

Open pgAdmin ➔ connect to PostgreSQL ➔ create a new database:

```sql
CREATE DATABASE velocity_db;
```

Then open Query Tool in pgAdmin (`Alt + Shift + Q`) and run the schema setup:

```sql
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    category VARCHAR(100),
    stock_quantity INT DEFAULT 50,
    sku VARCHAR(100) UNIQUE,
    image_url TEXT
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    customer_name VARCHAR(100),
    customer_email VARCHAR(150),
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'Credit Card',
    status VARCHAR(50) DEFAULT 'Processing',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id),
    quantity INT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS coupons (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_percentage INT NOT NULL,
    status VARCHAR(20) DEFAULT 'Active'
);

INSERT INTO coupons (code, discount_percentage) VALUES 
('WELCOME20', 20),
('VELOCITY10', 10)
ON CONFLICT (code) DO NOTHING;
```

---

### 3. Setup & Run Project

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

App runs at: `http://localhost:3000`

---

### 4. Default Admin Account

- **Email:** `admin@velocity.com`
- **Password:** `admin123`

---

## 📁 Project Structure

```
stitch_premium_e_commerce_homepage/
├── public/                    # Static assets & icons
├── src/
│   ├── components/            # Reusable UI Components
│   │   ├── CartDrawer.jsx     # Slide-out shopping cart
│   │   ├── ChatWidget.jsx     # Live VELOCITY AI support widget
│   │   ├── CompareFloatingBar # Sticky bottom comparison bar
│   │   ├── CompareModal.jsx   # Side-by-side gear spec modal
│   │   ├── FitCalculatorModal # AI size recommendation modal
│   │   ├── ImageZoomLens.jsx  # HD 2.5x magnification lens
│   │   ├── Navbar.jsx         # Header navigation & theme toggle
│   │   ├── ProductCard.jsx    # Product grid card component
│   │   ├── QuickViewModal.jsx # Quick product modal view
│   │   ├── ReviewModal.jsx    # Rating submission modal
│   │   ├── ShoeViewer3D.jsx   # 360° Three.js 3D orbit viewer
│   │   └── SizeGuideModal.jsx # Sizing guide modal
│   ├── context/               # Global React State Providers
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   ├── CompareContext.jsx
│   │   ├── CurrencyContext.jsx
│   │   ├── ProductsContext.jsx
│   │   └── ToastContext.jsx
│   ├── pages/                 # Top-Level Page Views
│   │   ├── AdminDashboard.jsx # Admin management portal
│   │   ├── CartPage.jsx       # Full cart page view
│   │   ├── CheckoutPage.jsx   # Shipping & payment checkout
│   │   ├── HelpCenter.jsx     # FAQ & support page
│   │   ├── Home.jsx           # Landing homepage
│   │   ├── OrderConfirmed.jsx # Receipt & printable PDF invoice
│   │   ├── ProductDetail.jsx  # PDP view with 3D viewer & Fit AI
│   │   ├── Shop.jsx           # Catalog directory & filters
│   │   ├── SignIn.jsx         # Auth page
│   │   ├── Sustainability.jsx # Eco initiative details
│   │   └── UserProfile.jsx    # Order history & account management
│   ├── App.jsx                # Router & main application
│   ├── index.css              # Design tokens & Tailwind base
│   └── main.jsx               # React DOM entry point
├── docker-compose.yml
├── Dockerfile
├── package.json
└── README.md
```

---

## 🔑 Environment Variables

For production, set these environment variables:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | Server Port | `5000` |
| `NODE_ENV` | Environment Mode | `production` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://velocity_user:velocity_pass@localhost:5432/velocity_db` |
| `JWT_SECRET` | Secret token key | `velocity_ultra_secret_key_2026` |

---

## 🔄 How Purchase & Fulfillment Works

```
Customer selects item ➔ Uses Smart Fit AI ➔ Adds to Bag
         ↓
Customer checks out ➔ Chooses Payment (Credit Card / COD) ➔ Receives PDF Invoice
         ↓
Admin Dashboard updates status ➔ Processing ➔ Shipped ➔ Delivered
         ↓
Customer tracks order live or cancels directly from User Profile
```

---

## 🏫 About This Project

Built as a **3rd Year University Project** demonstrating:

- Full-stack web development (*React + Tailwind + Express + PostgreSQL*)
- 3D Graphics integration (*Three.js Interactive Orbit Inspection*)
- AI-assisted sizing recommendation algorithms
- Multi-currency conversion & flexible payment gateways (*COD, Card, UPI*)
- Order tracking, instant cancellation & printable PDF invoice generation
- Version control with Git & GitHub

---

## 👨‍💻 Developer

**Bhavik Pathak**  
📧 Email: bhavikpathak08@gmail.com  
🔗 GitHub: [Bhavikpathak8](https://github.com/Bhavikpathak8)

---

*Made with ⚡ for athletes everywhere*