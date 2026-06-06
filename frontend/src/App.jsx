// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import { useAuthStore } from "./store/authStore";

// Auth
import Login from "./features/auth/Login.jsx";
import Signup from "./features/auth/Signup.jsx";
import ForgotPassword from "./features/auth/ForgotPassword.jsx";

// Dashboard
import Dashboard from "./features/dashboard/Dashboard.jsx";

// Vendors
import VendorList from "./features/vendors/VendorList.jsx";
import VendorDetail from "./features/vendors/VendorDetail.jsx";

// RFQs
import RFQList from "./features/rfqs/RFQList.jsx";
import RFQCreate from "./features/rfqs/RFQCreate.jsx";
import RFQDetail from "./features/rfqs/RFQDetail.jsx";

// Quotations
import QuotationList from "./features/quotations/QuotationList.jsx";
import QuotationSubmit from "./features/quotations/QuotationSubmit.jsx";
import QuotationComparison from "./features/quotations/QuotationComparison.jsx";

// Approvals
import ApprovalList from "./features/approvals/ApprovalList.jsx";
import ApprovalDetail from "./features/approvals/ApprovalDetail.jsx";

// Purchase Orders
import PurchaseOrderList from "./features/purchase-orders/PurchaseOrderList.jsx";
import PurchaseOrderDetail from "./features/purchase-orders/PurchaseOrderDetail.jsx";

// Invoices
import InvoiceList from "./features/invoices/InvoiceList.jsx";
import InvoiceDetail from "./features/invoices/InvoiceDetail.jsx";

// Reports & Activity
import Reports from "./features/reports/Reports.jsx";
import ActivityLogs from "./features/activity/ActivityLogs.jsx";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />

          {/* Vendors */}
          <Route path="vendors" element={<VendorList />} />
          <Route path="vendors/:id" element={<VendorDetail />} />

          {/* RFQs */}
          <Route path="rfqs" element={<RFQList />} />
          <Route path="rfqs/create" element={<RFQCreate />} />
          <Route path="rfqs/:id" element={<RFQDetail />} />

          {/* Quotations */}
          <Route path="quotations" element={<QuotationList />} />
          <Route path="quotations/submit/:rfqId" element={<QuotationSubmit />} />
          <Route path="quotations/compare/:rfqId" element={<QuotationComparison />} />
          <Route path="quotations/:id" element={<QuotationSubmit />} />

          {/* Approvals */}
          <Route path="approvals" element={<ApprovalList />} />
          <Route path="approvals/:id" element={<ApprovalDetail />} />

          {/* Purchase Orders */}
          <Route path="purchase-orders" element={<PurchaseOrderList />} />
          <Route path="purchase-orders/:id" element={<PurchaseOrderDetail />} />

          {/* Invoices */}
          <Route path="invoices" element={<InvoiceList />} />
          <Route path="invoices/:id" element={<InvoiceDetail />} />

          {/* Reports & Activity */}
          <Route path="reports" element={<Reports />} />
          <Route path="activity" element={<ActivityLogs />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
