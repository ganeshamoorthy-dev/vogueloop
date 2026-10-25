# VogueLoop — Public Marketing Website (`/website`)

> **Application A:** The public-facing marketing, brand storytelling, student trust, and discovery portal for VogueLoop.

---

## 1. Overview & Objectives

The **VogueLoop Website** is designed to:
1. **Introduce the campus fashion rental concept** and establish trust in peer-to-peer wardrobe sharing.
2. **Explain how the zero-inventory platform works**, outlining student handovers, deposit escrows, and return inspections.
3. **Drive seamless discovery entry points** into the transactional Marketplace application without duplicating checkout or rental bag logic.
4. **Provide search-engine friendly (SEO)**, editorial landing pages for campus occasions, sustainability, and policies.

---

## 2. Port & Environment Configuration

- **Development Port**: `http://localhost:5173` (configured in `vite.config.js` with `strictPort: true`).
- **Target Marketplace URL**: Defaults to `http://localhost:5174` (or configured via `VITE_APP_URL`).

### Environment Variables
Create a `.env` file in `/website` if pointing to custom environments:
```env
VITE_APP_URL=http://localhost:5174
```

---

## 3. Page Structure & Responsibilities

### 3.1 Home (`/`) — [`src/pages/Home.jsx`](./src/pages/Home.jsx)
- **Hero Section**:
  - Editorial headline: *"Your campus has a bigger closet than you think"*.
  - Mouse-parallax visual with interactive floating outfit card.
  - Primary CTA: **Explore Outfits** &rarr; deep-links to `${APP_URL}/browse`.
  - Secondary CTA: **List Your Outfit** &rarr; routes to `/list-your-outfit`.
  - 4 Micro-trust badges: Verified Students, Hyperlocal Handover, Refundable Deposits, Zero Inventory.
- **4 Core Marketplace Principles**:
  - Highlights *Hyperlocal*, *Peer-to-Peer*, *Affordable* (rentals from ₹599), and *Circular Fashion*.
- **Campus Occasions Directory**:
  - 8 Interactive Occasion Cards (*College Fest*, *Farewell & Graduation*, *Ethnic Days*, *Formals*, etc.).
  - Clicking an occasion opens the Marketplace with the pre-selected filter: `${APP_URL}/browse?occasion={Title}`.
- **Verified Student Closets (Curated Preview)**:
  - 4 featured student listings with 3-day pricing and refundable deposit disclosures.
  - Clicking an outfit card opens its full Marketplace detail page: `${APP_URL}/product/{id}`.
- **Two-Sided Platform Lifecycle**:
  - Interactive tab switcher between **How to Rent** and **How to List & Earn**.
- **Circular Fashion & Sustainability**:
  - Highlights the environmental and financial benefits of circulating PG wardrobes.

---

### 3.2 How It Works (`/how-it-works`) — [`src/pages/HowItWorks.jsx`](./src/pages/HowItWorks.jsx)
- **The 4-Step Rental Lifecycle**:
  1. *Discover & Reserve*: Filter by occasion, check bust/waist/length measurements, pick dates.
  2. *Deposit Escrow*: Security deposit placed in neutral escrow during rental.
  3. *Landmark Handover*: Meet at verified campus landmarks (Main Gate 1, Student Center, Library) with zero shipping delays.
  4. *Return & Payout*: Handover inspection, immediate deposit refund, and lender payout.
- **Community Standards (Mutual Responsibilities)**:
  - *Renter Responsibilities*: ID verification, condition inspection, gentle care, punctual return.
  - *Owner Responsibilities*: Accurate condition ratings, steam-sanitized packaging, prompt handover, instant sign-off.

---

### 3.3 Trust & Safety (`/trust-and-safety`) — [`src/pages/TrustAndSafety.jsx`](./src/pages/TrustAndSafety.jsx)
- **3 Core Safety Pillars**:
  - *Student ID Verification*: Restricting community access to enrolled students with `.edu` or college IDs.
  - *Escrow Security Deposits*: ₹600–₹1,000 deposits held safely in escrow to protect lenders from damage or loss.
  - *Mutual Handover Checklist*: Quick 60-second photo inspection before and after wear.
- **Feature Honesty Matrix**:
  - Clearly distinguishes active verified safeguards from planned capabilities (AI condition scanner, smart lockers, insurance pool).

---

### 3.4 List Your Outfit (`/list-your-outfit`) — [`src/pages/ListYourOutfit.jsx`](./src/pages/ListYourOutfit.jsx)
- **Lender Monetization Guide**: Turn idle event wear into recurring income with zero inventory fees.
- **3-Minute Listing Steps**: Photo capture guidelines, 3-day pricing guidance, and campus spot selection.
- **Garment Standards & Quality Requirements**:
  - Accepted categories: Festive wear, blazers & suits, evening gowns.
  - Condition standards: Freshly dry-cleaned or steam-sanitized, intact zippers, accurate sizing.
- **Direct Marketplace Action**: CTA button opening `${APP_URL}/upload`. If unauthenticated, the user is prompted to sign in and seamlessly redirected back to the listing form.

---

### 3.5 Campus Governance & Policies (`/policies`) — [`src/pages/Policies.jsx`](./src/pages/Policies.jsx)
- **6 Platform Governance Sections**:
  1. *Zero-Inventory Marketplace Model* (Facilitator status; student-owned garments).
  2. *Refundable Security Deposit Policy* (Escrow terms, deductions criteria, instant returns).
  3. *Hyperlocal Campus Handover Protocol* (Public campus spots, zero shipping fees).
  4. *Joint Condition Checklist & Care Standards* (No permanent alterations).
  5. *Student Identity Verification Rules*.
  6. *Dispute Resolution & Fair Protection* (24-hour reporting window, photo evidence review).

---

## 4. Components & Layout

- **`MarketingNavbar.jsx`** ([`src/components/MarketingNavbar.jsx`](./src/components/MarketingNavbar.jsx)):
  - Brand emblem linking to `/`.
  - Clean marketing links (*How It Works*, *Explore Outfits*, *Trust & Safety*, *List Your Outfit*).
  - Theme toggle (Midnight Dark & Light Ivory).
  - Direct CTA buttons: *Sign In* and *Browse Outfits*.
  - Mobile responsive hamburger menu drawer.
- **`Footer.jsx`** ([`src/components/Footer.jsx`](./src/components/Footer.jsx)):
  - Student trust indicator, brand mission, and links to all public and policy pages.
- **`ClothingCard.jsx`** ([`src/components/ClothingCard.jsx`](./src/components/ClothingCard.jsx)):
  - Hyperlinked with `getAppUrl('/product/' + item.id)` to route directly into the marketplace.
- **`OccasionCard.jsx`** ([`src/components/OccasionCard.jsx`](./src/components/OccasionCard.jsx)):
  - Hyperlinked with `getAppUrl('/browse?occasion=' + title)`.
- **`TrustLayer.jsx`** ([`src/components/TrustLayer.jsx`](./src/components/TrustLayer.jsx)):
  - Reusable trust banner highlighting security deposits, ID checks, and zero-inventory benefits.

---

## 5. Scripts & Commands

Run commands from inside the `/website` directory:

```bash
# Run local development server (Port 5173)
npm run dev

# Run production build
npm run build

# Preview production build locally
npm run preview
```
