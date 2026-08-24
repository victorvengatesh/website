# Namma Bites

A premium, animation-rich ecommerce experience for a hyperlocal South Indian snack shop. It combines an Amazon-style commerce model—catalog search, filters, product detail, cart, checkout, wishlist, accounts, reviews and order tracking—with a warmer editorial design, interactive 3D, and fast local delivery operations.

The customer storefront is built with Next.js, React, TypeScript, Tailwind CSS, Framer Motion, GSAP and React Three Fiber. The existing FastAPI, SQLAlchemy and PostgreSQL-ready backend continues to own inventory, pricing, distance validation and order state transitions.

## What is included

- Cinematic homepage with a lazy-loaded procedural 3D snack sculpture, GSAP scroll storytelling, category tilt cards, deals countdown, product shelves, FAQ and animated newsletter state.
- Thirty realistic products across six balanced categories: savouries, chips, sweets, millet, bakery and gifting.
- Catalog filters for category, price, rating, availability and deals; six sort options; animated grid/list layouts; skeleton loading; and incremental loading.
- Product pages with a touch-friendly 3D viewer, low-power/reduced-motion image fallback, zoom inspection, variants, sticky buy box, review histogram, Q&A, bundles and recently viewed items.
- Debounced autocomplete search with highlighted matches, trending suggestions and animated empty states.
- Persistent Zustand cart, cart drawer, fly-to-cart motion, wishlist, saved-for-later, shipping progress and animated totals.
- Four-step checkout: Address → Delivery → Payment → Review. It includes inline validation, browser geolocation, payment-provider boundaries and an animated confirmation page.
- Account UI for sign-in, registration, orders, status timelines, wishlist, addresses and profile preferences.
- Order tracking and store operations dashboard connected to the FastAPI contract, with safe preview data when an API is not configured.
- Dark mode, semantic markup, keyboard navigation, focus states, reduced-motion support, metadata, Open Graph, Product structured data, sitemap, robots policy and security headers.
- Automated frontend checks and backend tests in GitHub Actions.

## Project structure

```text
website/
├── .github/workflows/ci.yml
├── backend/
│   ├── app/
│   │   ├── api/v1/          # Products, orders and store operations routes
│   │   ├── core/            # Environment-backed configuration
│   │   ├── db/              # Async SQLAlchemy session and base
│   │   ├── models/          # Product, user and order models
│   │   ├── schemas/         # Pydantic request/response contracts
│   │   └── services/        # Inventory, distance, pricing and seeding
│   ├── tests/
│   └── requirements*.txt
├── frontend/
│   ├── public/
│   │   ├── images/          # Product photography and category artwork
│   │   └── videos/          # Optimised brand-story video
│   ├── src/
│   │   ├── app/             # Next.js App Router pages and metadata
│   │   ├── components/      # Layout, commerce, UI and 3D primitives
│   │   ├── config/theme.ts  # Brand copy and commerce settings
│   │   ├── data/products.ts # Thirty-product mock catalog
│   │   ├── features/        # Catalog, product, cart, checkout and account flows
│   │   ├── services/        # Swappable catalog, order and payment adapters
│   │   ├── store/           # Persistent Zustand state
│   │   └── types/           # Shared TypeScript contracts
│   └── package.json
└── docker-compose.yml       # Optional local PostgreSQL
```

## Quick start

Requirements: Node.js 20.9 or newer and Python 3.11 or newer.

### 1. Start the FastAPI backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env              # Windows: copy .env.example .env
uvicorn app.main:app --reload
```

The API runs at `http://localhost:8000`; interactive documentation is at `http://localhost:8000/docs`.

SQLite is the default. To use PostgreSQL, start the root `docker-compose.yml` and replace `DATABASE_URL` in `backend/.env` with the corresponding async PostgreSQL URL.

### 2. Start the Next.js storefront

```bash
cd frontend
npm install
cp .env.example .env.local        # Windows: copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. The operations dashboard is at `/admin`, tracking is at `/track`, and `NB-DEMO142` can be used as a tracking preview.

## Theme, logo and catalog changes

The visual system is intentionally centralised:

1. Change brand name, strapline, support details, currency and font labels in `frontend/src/config/theme.ts`.
2. Change all light/dark colors, radii, shadows and gradients in the `:root` and `.dark` sections of `frontend/src/app/globals.css`.
3. Replace the inline mark in `frontend/src/components/layout/logo.tsx`, and update `frontend/src/app/icon.svg`.
4. Replace catalog records in `frontend/src/data/products.ts`. Keep `sku` values aligned with `backend/app/services/seed_service.py` when real checkout is enabled.
5. Replace category artwork in `frontend/public/images/categories/` and product media in `frontend/public/images/`.

No page-level color constants are required for a normal rebrand; shared Tailwind tokens resolve to CSS variables.

## Connecting real data

`frontend/src/services/catalog.ts` is the catalog boundary. It currently returns typed mock data and can be replaced with REST or GraphQL calls without changing the page components.

The checkout order adapter in `frontend/src/services/orders.ts` already targets the FastAPI order endpoint. Products are submitted by stable SKU, so it works with both fresh and previously seeded databases.

Set the frontend environment values:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_DEMO_CHECKOUT=false
```

The backend recalculates prices, validates stock, locks selected product rows, calculates the delivery distance, rejects out-of-radius orders and creates an order in `pending_confirmation`. The store then accepts it with an ETA and advances it through preparation, delivery and completion.

## Connecting Stripe or another payment provider

Checkout is intentionally UI-only. Never put a Stripe secret key in a `NEXT_PUBLIC_*` variable.

1. Create a server-only Next.js route handler or FastAPI endpoint that creates a PaymentIntent.
2. Implement `paymentService.createSession()` in `frontend/src/services/payments.ts` against that server route.
3. Render Stripe Elements (or the chosen provider SDK) in the Payment step.
4. Verify provider webhooks on the server and store payment status against the order.
5. Set `NEXT_PUBLIC_DEMO_CHECKOUT=false` only after real order and payment paths are tested.

The existing disabled card fields are visual placeholders and cannot collect a real payment.

## 3D assets

The current hero and product viewer use lightweight procedural geometry, so no external model download blocks first paint. They are dynamically imported, rendered with capped device pixel ratio and replaced by optimised images on reduced-motion or lower-powered devices.

To add a real product model:

1. Export a Draco-compressed `.glb` and place it under `frontend/public/models/`.
2. Add its path to the product's `modelUrl`.
3. Replace the procedural geometry branch in `frontend/src/components/three/product-scene.tsx` with Drei's `useGLTF` loader and preload only the most important models.
4. Keep the current gallery as the failure and accessibility fallback.

## Quality checks

```bash
cd frontend
npm run check

cd ../backend
pip install -r requirements-dev.txt
PYTHONPATH=. pytest -q
python -m compileall -q app
```

`npm run check` runs ESLint, TypeScript, catalog tests and a full optimised Next.js build. The repository workflow repeats these checks for every pull request and push to `main`.

## Production checklist

Before accepting public traffic:

- Replace the example domain, phone, email, shop coordinates and legal copy.
- Connect real authentication. Protect `/admin` in both the UI and FastAPI with server-enforced admin RBAC; hiding a route or using `robots.txt` is not security.
- Connect and verify payments server-side, including webhook signatures, refunds and idempotency.
- Add database migrations (Alembic), managed PostgreSQL, backups and inventory reconciliation.
- Put the API behind HTTPS, rate limiting, structured logs and monitoring.
- Add real allergen statements, product labels, tax rules, cancellation/refund terms and business-specific privacy terms.
- Test actual devices at 360, 768, 1024 and 1440+ widths and run Lighthouse against the final hosting environment.

The repository is production-quality as a storefront and integration-ready application, but the deliberately mocked authentication and payment providers must be connected before it is treated as a live transactional business.
