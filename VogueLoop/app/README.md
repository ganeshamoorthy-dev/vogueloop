# VogueLoop — Rental Marketplace Application (`/app`)

> **Application B:** The transactional, functional outfit rental web application for VogueLoop.

---

## 1. Overview & Objectives

The **VogueLoop Marketplace** is the operational core of the platform, built to:
1. **Enable frictionless outfit discovery** with campus locality filters, occasion categories, size pickers, and live price sorting.
2. **Execute transparent reservations** with accurate 3-day rental dates and calculated refundable security deposits.
3. **Manage the P2P rental lifecycle** through rental bags, checkout confirmations, handover checklists, and real-time status timelines.
4. **Empower student lenders** to publish closet listings, review incoming borrow requests, and track earnings.

---

## 2. Port & Environment Configuration

- **Development Port**: `http://localhost:5174` (configured in `vite.config.js` with `strictPort: true`).
- **Target Website URL**: Defaults to `http://localhost:5173` (or configured via `VITE_WEBSITE_URL`).

### Environment Variables
Create a `.env` file in `/app` if pointing to custom environments:
```env
VITE_WEBSITE_URL=http://localhost:5173
```

---

## 3. Route Map & Page Responsibilities

| Route | Alias / Redirect | Component | Purpose |
| :--- | :--- | :--- | :--- |
| `/browse` | `/` &rarr; `/browse` | [`Browse.jsx`](./src/pages/Browse.jsx) | Search, category chips, campus zone selector, filter drawer, and outfit grid. |
| `/outfits/:id` | `/product/:id` | [`ProductDetail.jsx`](./src/pages/ProductDetail.jsx) | Outfit gallery, measurements, size picker, 3-day date picker, and escrow deposit breakdown. |
| `/wishlist` | &rarr; `/dashboard?tab=wishlist` | [`Dashboard.jsx`](./src/pages/Dashboard.jsx) | Displays student's saved outfits with quick rental CTAs. |
| `/rental-bag` | `/cart` | [`Cart.jsx`](./src/pages/Cart.jsx) | Breakdown of rental fees, ₹0 campus handover coordination, and refundable security deposits. |
| `/checkout` | — | [`Checkout.jsx`](./src/pages/Checkout.jsx) | Campus landmark meeting point selection, escrow acknowledgment, and reservation confirmation. |
| `/my-rentals` | `/dashboard` | [`Dashboard.jsx`](./src/pages/Dashboard.jsx) | Active rentals, rental lifecycle timeline, lender borrow requests, and earnings breakdown. |
| `/upload` | `/list-garment` | [`UploadListing.jsx`](./src/pages/UploadListing.jsx) | 4-step wizard to upload photos, specify measurements, and set 3-day rental price + deposit. |
| `/login` | — | [`Login.jsx`](./src/pages/Login.jsx) | Student portal sign-in; automatically preserves `state.from` destination for seamless listing/checkout. |
| `/signup` | — | [`Signup.jsx`](./src/pages/Signup.jsx) | Student registration portal. |

---

## 4. State Management & Context Engine

The application manages data and workflow through 4 modular React Contexts:

### 4.1 `AuthContext.jsx` ([`src/context/AuthContext.jsx`](./src/context/AuthContext.jsx))
- Tracks current `user`, `isAuthenticated` flag, and authentication tokens.
- Persists user sessions in `localStorage` under `vogueloop_user`.
- Automatically protects `/upload`, `/checkout`, and `/dashboard`.

### 4.2 `ListingsContext.jsx` ([`src/context/ListingsContext.jsx`](./src/context/ListingsContext.jsx))
- Holds active campus listings with realistic mock data (lehengas, sherwanis, sarees, anarkalis).
- Provides search and filtering functions:
  - `searchQuery` (matches titles, categories, occasions, descriptions, and localities).
  - `selectedCategory` (*Lehenga*, *Saree*, *Sherwani*, *Indo-Western*, *Kurta*, *Anarkali*, *Suit*).
  - `selectedOccasion` (*College Fest*, *Farewell*, *Ethnic Day*, *Formals*, *Weddings*, *Parties*).
  - `selectedLocality` (*Within 1 km*, *Within 2 km*, *University Hub*, *Near Campus*, *Tavarekere*, *Koramangala*).
- Manages student wishlist array (`localStorage` key: `vogueloop_wishlist`).
- Provides `addListing`, `updateListing`, and `deleteListing` for student hosts.

### 4.3 `CartContext.jsx` ([`src/context/CartContext.jsx`](./src/context/CartContext.jsx))
- Manages rental bag items (`cartItems`), quantities, and dates.
- Calculates pricing using campus standard rules:
  - Minimum 3-day rental bundle price (`rental3DayPrice`).
  - Prorated daily rates for additional days (`days > 3 ? rental3DayPrice + (days - 3) * pricePerDay : rental3DayPrice`).
  - Aggregates 100% refundable security deposits (`totalDeposits`).
- Exposes `addToCart`, `removeFromCart`, `clearCart`, and `getCartTotal`.

### 4.4 `ThemeContext.jsx` ([`src/context/ThemeContext.jsx`](./src/context/ThemeContext.jsx))
- Powers the **Midnight Wine Luxury** design engine.
- Toggles between Dark theme (`#0D1117`) and Light Ivory theme (`#FAF8F5`).
- Persists theme preferences in `localStorage` under `vogueloop_theme`.

---

## 5. Key Functional Components

- **`AppHeader.jsx`** ([`src/components/AppHeader.jsx`](./src/components/AppHeader.jsx)):
  - **Brand Emblem & Title**: Clicking the logo navigates back to the Website home (`http://localhost:5173/`).
  - **Campus Proximity Zone Selector**: Dropdown selector (*Main Campus Hub*, *North Gate*, *Library Plaza*, *Hostel Quad*).
  - **High-Utility Search Bar**: Immediate filter update with clear trigger.
  - **Saved Wishlist Badge**: Real-time counter of saved items.
  - **Rental Bag Badge**: Real-time item counter linking to `/rental-bag`.
  - **Student Profile Pill**: Displays verified student avatar and first name when authenticated.
- **`DateRangePicker.jsx`** ([`src/components/DateRangePicker.jsx`](./src/components/DateRangePicker.jsx)):
  - 3-day quick presets (*This Weekend*, *Next Weekend*, *Custom Range*).
  - Validates minimum durations and prevents past-date selection.
- **`RentalTimeline.jsx`** ([`src/components/RentalTimeline.jsx`](./src/components/RentalTimeline.jsx)):
  - 5-step interactive status tracker: *Booking Confirmed* &rarr; *Handover Scheduled* &rarr; *Garment With Renter* &rarr; *Return Meetup* &rarr; *Deposit Refunded*.
- **`ClothingCard.jsx`** ([`src/components/ClothingCard.jsx`](./src/components/ClothingCard.jsx)):
  - Responsive product card featuring image fallback, size badge, occasion pill, locality distance, 3-day price, and refundable deposit note.
- **`ImageUpload.jsx`** ([`src/components/ImageUpload.jsx`](./src/components/ImageUpload.jsx)):
  - Multi-image drop and preview zone for garment listings.

---

## 6. Financial & Escrow Calculations

Every rental transaction clearly distinguishes the non-refundable rental fee from the refundable deposit:

$$\text{Total Due at Handover} = \text{Rental Fee} + \text{Refundable Security Deposit} + \text{Campus Coordination (₹0)}$$

- **Rental Fee**: Transferred to the student lender once the rental is completed.
- **Campus Handover Fee**: ₹0 (student-to-student meetup at campus landmarks; no shipping fees).
- **Security Deposit**: 100% held in safe escrow and released back to the renter's account upon post-rental inspection.

---

## 7. Scripts & Commands

Run commands from inside the `/app` directory:

```bash
# Run local development server (Port 5174)
npm run dev

# Run production build
npm run build

# Preview production build locally
npm run preview
```
