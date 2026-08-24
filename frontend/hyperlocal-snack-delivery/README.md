# HyperLocal Snack Delivery

A full-stack MVP for a hyper-local snack delivery shop.

## Stack

- Frontend: React + Vite
- Backend: FastAPI
- ORM: SQLAlchemy 2.x Async
- Database: SQLite by default, PostgreSQL-ready
- API: REST
- Distance: Haversine formula using shop/customer coordinates

## Features

### Customer
- Browse products
- Add/remove cart items
- Checkout with name, phone, address, pincode
- Capture current GPS location
- Place order
- Track order status and ETA

### Admin
- View pending orders
- See delivery distance
- Accept order and assign ETA
- Update status:
  - Confirmed
  - Preparing
  - Out for Delivery
  - Delivered
  - Rejected

## Project Structure

```text
hyperlocal-snack-delivery/
├── backend/
├── frontend/
├── docker-compose.yml
└── README.md
```

## 1. Backend Setup

Open a terminal:

```bash
cd backend
python -m venv .venv
```

Windows:

```bash
.venv\Scripts\activate
```

Linux/macOS:

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Copy environment file:

Windows:

```bash
copy .env.example .env
```

Linux/macOS:

```bash
cp .env.example .env
```

Edit `.env` and replace the shop latitude/longitude with the real shop coordinates.

Run:

```bash
uvicorn app.main:app --reload
```

Backend:
- API: http://localhost:8000
- Swagger: http://localhost:8000/docs

The backend automatically creates tables and seeds sample snacks on first run.

## 2. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:
- http://localhost:5173

## Admin Dashboard

Open:

```text
http://localhost:5173/admin
```

## PostgreSQL

SQLite works immediately.

For PostgreSQL, run:

```bash
docker compose up -d db
```

Then update backend `.env`:

```env
DATABASE_URL=postgresql+asyncpg://snackuser:snackpassword@localhost:5432/snackshop
```

Restart FastAPI.

## Important Production Improvements

Before public production deployment, add:
- JWT authentication
- Admin authorization
- Payment gateway
- Real road-distance provider
- Redis
- Background workers
- SMS/WhatsApp/push notifications
- Alembic migrations
- Rate limiting
- HTTPS
- Object storage for product images
- Real inventory reservation/release rules
