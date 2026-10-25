# VogueLoop — Shared Backend & Data Integration Contract

This contract defines the unified architecture, data schemas, authentication protocol, and cross-application communication standards connecting **Application A (VogueLoop Public Website)** and **Application B (VogueLoop Rental Marketplace)**.

---

## 1. System Topology & Environments

| Application | Role | Primary Port (Dev) | Production Domain | Protocol |
| :--- | :--- | :--- | :--- | :--- |
| **Website** (`/website`) | Marketing, Storytelling, Trust, SEO, Discovery Entry | `5173` | `https://vogueloop.com` | Public Read / SSR / Static |
| **Marketplace** (`/app`) | Outfits Discovery, Reservation, Escrow, Closet Management | `5174` | `https://app.vogueloop.com` | Authenticated SPA |
| **API Gateway** (Backend) | Domain Endpoints, Auth, Escrow Ledger, Concurrency Engine | `8000` | `https://api.vogueloop.com` | REST / WebSocket / SSE |

---

## 2. Cross-Application Navigation & Deep-Linking Contract

### 2.1 Outbound from Website → Marketplace

When marketing visitors click discovery triggers on the public website, they transition to the marketplace with context preserved via query parameters:

| Intent | Source Page (Website) | Target URL (Marketplace) | Context Parameters |
| :--- | :--- | :--- | :--- |
| **Browse Outfits** | Header / Hero CTA | `/browse` | Optional: `?search=...&locality=...` |
| **Occasion Discovery** | Occasion Grid (`/` or `/how-it-works`) | `/browse?occasion={OccasionName}` | `occasion`: Pre-selects filter chip |
| **Featured Outfit Card**| Curated Grid (`/`) | `/outfits/{outfitId}` (or `/product/{id}`) | Preserves item ID for direct reservation |
| **List An Outfit** | Hero CTA / `/list-your-outfit` | `/upload` | Protected route; redirects to `/login` if unauthenticated with `state.from='/upload'` |
| **Student Sign In** | Header | `/login` | `?redirect=/dashboard` |

### 2.2 Outbound from Marketplace → Website

When transactional users in the marketplace want brand context, trust standards, or full platform policies:

| Intent | Source Element (Marketplace) | Target URL (Website) | Behavior |
| :--- | :--- | :--- | :--- |
| **Brand Logo** | App Header Emblem & Title | `https://vogueloop.com/` | Returns user to primary brand home |
| **Trust & Safety** | Detail Page FAQs / Footer | `https://vogueloop.com/trust-and-safety` | Opens student safety standards |
| **Handover Protocol**| Rental Timeline / Checkout | `https://vogueloop.com/how-it-works` | Explains campus landmark handovers |
| **Platform Policies**| Footer / Cart Escrow breakdown | `https://vogueloop.com/policies` | Outlines deposit refund terms |

---

## 3. Core Domain Schemas

### 3.1 User & Verification
```typescript
interface User {
  id: string;                      // UUID
  name: string;                    // Full student name
  email: string;                   // Institutional email (e.g., student@university.edu)
  universityId: string;            // University reference
  campusZone: string;              // e.g., 'Main Campus Hub • Within 2 km'
  isStudentVerified: boolean;      // Verified via domain email or physical college ID
  verificationBadge: 'Verified Student' | 'Campus Ambassador' | 'Faculty';
  rating: number;                  // Average peer rating (1.0 - 5.0)
  totalRentalsCompleted: number;
  totalLenderListings: number;
  createdAt: string;               // ISO 8601
}
```

### 3.2 Garment Listing (`Listing`)
```typescript
interface Listing {
  id: string | number;             // Unique outfit ID
  ownerId: string;                 // Foreign key -> User.id
  ownerName: string;
  ownerVerified: boolean;
  title: string;                   // e.g., 'Royal Blue Zari Silk Lehenga'
  description: string;
  category: 'Lehenga' | 'Saree' | 'Anarkali' | 'Sherwani' | 'Kurta' | 'Indo-Western' | 'Suit';
  occasion: 'College Fest' | 'Farewell & Graduation' | 'Festive & Ethnic Day' | 'Formals & Placements' | 'Weddings' | 'Parties & Birthdays';
  gender: 'Women' | 'Men' | 'Unisex';
  
  // Pricing model (INR)
  rental3DayPrice: number;         // Primary campus standard (e.g., 799)
  pricePerDay: number;             // Daily pro-rata rate (e.g., 266)
  securityDeposit: number;         // Escrow refundable amount (e.g., 800)
  originalPurchasePrice: number;   // Original retail value (e.g., 6500)
  
  // Condition & Measurements
  condition: 'Brand New' | 'Like New' | 'Excellent' | 'Good';
  sizes: string[];                 // e.g., ['S', 'M']
  primarySize: string;
  measurements: {
    bust?: string;
    waist?: string;
    chest?: string;
    length?: string;
    shoulder?: string;
    alterationAllowance?: string;
  };
  
  // Media & Availability
  images: string[];                // Array of CDN photo URLs
  available: boolean;
  bookedDateRanges: Array<{
    startDate: string;             // ISO Date
    endDate: string;               // ISO Date
    bookingId: string;
  }>;
  
  // Hyperlocal Location
  locality: 'University Hub' | 'Near Campus' | 'Tavarekere' | 'Koramangala';
  distanceKm: number;              // Radial distance relative to campus center
  handoverSpot: string;            // e.g., 'Main Campus Gate 1 / Student Center'
  createdAt: string;
}
```

### 3.3 Rental Booking (`RentalBooking`)
```typescript
interface RentalBooking {
  id: string;                      // Booking reference: 'VL-XXXXXX'
  listingId: string | number;      // Foreign key -> Listing.id
  renterId: string;                // Foreign key -> User.id
  lenderId: string;                // Foreign key -> User.id
  
  // Dates
  startDate: string;               // ISO Date
  endDate: string;                 // ISO Date
  durationDays: number;
  
  // Financial Breakdown
  rentalFee: number;               // INR
  platformFee: number;             // INR (0 during pilot)
  securityDeposit: number;         // INR (Refundable escrow)
  totalPaid: number;               // rentalFee + securityDeposit
  
  // Handover Logistics
  handoverSpot: string;            // Campus landmark meetup spot
  handoverChecklistSubmitted: boolean;
  handoverPhotos: {
    preRental: string[];
    postRental: string[];
  };
  
  // Lifecycle Status
  status: 'pending_lender' | 'confirmed' | 'handover_completed' | 'active_rental' | 'returned_pending_inspection' | 'completed' | 'disputed' | 'cancelled';
  depositRefundStatus: 'held_in_escrow' | 'refunded' | 'partially_deducted' | 'forfeited';
  createdAt: string;
}
```

---

## 4. Authentication & Single Sign-On (SSO) Architecture

To give students a frictionless transition between `vogueloop.com` and `app.vogueloop.com`:

1. **Cookie Configuration**:
   - Authentication tokens (`accessToken` & `refreshToken`) are issued over secure, `HttpOnly` cookies with `Domain=.vogueloop.com`, `Path=/`, `SameSite=Lax`, and `Secure=true`.
   - On localhost development, localStorage key `vogueloop_auth_session` is mirrored across ports `5173` and `5174` via postMessage or common origin proxy.
2. **Session Hydration**:
   - When a user signs in at `app/login`, the session token is set.
   - Protected routes (`/upload`, `/checkout`, `/dashboard`, `/my-rentals`) verify session state upon mount.
   - If an unauthenticated user attempts to list an outfit or checkout, the application stores `state: { from: location.pathname }` and redirects to `/login`. Upon successful sign-in, the user is forwarded back to their intended destination.

---

## 5. Booking Concurrency & Availability Locking

To prevent two students from reserving the same outfit for the same college fest weekend:

```
[Student A]                [API Gateway]                [Database / Redis Lock]
     |                           |                                  |
     |--- 1. Select Dates ------>|                                  |
     |    (Oct 24 - Oct 27)      |--- 2. Acquire Temporary Lock --->|
     |                           |       SETNX lock:listing_1:dates |
     |                           |<-- 3. Lock Granted (10 min TTL)--|
     |<-- 4. Proceed to Bag -----|                                  |
     |                           |                                  |
[Student B]                      |                                  |
     |--- 5. Select Dates ------>|                                  |
     |    (Oct 24 - Oct 27)      |--- 6. Attempt Lock Acquisition ->|
     |                           |<-- 7. Lock Denied (Key Exists) --|
     |<-- 8. Return Conflict ----|                                  |
     |    ("Dates Reserved By    |                                  |
     |      Another Student")    |                                  |
```

1. **Soft Lock (Cart Step)**: Selecting dates creates an ephemeral 10-minute lock in Redis preventing duplicate checkout attempts.
2. **Hard Reservation (Checkout Step)**: Upon confirmation of reservation, the dates are committed to `Listing.bookedDateRanges`.
3. **Cancellation Release**: If a booking is cancelled before the 48-hour cutoff, the date range is released back into the listing availability pool.

---

## 6. Escrow & Security Deposit Lifecycle

```
[Reservation Confirmed]
        │
        ▼
[Deposit Held in Escrow] (₹800 safely isolated from lender payout)
        │
        ▼
[Campus Handover Completed] (Both students verify pre-rental condition photos)
        │
        ▼
[Event & Wear Period] (Student wears outfit for fest / farewell)
        │
        ▼
[Return Meetup at Landmark] (Lender inspects zippers, seams, and fabric)
        ├── Condition Approved ──────> [100% Deposit Refunded] (Instant UPI / Card return)
        │                              [Lender Payout Released]
        └── Discrepancy Noted ───────> [VogueLoop Condition Review] (24h resolution)
```

- **Zero Handover Fees**: Handover happens in person at campus gates; zero courier shipping cuts costs and removes packaging waste.
- **Fair Protection**: Minor acceptable wrinkles or wear do not trigger deductions. Only unrepairable structural damage or lost items trigger deposit claims.
