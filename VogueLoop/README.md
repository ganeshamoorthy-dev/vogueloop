# VogueLoop — Campus Fashion Rental Ecosystem

> **A zero-inventory, hyperlocal peer-to-peer fashion rental marketplace for verified university campus communities.**

VogueLoop enables students to rent occasion wear (ethnic fests, farewells, graduation, placement formals, and parties) from peers nearby or list idle garments in their closets to generate recurring passive income.

---

## 1. Dual-Application Architecture

VogueLoop is structured as **two separate, independent React applications** sharing a unified design system and domain contract:

```
                                  VOGUELOOP ECOSYSTEM
                                           │
                 ┌─────────────────────────┴─────────────────────────┐
                 ▼                                                   ▼
       APPLICATION A: WEBSITE                             APPLICATION B: MARKETPLACE
       Directory:  /website                               Directory:  /app
       Dev Port:   http://localhost:5173                  Dev Port:   http://localhost:5174
       Role:       Public Marketing & Storytelling        Role:       Transactional Web App
       Audience:   Visitors, Prospective Students, SEO    Audience:   Active Student Renters & Hosts
```

| Application | Path | Default Port | Primary Responsibilities |
| :--- | :--- | :--- | :--- |
| **VogueLoop Website** | [`/website`](./website) | `5173` | Brand storytelling, concept trust, how it works, student safety standards, occasion entry points, platform policies. |
| **VogueLoop Marketplace** | [`/app`](./app) | `5174` | Garment discovery, outfit detail specs, 3-day rental date picker, refundable escrow deposits, rental bag, checkout, student dashboard, and garment listing wizard. |

---

## 2. Quick Start

### Prerequisites
- **Node.js**: v18+ (tested on Node v24.19.0)
- **npm**: v9+ (tested on npm 11.6.1)

### Installation
Install dependencies for both projects:
```bash
# Install website dependencies
cd website && npm install && cd ..

# Install marketplace app dependencies
cd app && npm install && cd ..
```

### Running Locally

You can launch both applications simultaneously in separate terminals:

```bash
# Terminal 1: Start the Public Marketing Website (Port 5173)
npm run dev:website

# Terminal 2: Start the Rental Marketplace Application (Port 5174)
npm run dev:app
```

Once running:
- **Public Website**: Open [http://localhost:5173](http://localhost:5173)
- **Rental Marketplace**: Open [http://localhost:5174](http://localhost:5174)

---

## 3. Production Build Verification

Both applications can be compiled independently or together from the root:

```bash
# Build both projects consecutively
npm run build:all

# Or build individually
npm run build:website    # Outputs to /website/dist
npm run build:app        # Outputs to /app/dist
```

---

## 4. Repository Structure

```
VogueLoop/
├── website/                         # APPLICATION A: Marketing Website (Port 5173)
│   ├── src/
│   │   ├── components/              # MarketingNavbar, Footer, ClothingCard, OccasionCard, TrustLayer
│   │   ├── context/                 # ListingsContext (read-only mock), ThemeContext
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Hero, 4 principles, occasions, featured items, lifecycle tabs
│   │   │   ├── HowItWorks.jsx       # 4-step rental lifecycle & community standards
│   │   │   ├── TrustAndSafety.jsx   # Student verification, escrow deposits & feature matrix
│   │   │   ├── ListYourOutfit.jsx   # Lender onboarding guide & garment eligibility
│   │   │   └── Policies.jsx         # Governance, deposit rules, handover spots, disputes
│   │   ├── utils/                   # config.js (APP_URL linking), imageFallback.js
│   │   ├── App.jsx                  # Marketing router configuration
│   │   ├── index.css                # Midnight Wine luxury design tokens
│   │   └── main.jsx
│   ├── package.json                 # Independent dependencies
│   ├── vite.config.js               # Port 5173 with strictPort: true
│   └── README.md                    # Detailed Website documentation
│
├── app/                             # APPLICATION B: Transactional Marketplace (Port 5174)
│   ├── src/
│   │   ├── components/              # AppHeader, DateRangePicker, RentalTimeline, ClothingCard, ImageUpload
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Student authentication & session persistence
│   │   │   ├── ListingsContext.jsx  # P2P listings, wishlist, search & filter engine
│   │   │   ├── CartContext.jsx      # Rental bag calculation & escrow deposit tracking
│   │   │   └── ThemeContext.jsx     # Dark (Midnight Wine) & Light theme switching
│   │   ├── pages/
│   │   │   ├── Browse.jsx           # Outfit grid, category chips, filter tray, sorting
│   │   │   ├── ProductDetail.jsx    # Garment specs, calendar picker, escrow deposit, reserve CTA
│   │   │   ├── Cart.jsx             # Rental bag breakdown (fees + refundable deposits)
│   │   │   ├── Checkout.jsx         # Landmark meeting point selection & order confirmation
│   │   │   ├── Dashboard.jsx        # My Rentals, Lender borrow requests, closet earnings
│   │   │   ├── UploadListing.jsx    # 4-step garment upload wizard (auth-protected)
│   │   │   ├── Login.jsx            # Student portal authentication with destination return
│   │   │   └── Signup.jsx           # Student registration
│   │   ├── utils/                   # config.js (WEBSITE_URL linking), imageFallback.js
│   │   ├── App.jsx                  # Marketplace router with primary & alias routes
│   │   ├── index.css                # Midnight Wine luxury design tokens
│   │   └── main.jsx
│   ├── package.json                 # Independent dependencies
│   ├── vite.config.js               # Port 5174 with strictPort: true
│   └── README.md                    # Detailed Marketplace documentation
│
├── BACKEND_INTEGRATION_CONTRACT.md  # Comprehensive API, Auth, Schema & Concurrency specification
├── package.json                     # Root orchestrator scripts
└── README.md                        # Master repository documentation
```

---

## 5. Cross-Application Communication & Environment Configuration

The two applications communicate via URL contracts backed by Vite environment variables:

### Environment Variables
Both applications read their companion URL dynamically from `.env`:

| Application | Environment Variable | Default (Local Dev) | Production Example |
| :--- | :--- | :--- | :--- |
| **Website** (`/website`) | `VITE_APP_URL` | `http://localhost:5174` | `https://app.vogueloop.com` |
| **Marketplace** (`/app`) | `VITE_WEBSITE_URL` | `http://localhost:5173` | `https://vogueloop.com` |

### From Website &rarr; Marketplace
- **Explore Outfits**: Opens `http://localhost:5174/browse`.
- **Occasion Direct Filter**: Clicking an occasion tile opens `http://localhost:5174/browse?occasion={OccasionName}`.
- **Featured Outfit Card**: Clicking an outfit card deep-links to `http://localhost:5174/product/{id}`.
- **List Your Outfit CTA**: Directs to `http://localhost:5174/upload` (if unauthenticated, forwards to `/login` preserving destination).
- **Student Sign In**: Opens `http://localhost:5174/login`.

### From Marketplace &rarr; Website
- **Brand Logo Emblem & Title**: Clicking the logo in the Marketplace header returns the user to the brand home at `http://localhost:5173/`.
- **Trust & Policies Links**: Product detail FAQS and footer link to `http://localhost:5173/policies` and `http://localhost:5173/trust-and-safety`.

---

## 6. Design System Tokens (Midnight Wine Luxury)

Both applications share consistent visual branding and semantic tokens:

```css
:root {
  /* Midnight Dark Theme (Default) */
  --bg-primary: #0D1117;          /* Midnight Environment */
  --bg-surface: #141A22;          /* Elevated Surface */
  --bg-elevated: #1B222C;         /* Card Surface */
  --border: #303A46;              /* Subtle Card Border */

  --brand-primary: #1E3A5F;       /* Deep Navy — Trust, Navigation & Primary Actions */
  --brand-fashion: #7A263A;       /* Burgundy — Emotional Fashion Accents & Discovery */
  --brand-wine: #5A1628;          /* Wine — Ambient Gradients & Atmosphere */
  --accent-gold: #C9A96E;         /* Champagne Gold — Emblems, Ratings & Highlights */
  --status-success: #6F9A7C;      /* Sage Green — Student Verification & Availability */

  --font-serif: 'Cormorant Garamond', Georgia, serif;
  --font-sans: 'Inter', -apple-system, sans-serif;
}
```

---

## 7. Documentation Index

- **[Website Documentation](./website/README.md)**: Marketing pages, SEO architecture, brand layout, and components.
- **[Marketplace Documentation](./app/README.md)**: Search filters, escrow deposits, rental bag, checkout, and state management.
- **[Backend Integration Contract](./BACKEND_INTEGRATION_CONTRACT.md)**: API schemas, authentication tokens, Redis date concurrency locks, and deposit lifecycles.
