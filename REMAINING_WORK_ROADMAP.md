# VendorBridge - Remaining Work Roadmap

## Quick Status
- ✅ **Backend**: 100% Complete - All APIs working
- ✅ **Database**: 100% Complete - PostgreSQL with all schemas
- ✅ **Services**: 100% Complete - All 12+ frontend services connected to backend
- ⚠️ **Components**: 25% Complete - 4 of 18 components updated, 14 remaining
- ❌ **Access Control**: 0% Complete - Role-based route guards needed
- ⚠️ **Polish**: 30% Complete - Loading states, error handling partial

---

## Priority 1: Update Remaining Components (Phase 4)

This is the most important - connect all UI components to real backend APIs.

### Group A: List Components (5 remaining)
These need to replace mock data with service calls:

```
1. VendorList.jsx
   Replace: MOCK_VENDORS
   With: vendorService.getAll({ page, limit, search, category, status })
   Status: ❌ Not started

2. RFQList.jsx
   Replace: MOCK_RFQS
   With: rfqService.getAll({ page, limit, status })
   Status: ❌ Not started

3. QuotationList.jsx
   Replace: MOCK_QUOTATIONS
   With: quotationService.getAll({ page, limit })
   Status: ❌ Not started

4. PurchaseOrderList.jsx
   Replace: MOCK_PURCHASE_ORDERS
   With: poService.getAll({ page, limit, status })
   Status: ❌ Not started

5. InvoiceList.jsx
   Replace: MOCK_INVOICES
   With: invoiceService.getAll({ page, limit, status })
   Status: ❌ Not started
```

### Group B: Detail Components (5 remaining)
These need to fetch individual records:

```
1. VendorDetail.jsx
   Replace: Mock lookup
   With: vendorService.getById(id)
   Status: ❌ Not started

2. RFQDetail.jsx
   Replace: Mock lookup
   With: rfqService.getById(id)
   Status: ❌ Not started

3. ApprovalDetail.jsx
   Replace: Mock data
   With: approvalService.getById(id)
   Wire: approve/reject buttons to approvalService.approve/reject
   Status: ❌ Not started

4. PurchaseOrderDetail.jsx
   Replace: Mock lookup
   With: poService.getById(id)
   Status: ❌ Not started

5. InvoiceDetail.jsx
   Replace: Mock lookup
   With: invoiceService.getById(id)
   Wire: PDF button to invoiceService.getPdf(id)
   Wire: Email button to invoiceService.sendEmail(id, data)
   Status: ❌ Not started
```

### Group C: Form Components (3 remaining)
These need to submit to API:

```
1. VendorForm.jsx
   Currently: May need field alignment with backend schema
   Schema needs: company_name, vendor_code, category, gst_number, email, phone, address
   Wire: onSubmit to vendorService.create() or vendorService.update()
   Status: ⚠️ Partial (may need field additions)

2. RFQCreate.jsx
   Replace: MOCK_VENDORS with vendorService.getAll()
   Wire: onSubmit to rfqService.create()
   Payload mapping: lineItems → items (product_name, quantity, unit, estimated_price)
   Status: ❌ Not started

3. QuotationSubmit.jsx
   Wire: Form to quotationService.create()
   Fields: rfq_id, items (product_name, quantity, unit_price), delivery_days, notes
   Status: ❌ Not started
```

### Group D: Other Pages (3 remaining)
```
1. Reports.jsx
   Replace: All MOCK_* chart data
   With: reportService.getVendorPerformance(), getSpendingSummary(), getMonthlyTrends()
   Status: ❌ Not started

2. DashboardLayout.jsx
   Already shows real user from authStore
   But: Display actual user.name and user.role
   Status: ⚠️ Partial (foundation there, needs data mapping)

3. QuotationComparison.jsx
   Status: ✅ ALREADY COMPLETE
```

---

## Priority 2: Add Role-Based Access Control (Phase 5)

This prevents unauthorized access to pages:

### Create RoleRoute Component
```jsx
// frontend/src/components/RoleRoute.jsx
Create a wrapper that checks user role before rendering
- Admin can access everything
- Officer can access: RFQs, Quotations, POs, Invoices, Vendors, Reports
- Manager can access: Approvals, Dashboard, Reports
- Vendor can access: Dashboard, My RFQs, Quotations, POs, Invoices
```

### Update App.jsx
```jsx
// Wrap protected routes with <RoleRoute>
// Example: <RoleRoute requiredRoles={['ADMIN', 'PROCUREMENT_OFFICER']}>
```

### Update DashboardLayout.jsx
```jsx
// Filter sidebar navigation based on user.role
// Hide "Users" menu for non-admins
// Show "Approvals" only for MANAGER role
// Show "My Quotations" only for VENDOR role
```

---

## Priority 3: Cleanup & Polish (Phase 6)

Make the app polished and professional:

### Remove Mock Data Imports
```
Current files still importing mockData:
- src/utils/mockData.js (still referenced by ~10 components)

To-do: Replace all with service imports
Timeline: After Phase 4 complete
```

### Add Loading & Error States
```
All components need:
1. useState(loading, setLoading)
2. useState(error, setError)
3. <LoadingSpinner /> while loading
4. Error toast/banner on failure
5. useEffect for data fetching

Example pattern:
useEffect(() => {
  setLoading(true);
  try {
    const data = await service.getAll();
    setData(data);
  } catch (err) {
    setError('Failed to load...');
  } finally {
    setLoading(false);
  }
}, []);
```

---

## Implementation Timeline

### Day 1: List Components (Priority 1A)
```
Estimated: 4-5 hours
Tasks:
1. VendorList.jsx
2. RFQList.jsx
3. QuotationList.jsx
4. PurchaseOrderList.jsx
5. InvoiceList.jsx

Each follows pattern:
- Remove MOCK import
- Add useEffect + service.getAll()
- Add loading/error states
- Map API response to table columns
- Test with real data
```

### Day 2: Detail & Form Components (Priority 1B & 1C)
```
Estimated: 6-7 hours
Tasks:
1. VendorDetail.jsx
2. VendorForm.jsx
3. RFQDetail.jsx
4. RFQCreate.jsx
5. QuotationSubmit.jsx
6. ApprovalDetail.jsx
7. InvoiceDetail.jsx

Key: Wire form submissions to services
Test: Create, read, update operations
```

### Day 3: Reports & Access Control (Priority 1D & 2)
```
Estimated: 4-5 hours
Tasks:
1. Reports.jsx - Replace mock charts
2. DashboardLayout.jsx - Display real user info
3. Create RoleRoute component
4. Add route guards in App.jsx
5. Filter navigation by role

Test: Login as different roles
Verify: Can only see appropriate pages
```

### Day 4: Polish & Testing (Priority 3)
```
Estimated: 3-4 hours
Tasks:
1. Add LoadingSpinner to all pages
2. Add error notifications
3. Remove mock data imports
4. End-to-end testing
5. Fix any bugs found

Test all workflows:
- Sign up → Login → Dashboard
- Create RFQ → Assign vendors → Compare quotations
- Approve → Generate PO → Generate invoice
```

---

## Code Template: How to Update Components

### Before (Using Mock Data)
```jsx
import { MOCK_VENDORS } from "../../utils/mockData";

export default function VendorList() {
  const [vendors] = useState(MOCK_VENDORS);
  
  return (
    <div>
      {vendors.map(v => (
        <tr key={v._id}>
          <td>{v.companyName}</td>
          ...
        </tr>
      ))}
    </div>
  );
}
```

### After (Using Real API)
```jsx
import { useState, useEffect } from "react";
import { vendorService } from "./vendorService";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function VendorList() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        const response = await vendorService.getAll();
        setVendors(response.data || []);
      } catch (err) {
        console.error("Failed to fetch vendors:", err);
        setError("Failed to load vendors");
      } finally {
        setLoading(false);
      }
    };
    
    fetchVendors();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      {vendors.map(v => (
        <tr key={v.id}>
          <td>{v.company_name}</td>
          ...
        </tr>
      ))}
    </div>
  );
}
```

### Field Name Mapping Guide
```
Mock Data → API Response
_id → id
companyName → company_name
gstNumber → gst_number
vendorName → vendor.company_name
status (string) → status (ACTIVE/INACTIVE/BLOCKED)
createdAt → created_at
totalAmount → total_amount
deliveryDays → delivery_days
poNumber → po_number (or generate from id)
```

---

## Testing Checklist After Each Component

For each component, verify:

```
✓ Component loads without errors
✓ Data fetches from API
✓ Loading spinner shows while loading
✓ Error message shows on API failure
✓ Table/list displays all items
✓ Pagination works (if applicable)
✓ Search/filter works
✓ Links to detail pages work
✓ Create/Edit buttons redirect correctly
✓ Delete works (if applicable)
✓ No console errors
✓ No memory leaks (check with React DevTools)
```

---

## Critical Files to Touch

### Frontend Components (14 files)
```
frontend/src/features/
├── vendors/
│   ├── VendorList.jsx ❌
│   ├── VendorDetail.jsx ❌
│   ├── VendorForm.jsx ⚠️
├── rfqs/
│   ├── RFQList.jsx ❌
│   ├── RFQCreate.jsx ❌
│   ├── RFQDetail.jsx ❌
├── quotations/
│   ├── QuotationList.jsx ❌
│   ├── QuotationSubmit.jsx ❌
├── approvals/
│   ├── ApprovalDetail.jsx ❌
├── purchase-orders/
│   ├── PurchaseOrderList.jsx ❌
│   ├── PurchaseOrderDetail.jsx ❌
├── invoices/
│   ├── InvoiceList.jsx ❌
│   ├── InvoiceDetail.jsx ❌
├── reports/
│   ├── Reports.jsx ❌
└── layouts/
    └── DashboardLayout.jsx ⚠️
```

### Frontend Access Control (2 files)
```
frontend/src/
├── components/
│   └── RoleRoute.jsx (NEW FILE)
└── App.jsx (MODIFY for route guards)
```

---

## Verification Commands

```bash
# Check if all services are properly connected
cd frontend
grep -r "mockData" src/features/*/

# Should show only completed components:
# - Dashboard.jsx ✓
# - ApprovalList.jsx ✓
# - QuotationComparison.jsx ✓
# - ActivityLogs.jsx ✓

# Test backend API
curl http://localhost:4000/api/vendors
curl http://localhost:4000/api/rfqs
curl http://localhost:4000/api/quotations
# All should return { success: true, data: [...] }
```

---

## Risk Areas & Mitigations

| Risk | Mitigation |
|------|-----------|
| API response structure mismatch | Review API response with Swagger docs first |
| Field name differences | Use mapping table provided above |
| Loading/error states missing | Use template code provided |
| Role enum mismatch | Use exact backend enum names (ADMIN, PROCUREMENT_OFFICER, etc.) |
| Pagination issues | Test with page and limit params |
| Token expiration | Token refresh handled by api.js interceptor |

---

## Success Criteria

✅ When complete:

1. All 18 components use real backend data
2. No console errors or warnings
3. No mock data imports in any component
4. All CRUD operations work (Create, Read, Update, Delete)
5. Role-based access control working
6. Loading spinners show while fetching
7. Error messages display on failure
8. All workflows end-to-end testable:
   - Vendor → RFQ → Quotation → Approval → PO → Invoice
9. Performance: Pages load in <2 seconds
10. Works with all 4 user roles

---

## Support Resources

- **Backend API Docs**: http://localhost:4000/api/docs (Swagger)
- **Database Schema**: backend/prisma/schema.prisma
- **Service Examples**: frontend/src/features/*/\*Service.js (already complete)
- **Completed Components**: Dashboard.jsx, ApprovalList.jsx, QuotationComparison.jsx, ActivityLogs.jsx

---

**Last Updated**: 2026-06-06
**Current Progress**: 60% Complete
**Estimated Completion**: 3-4 days with full focus
**Next Step**: Start with VendorList.jsx to establish the pattern
