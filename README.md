<div align="center">

  # 🛒 FreshCart — Modern E-Commerce Platform

  <p align="center">
    <strong>A high-performance, responsive, and feature-packed grocery & retail e-commerce web application built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS 4.</strong>
  </p>

  <p align="center">
    <a href="https://github.com/salah-khaled-dev/FreshCart-Ecommerce">
      <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github" alt="Repository" />
    </a>
    <img src="https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19.3-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
    <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-4.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  </p>

</div>

---

## 📖 Overview

**FreshCart** is a modern full-featured e-commerce frontend designed to deliver an exceptional shopping experience for fresh produce, groceries, and daily consumer essentials. 

Engineered with cutting-edge web technologies, it features fluid animations, comprehensive authentication workflows, protected user routes with interactive auth-guards, real-time cart and wishlist synchronization, multiple payment gateway integrations (Cash on Delivery & Online Card payments), multi-address management, and dynamic order tracking.

---

## ✨ Key Features & Highlights

### 🛍️ Storefront & Browsing Experience
- **Interactive Hero Showcase:** High-impact promotional hero slider powered by Swiper with auto-play, custom controls, and responsive layouts.
- **Dynamic Category & Subcategory Carousels:** Explore featured grocery categories, subcategories, and top brands with instant product filtering.
- **Brand Exploration Hub:** Dedicated brand discovery page (`/brands`) and dynamic brand catalog (`/brands/[id]`).
- **Interactive Product Cards:**
  - Dynamic discount badges (`-XX%`) and stock availability chips.
  - ⭐ Real-time ratings and total customer review counts.
  - ❤️ One-click instant **Wishlist toggle** with persistent status.
  - 🔄 **Quick Share Action:** One-tap direct product link copy with animated rotation icon and visual toast notification.
  - 🛒 Fast Add to Cart with live feedback.

---

### 🔍 Rich Product Details View (`/productdetails/[id]`)
- **Multi-Image Showcase:** Interactive image gallery featuring high-resolution main preview, thumbnail navigation, and smooth zoom indicators.
- **Interactive Purchasing:** Real-time quantity selectors, price calculations, and stock counters.
- **Detailed Specifications:** Category, brand, rating overview, SKU, delivery notes, and return policies.
- **Customer Reviews & Ratings Breakdown:** Star rating bars, customer comments, and verified purchase timestamps.
- **Related Products Carousel:** Smart algorithmic product recommendations based on the active category.

---

### 🔐 Authentication, Security & Friendly Guards
- **Full Auth Lifecycle:**
  - 🔑 **Sign In:** Secure login with client-side validation and password reveal toggle.
  - 📝 **Sign Up:** Intuitive registration with instant auto-login session creation (no confusing extra redirects).
  - 🔄 **Password Recovery:** Multi-step forgot password workflow with email verification code and secure password reset.
- **Smart Auth Guards:**
  - Protected actions and sensitive routes (`/wishlist`, `/cart`, `/checkout`, `/addresses`, `/allorders`, `/orders`) feature an elegant **"Login Required"** card / modal rather than jarring sudden redirects.
  - Users can seamlessly log in and return to their flow without losing their current state.
  - Authenticated users attempting to visit `/login` or `/register` are automatically redirected to the Home page.
- **Validation & Persistence:** Strict form validation with **Zod** and **React Hook Form**, with token persistence via secure cookies.

---

### 🛒 Cart, Checkout & Order Management
- **Live Cart System:**
  - Real-time item quantity adjustment and item removal.
  - Dynamic order summary calculation (subtotal, taxes, shipping discounts).
  - Clear cart functionality.
- **Multi-Address Management (`/addresses`):**
  - Add, view, select, and delete saved delivery addresses with city, street, and phone numbers.
- **Flexible Checkout Flow (`/checkout`):**
  - Choose between **Cash on Delivery (COD)** and **Online Card Payment** (Stripe/PayMob gateway redirect).
  - Delivery address selection with instant feedback.
- **Order History & Tracking (`/allorders` & `/orders`):**
  - Complete list of placed orders with unique Order IDs.
  - Breakdown of items, quantities, payment status badges, and total amounts.

---

### 🎨 Design System & UX Micro-Interactions
- **Consistent Brand Identity:** Tailored fresh emerald green palette (`#16a34a`) paired with soft neutral backgrounds (`#f8fafc`).
- **Global Trust Features Banner:** Sticky 4-pillar trust badge section placed directly above the footer across all pages:
  - 🚚 **Free Shipping:** On orders over 500 EGP.
  - 🔄 **Easy Returns:** 14-day hassle-free return policy.
  - 🛡️ **Secure Payment:** 100% encrypted & secure checkout.
  - 🎧 **24/7 Support:** Dedicated round-the-clock customer care.
- **Fluid Micro-Interactions:** Custom hover states, transition-all easing, skeleton loaders, and responsive drawer menus.
- **Accessibility & Performance:** Zero TypeScript compile errors, 100% clean ESLint pass, and lightweight SVG icons via `lucide-react`.

---

## 🛠️ Tech Stack & Libraries

| Category | Technology / Library | Description |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) | App Router, Server & Client Components, Route Groups |
| **UI Library** | [React 19](https://react.dev/) | React 19 release with React Compiler support |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Strict type definitions, clean interfaces, 0 compile warnings |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) | Modern utility-first CSS engine with custom animations |
| **Icons** | [Lucide React](https://lucide.dev/) | Consistent, lightweight, accessible icon set |
| **Forms & Validation** | [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) | Schema-based validation with high performance |
| **Carousels / Sliders** | [Swiper 14](https://swiperjs.com/) | Touch-enabled responsive sliders and galleries |
| **UI Primitives** | [Base UI](https://base-ui.com/) & [Shadcn UI](https://ui.shadcn.com/) | Accessible headless component foundations |
| **API Integration** | Fetch API & Services | Modular RouteMisr E-Commerce REST API client |

---

## 📂 Project Architecture

```plaintext
final-project/
├── public/                       # Static assets, logos, and slider banners
│   └── images/
│       └── slider/               # Promotional slider banners
├── src/
│   ├── api/                      # API client services & TypeScript DTOs
│   │   ├── services/
│   │   │   └── routemisr.service.ts
│   │   └── types.ts
│   ├── app/                      # Next.js App Router structure
│   │   ├── (auth)/               # Route Group for authentication
│   │   │   ├── login/page.tsx    # Sign In, Forgot Password, Reset Code
│   │   │   └── register/page.tsx # Account Registration with auto-login
│   │   ├── _components/          # Modular homepage & shared components
│   │   │   ├── MainSlider/       # Hero banner slider
│   │   │   ├── ProductCard.tsx   # Reusable product card with wishlist & share
│   │   │   ├── PromoBanners/     # Promotional grid banners
│   │   │   ├── ShopByCategory/   # Category carousel
│   │   │   ├── TrustFeatures/    # 4-pillar trust features section
│   │   │   └── UserProfile/      # User profile dropdown menu
│   │   ├── addresses/            # Saved shipping addresses management
│   │   ├── allorders/            # User orders list & tracking
│   │   ├── brands/               # Brands showcase & brand detail pages
│   │   ├── cart/                 # Shopping cart management
│   │   ├── categories/           # Category exploration
│   │   ├── checkout/             # COD & Online payment checkout
│   │   ├── productdetails/[id]/  # Single product dynamic view & gallery
│   │   ├── shop/                 # Complete product catalog
│   │   ├── wishlist/             # Saved favorite products
│   │   ├── layout.tsx            # Root layout with Header & Footer
│   │   └── page.tsx              # Homepage composition
│   ├── components/ui/            # Reusable primitive UI components (button, input, etc.)
│   ├── layout/
│   │   ├── Navbar/               # Responsive header, search bar, cart badge
│   │   └── Footer/               # Footer with newsletter and trust banner
│   ├── lib/                      # Cookies & utility functions
│   └── schema/                   # Zod schemas for login and registration
├── .gitignore
├── next.config.ts
├── package.json
├── README.md
└── tsconfig.json
```

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Node.js** (v18.18.0 or later recommended)
- **npm**, **pnpm**, or **yarn**

### 2. Clone the Repository
```bash
git clone https://github.com/salah-khaled-dev/FreshCart-Ecommerce.git
cd FreshCart-Ecommerce
```

### 3. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 5. Build for Production
```bash
npm run build
npm run start
```

### 6. Linting & Type Checking
```bash
# Run TypeScript type check
npx tsc --noEmit

# Run ESLint audit
npm run lint
```

---

## 🌐 External API Integration

This application interacts with the **RouteMisr E-Commerce REST API**:
- **Authentication:** `POST /api/v1/auth/signin`, `POST /api/v1/auth/signup`, `POST /api/v1/auth/forgotPasswords`, `POST /api/v1/auth/verifyResetCode`, `PUT /api/v1/auth/resetPassword`.
- **Products & Categories:** `GET /api/v1/products`, `GET /api/v1/categories`, `GET /api/v1/subcategories`, `GET /api/v1/brands`.
- **Cart Management:** `GET /api/v1/cart`, `POST /api/v1/cart`, `PUT /api/v1/cart/{id}`, `DELETE /api/v1/cart/{id}`.
- **Wishlist:** `GET /api/v1/wishlist`, `POST /api/v1/wishlist`, `DELETE /api/v1/wishlist/{id}`.
- **Orders & Checkout:** `POST /api/v1/orders/{cartId}`, `POST /api/v1/orders/checkout-session/{cartId}`, `GET /api/v1/orders/user/{userId}`.
- **Addresses:** `GET /api/v1/addresses`, `POST /api/v1/addresses`, `DELETE /api/v1/addresses/{id}`.

---

## 👤 Author

Developed with ❤️ by **Salah Khaled**
- **GitHub:** [@salah-khaled-dev](https://github.com/salah-khaled-dev)
- **Project Repo:** [FreshCart-Ecommerce](https://github.com/salah-khaled-dev/FreshCart-Ecommerce)

---

## 📄 License

This project is created for educational and portfolio demonstration purposes as part of the React & Next.js Advanced Course.
