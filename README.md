# VendorBridge ERP

A full-stack **Enterprise Resource Planning** system for end-to-end procurement and vendor management. VendorBridge streamlines the entire procurement lifecycle — from Request for Quotation (RFQ) creation through vendor bidding, manager approvals, purchase order generation, and invoice management — with strict role-based access control throughout.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Roles & Permissions](#roles--permissions)
- [Procurement Workflow](#procurement-workflow)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Default Login Credentials](#default-login-credentials)

---

## Features

- **Role-Based Access Control (RBAC)** — Four distinct roles with strictly enforced permissions on both the frontend and backend
- **RFQ Management** — Create, assign vendors, track status from Draft to Completed
- **Vendor Quotation Submission** — Vendors submit itemized quotations with pricing, GST calculation, and delivery terms
- **Quotation Comparison** — Procurement Officers compare competing bids side-by-side and select the preferred quote
- **Approval Workflow** — Selected quotations are routed to Managers for Approve / Reject decisions with remarks
- **Purchase Order Generation** — Auto-generates POs from approved quotations with one click
- **Invoice Management** — Generate, track, and export PDF invoices linked to Purchase Orders
- **Analytics Dashboard** — Role-scoped dashboards with live counts, recent PO tables, and 6-month spending trend charts
- **Notifications** — In-app notifications for key workflow events (RFQ assignment, quotation received, approval request, etc.)
- **Activity Logs** — Full audit trail for every create, update, and delete action across all modules
- **JWT Authentication** — Access and refresh token-based authentication with secure password hashing
- **Swagger API Docs** — Interactive API documentation at `/api/docs`

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + Vite | UI framework and build tool |
| React Router v7 | Client-side routing with role-protected routes |
| Zustand | Global state management (auth store) |
| React Hook Form + Zod | Form handling and validation |
| Recharts | Spending trend bar charts |
| Axios | HTTP client with token interceptors |
| Lucide React | Icon library |
| Tailwind CSS | Utility-first styling |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| Prisma ORM | Database client and schema management |
| PostgreSQL | Relational database |
| JSON Web Tokens (JWT) | Authentication and authorization |
| bcryptjs | Password hashing |
| Joi | Request body validation |
| Multer | File upload handling |
| PDFKit | Invoice PDF generation |
| Nodemailer | Email delivery |
| Helmet + CORS | Security headers |
| Morgan | HTTP request logging |
| Swagger / OpenAPI | Auto-generated API documentation |

---

## Roles & Permissions

| Feature | Admin | Procurement Officer | Manager | Vendor |
|---|:---:|:---:|:---:|:---:|
| Manage Users | ✅ | ❌ | ❌ | ❌ |
| Manage Vendors | ✅ | ❌ | ❌ | ❌ |
| Create RFQs | ❌ | ✅ | ❌ | ❌ |
| View RFQs | ✅ | ✅ | ❌ | ✅ (assigned only) |
| Submit Quotations | ❌ | ❌ | ❌ | ✅ |
| Compare Quotations | ✅ | ✅ | ❌ | ❌ |
| Send for Approval | ❌ | ✅ | ❌ | ❌ |
| Approve / Reject | ❌ | ❌ | ✅ | ❌ |
| Generate Purchase Orders | ❌ | ✅ | ❌ | ❌ |
| Generate Invoices | ❌ | ✅ | ❌ | ❌ |
| View Purchase Orders | ✅ | ✅ | ❌ | ✅ (own only) |
| View Invoices | ✅ | ✅ | ❌ | ✅ (own only) |
| View Reports | ✅ | ✅ | ❌ | ❌ |
| View Activity Logs | ✅ | ❌ | ❌ | ❌ |

---

## Procurement Workflow

```
Procurement Officer
    │
    ├─▶ Creates RFQ (with items, deadline, selected vendors)
    │         │
    │         ▼
    │   Status: OPEN ──▶ Vendors receive notification
    │                         │
    │                         ▼
    │               Vendor submits Quotation
    │                         │
    │         ◀───────────────┘
    │   Procurement Officer compares quotations
    │   Selects preferred quote + assigns Manager
    │         │
    │         ▼
    │   Status: PENDING_APPROVAL
    │                         │
    │                         ▼
    │               Manager reviews & acts
    │                    │         │
    │               APPROVED     REJECTED
    │                    │         │
    │                    │         ▼
    │                    │   Procurement Officer
    │                    │   reviews & resubmits
    │                    │
    │                    ▼
    │   Procurement Officer generates Purchase Order
    │                    │
    │                    ▼
    │   Procurement Officer generates Invoice
    │                    │
    │                    ▼
    │           Status: COMPLETED
    └──────────────────────────────
```

---

## Project Structure

```
vendor-bridge-erp/
├── frontend/                        # React + Vite client
│   └── src/
│       ├── features/
│       │   ├── auth/                # Login, Signup, Forgot Password
│       │   ├── dashboard/           # Role-scoped analytics dashboard
│       │   ├── rfqs/                # RFQ list, create, detail
│       │   ├── quotations/          # Submit, compare quotations
│       │   ├── approvals/           # Approval list and detail
│       │   ├── purchase-orders/     # PO list and detail
│       │   ├── invoices/            # Invoice list and detail
│       │   ├── vendors/             # Vendor directory
│       │   ├── reports/             # Analytics reports
│       │   ├── activity/            # Activity log viewer
│       │   └── notifications/       # In-app notifications
│       ├── layouts/                 # DashboardLayout with role-based nav
│       ├── components/              # Shared UI components
│       ├── store/                   # Zustand auth store
│       └── utils/                   # Axios instance, helpers
│
└── backend/                         # Express REST API
    ├── prisma/
    │   ├── schema.prisma            # Full database schema
    │   └── seed.js                  # Database seed script
    └── src/
        ├── config/                  # Database, JWT, Swagger, Mailer
        ├── middleware/              # Auth, Role, Validation, Error handlers
        ├── utils/                   # Activity logger, PDF generator, email templates
        └── modules/
            ├── auth/                # Login, Signup, Refresh, Password reset
            ├── users/               # User CRUD (Admin only)
            ├── vendors/             # Vendor CRUD
            ├── rfqs/                # RFQ lifecycle + attachments
            ├── quotations/          # Quotation submission and management
            ├── approvals/           # Approval workflow
            ├── purchase-orders/     # PO generation and status
            ├── invoices/            # Invoice generation + PDF + email
            └── analytics/           # Dashboard summary, trends, spending
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL 14+
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/Rutul2/vendor-bridge-erp.git
cd vendor-bridge-erp
```

### 2. Set up the Backend

```bash
cd backend
npm install
```

Create a `.env` file (see [Environment Variables](#environment-variables)):

```bash
cp .env.example .env
# Fill in your DATABASE_URL, JWT secrets, and SMTP details
```

Run database migrations and seed:

```bash
npx prisma migrate dev --name init
npm run seed
```

Start the development server:

```bash
npm run dev
# API running at http://localhost:4000
# Swagger docs at http://localhost:4000/api/docs
```

### 3. Set up the Frontend

```bash
cd ../frontend
npm install
npm run dev
# App running at http://localhost:5173
```

---

## Environment Variables

Create `backend/.env` with the following keys:

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/vendorbridge"

# JWT
JWT_SECRET="your_access_token_secret"
JWT_REFRESH_SECRET="your_refresh_token_secret"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Server
PORT=4000

# Email (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your_email@gmail.com"
SMTP_PASS="your_app_password"
EMAIL_FROM="VendorBridge <your_email@gmail.com>"
```

---

## API Documentation

Interactive Swagger UI is available at:

```
http://localhost:4000/api/docs
```

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | Authenticate and receive tokens |
| `POST` | `/api/auth/signup` | Register a new user |
| `GET`  | `/api/rfqs` | List RFQs (scoped by role) |
| `POST` | `/api/rfqs` | Create a new RFQ |
| `POST` | `/api/quotations` | Submit a vendor quotation |
| `GET`  | `/api/rfqs/:id/compare` | Compare quotations for an RFQ |
| `POST` | `/api/approvals` | Send a quotation for manager approval |
| `POST` | `/api/approvals/:id/approve` | Manager approves a quotation |
| `POST` | `/api/approvals/:id/reject` | Manager rejects a quotation |
| `POST` | `/api/purchase-orders` | Generate a Purchase Order |
| `POST` | `/api/invoices` | Generate an Invoice |
| `GET`  | `/api/invoices/:id/pdf` | Download Invoice PDF |
| `GET`  | `/api/analytics/dashboard` | Role-scoped dashboard summary |
| `GET`  | `/api/analytics/monthly-trends` | 6-month spending trends |

---

## Default Login Credentials

After running `npm run seed`, the following accounts are available:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@vendorbridge.com` | `password123` |
| Procurement Officer | `officer@vendorbridge.com` | `password123` |
| Manager | `manager@vendorbridge.com` | `password123` |
| Vendor — Infra Supplies | `rajesh@infrasupplies.in` | `password123` |
| Vendor — TechCore Solutions | `priya@techcore.in` | `password123` |
| Vendor — Global Logix | `amit@globallogix.com` | `password123` |

> **Note:** Change all passwords before deploying to any production or shared environment.

---

## License

This project is intended for educational and demonstration purposes.
