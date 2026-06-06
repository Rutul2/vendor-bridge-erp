# VendorBridge - Full Integration Guide

## Project Overview
VendorBridge is a comprehensive Procurement & Vendor Management ERP system built with:
- **Backend**: Node.js + Express + Prisma ORM + PostgreSQL
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Authentication**: JWT-based with role-based access control

## ✅ Completed Setup

### Database & Backend
✅ PostgreSQL database configured and running
✅ Prisma migrations applied (schema created)
✅ Initial seed data populated (roles, users, vendors)
✅ All 40+ API endpoints implemented and tested
✅ Backend running on http://localhost:4000

### Frontend Integration
✅ All mock data replaced with real API calls
✅ Dashboard using live analytics endpoints
✅ Approvals using real approval workflow data
✅ Quotation Comparison fetching live quotations
✅ Activity Logs using real audit trail
✅ Frontend running on http://localhost:5173

## 🚀 Running the Application

### Prerequisites
- Node.js 16+ and npm
- PostgreSQL 12+
- Git

### Start Backend
```bash
cd backend
npm install
npm run dev
# Backend runs on http://localhost:4000
```

### Start Frontend
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

### Verify Setup
1. Frontend: http://localhost:5173
2. Backend API: http://localhost:4000/api
3. Swagger Docs: http://localhost:4000/api/docs

## 📝 Default Test Credentials

### Users (Password: `password123`)
- **Admin**: admin@vendorbridge.com (ADMIN role)
- **Procurement Officer**: officer@vendorbridge.com (PROCUREMENT_OFFICER role)
- **Manager**: manager@vendorbridge.com (MANAGER role)
- **Vendor**: rajesh@infrasupplies.in (VENDOR role)

## 🧪 Testing Workflows

### 1. Authentication Flow
```
1. Go to http://localhost:5173/login
2. Login with: officer@vendorbridge.com / password123
3. Verify dashboard loads with real data
4. Check token in browser localStorage
```

### 2. Vendor Management
```
1. Navigate to Vendors menu
2. View list of existing vendors (from database)
3. Click on vendor to view details
4. Test: Create/Update/Delete vendor (if admin role)
```

### 3. RFQ Creation Flow
```
1. Click "New RFQ" from dashboard
2. Fill in RFQ details (title, description, deadline)
3. Add items with quantity and estimated price
4. Assign vendors to RFQ
5. Submit RFQ (status changes to OPEN)
```

### 4. Quotation Submission (Vendor Flow)
```
1. Login as vendor: rajesh@infrasupplies.in
2. Navigate to RFQs
3. View assigned RFQs
4. Submit quotation with pricing and delivery timeline
```

### 5. Quotation Comparison
```
1. As Procurement Officer, go to Quotations
2. View all received quotations
3. Click "Compare" to see side-by-side comparison
4. Lowest price is highlighted in green
```

### 6. Approval Workflow
```
1. Go to Approvals menu
2. View pending approvals
3. Click "Review" on any approval
4. Approve or Reject with remarks
```

### 7. Purchase Order Generation
```
1. From approved quotation, generate PO
2. Auto-generated PO number assigned
3. View PO details and status
4. Can send to vendor
```

### 8. Invoice Generation & Emailing
```
1. From PO, generate invoice
2. View invoice with all calculations
3. Download as PDF
4. Send via email (requires SMTP config)
```

### 9. Activity Logs
```
1. Go to Activity & Logs
2. See all procurement activities with timestamps
3. Filter by entity type (RFQ, Quotation, Approval, etc.)
4. View who performed what action and when
```

### 10. Analytics & Reports
```
1. Go to Reports & Analytics
2. View:
   - Vendor performance metrics
   - Monthly procurement spending trends
   - Spending breakdown by category
   - Total vendor ratings
```

## 🔌 API Endpoints Reference

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh JWT token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Complete password reset

### Vendors
- `GET /api/vendors` - List all vendors
- `GET /api/vendors/:id` - Get vendor details
- `POST /api/vendors` - Create vendor
- `PUT /api/vendors/:id` - Update vendor
- `DELETE /api/vendors/:id` - Delete vendor

### RFQs
- `GET /api/rfqs` - List RFQs
- `POST /api/rfqs` - Create RFQ
- `GET /api/rfqs/:id` - Get RFQ details
- `PUT /api/rfqs/:id` - Update RFQ
- `POST /api/rfqs/:id/vendors` - Assign vendors
- `POST /api/rfqs/:id/upload` - Upload attachment
- `GET /api/rfqs/:id/comparison` - Get quotation comparison

### Quotations
- `GET /api/quotations` - List quotations
- `POST /api/quotations` - Submit quotation
- `GET /api/quotations/:id` - Get quotation details
- `PUT /api/quotations/:id` - Update quotation

### Approvals
- `GET /api/approvals` - List pending approvals
- `POST /api/approvals/:id/approve` - Approve
- `POST /api/approvals/:id/reject` - Reject

### Purchase Orders
- `GET /api/purchase-orders` - List POs
- `POST /api/purchase-orders` - Create PO
- `GET /api/purchase-orders/:id` - Get PO details
- `PUT /api/purchase-orders/:id/status` - Update status

### Invoices
- `GET /api/invoices` - List invoices
- `POST /api/invoices` - Create invoice
- `GET /api/invoices/:id/pdf` - Download as PDF
- `POST /api/invoices/:id/email` - Email invoice
- `PUT /api/invoices/:id/status` - Update status

### Analytics
- `GET /api/analytics/dashboard` - Dashboard metrics
- `GET /api/analytics/monthly-trends` - Monthly spending trends
- `GET /api/analytics/vendors` - Vendor performance
- `GET /api/analytics/spending-summary` - Spending breakdown

### Activity & Notifications
- `GET /api/activity-logs` - Audit trail
- `GET /api/notifications` - User notifications
- `POST /api/notifications/:id/read` - Mark as read

## 🔧 Configuration

### Backend (.env)
```
DATABASE_URL=postgresql://postgres:pass@localhost:5432/vendorbridge
JWT_ACCESS_SECRET=vb-access-secret-key-2026-production
JWT_REFRESH_SECRET=vb-refresh-secret-key-2026-production
JWT_ACCESS_EXPIRY=24h
JWT_REFRESH_EXPIRY=7d
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=your_email@ethereal.email
EMAIL_PASS=your_password
EMAIL_FROM=noreply@vendorbridge.com
PORT=4000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:4000/api
```

## 📊 Database Schema Highlights

### Key Entities
- **User**: Authentication with role-based access
- **Vendor**: Vendor profiles with ratings and status
- **RFQ**: Request for Quotation with items and deadline
- **Quotation**: Vendor's response to RFQ
- **Approval**: Multi-step approval workflow
- **PurchaseOrder**: Generated from approved quotations
- **Invoice**: Generated from POs with tax calculations
- **ActivityLog**: Audit trail of all actions
- **Notification**: Real-time user notifications

### Role-Based Access Control
- **ADMIN**: Full system access, user management
- **PROCUREMENT_OFFICER**: Create RFQs, compare quotations, generate POs, invoices
- **MANAGER**: Approve/reject procurement requests
- **VENDOR**: Submit quotations, view RFQs, track POs

## 🚨 Troubleshooting

### Frontend can't connect to backend
```
1. Check backend is running: http://localhost:4000/api/docs
2. Check VITE_API_URL in frontend/.env
3. Clear browser cache and refresh
4. Check browser console for CORS errors
```

### Database connection error
```
1. Verify PostgreSQL is running
2. Check DATABASE_URL in .env
3. Run: npx prisma migrate deploy
4. Run: npm run seed
```

### Login not working
```
1. Verify seed data was created: npm run seed
2. Check token storage in browser localStorage
3. Try different user credential
4. Check authMiddleware in backend
```

### API endpoints returning 401
```
1. Verify token is being sent in Authorization header
2. Check token expiry (default 24h)
3. Try refresh-token endpoint
4. Logout and login again
```

## 📦 Deployment

### Production Checklist
- [ ] Set strong JWT secrets in .env
- [ ] Configure real SMTP for email sending
- [ ] Enable HTTPS
- [ ] Set NODE_ENV=production
- [ ] Configure CORS for production domain
- [ ] Run Prisma migrations on production database
- [ ] Seed initial admin user
- [ ] Set up environment variables on server
- [ ] Test all workflows with production data
- [ ] Set up monitoring and logging
- [ ] Configure backups for PostgreSQL

### Docker Deployment (Optional)
```bash
# Build and run with Docker
docker-compose up
```

## 📞 Support

For issues or questions:
1. Check browser console for error messages
2. Check backend logs in terminal
3. Review API response in Network tab
4. Check Swagger docs for endpoint details
5. Verify database with: `SELECT * FROM "User";`

## 🎯 Next Steps

1. ✅ All core workflows are functional
2. Test all user roles and workflows
3. Configure email (SMTP) for invoice sending
4. Set up SSL/TLS for production
5. Deploy to staging environment
6. Load test with multiple users
7. Deploy to production

---

**Last Updated**: 2026-06-06
**Status**: ✅ Fully Integrated & Tested
