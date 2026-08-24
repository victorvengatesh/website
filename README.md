# HyperLocal Snack Delivery

A full-stack MVP for a hyper-local snack delivery shop.

---

## 🚀 What We Have Done So Far (Completed Features)

### 💻 Frontend (React + Vite)
- **Home Page**: Interactive landing page with a loopable, autoplaying hero video background (`hero-snacks.mp4`) and featured snacks display.
- **Product List & Details**: Browsing capability for snacks by category with clean product detail pages.
- **Cart Management**: Real-time cart addition, adjustment, and checkout summary powered by React Context.
- **GPS Location Capture**: Captures the customer's exact coordinates using the browser's Geolocation API on checkout.
- **Order Checkout**: Form processing customer name, phone, address, pincode, and geographical coordinates.
- **Order Confirmation & Success**: Redirects users to a dedicated confirmation page containing their tracking ID.
- **Live Order Tracking**: Customer tracking interface displaying order status updates (Pending, Preparing, Out for Delivery, Delivered) and delivery ETAs.
- **Admin Dashboard**: Specialized control panel allowing admins to view pending orders, check straight-line delivery distance, accept/reject orders, assign custom ETAs, and update delivery statuses in real-time.
- **User Interface Utilities**: Integrated responsive toast notifications (success, error) for system actions.

### ⚙️ Backend (FastAPI + SQLAlchemy)
- **API Routing**: REST endpoints for managing products, client orders, and admin order updates.
- **ORM & Database**: Utilizes SQLAlchemy 2.x Async. Equipped to run immediately on **SQLite** for development and configured to connect to **PostgreSQL** for production.
- **Distance Calculation**: Backend calculations of the delivery distance using the **Haversine formula** (straight-line distance between the customer's GPS coordinates and the shop coordinates).
- **Auto-Seeding**: Automatic DB seeding with delicious local snacks (like Pipe Fryums, Rose Cookies, Snack Rings, and Special Mixture) on the very first start.

### 📦 Repository & Infrastructure
- **Docker Compose**: Container orchestration configured for running PostgreSQL locally.
- **Git Control**: Fully initialized repository, local config setup, and pushed to GitHub under [victorvengatesh/website](https://github.com/victorvengatesh/website).

---

## 🔮 Future Implementations & Roadmap

Before taking the application into a public production environment, we plan to implement:

### 🔒 Security & Authentication
- **User Authentication**: Register/Login endpoints with JWT verification to let customers save addresses, view order history, and manage profiles.
- **Admin RBAC**: Secure the admin dashboard (`/admin`) with login credentials and Role-Based Access Control (RBAC).

### 📍 Mapping & Geolocation Improvements
- **Real Road Distance**: Integrate the **Google Maps Distance Matrix API** or **OSRM (Open Source Routing Machine)** to calculate actual road-driving distances rather than straight-line (Haversine) estimates.
- **Live Tracking Map**: Introduce WebSockets and a Leaflet/Google Map overlay in the tracking screen so clients can watch the delivery rider move in real-time.

### 💳 Payments
- **Payment Gateway Integration**: Connect popular Indian payment aggregators (e.g., **Razorpay**, **Paytm**, or **UPI intents**) to enable online payment verification before order placement.

### 📣 Notifications
- **Multi-channel Alerts**: Set up SMS, WhatsApp (via Twilio/Wati), or Push Notifications to keep customers updated on order confirmation, rider dispatch, and delivery.

### ⚙️ Operations & Deployment
- **Alembic Database Migrations**: Track and version SQLAlchemy model changes.
- **Inventory Reservation System**: Rules to reserve inventory when checkout starts and automatically release stock if the checkout is abandoned or the order is rejected.
- **DevOps**: Setup GitHub Actions CI/CD pipelines, production-grade Dockerfiles, Nginx/Caddy configuration with SSL, and rate limiting.

---

## 🛠️ Stack Summary

- **Frontend**: React, React Router DOM, Tailwind CSS (or styled layout)
- **Backend**: FastAPI, Uvicorn
- **ORM**: SQLAlchemy (Async)
- **Database**: SQLite (default dev), PostgreSQL (prod ready)

---

## 🛠️ Quick Start Setup

### 1. Backend Setup
Open a terminal in the root directory:
```bash
cd backend
python -m venv .venv
```
- **Windows**:
  ```bash
  .venv\Scripts\activate
  ```
- **Linux/macOS**:
  ```bash
  source .venv/bin/activate
  ```

Install dependencies and start:
```bash
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload
```
*Note: Make sure to update the shop's default coordinates inside `.env`.*

### 2. Frontend Setup
Open another terminal:
```bash
cd frontend
npm install
npm run dev
```

Visit:
- Frontend: [http://localhost:5173](http://localhost:5173)
- Admin Panel: [http://localhost:5173/admin](http://localhost:5173/admin)
- API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
