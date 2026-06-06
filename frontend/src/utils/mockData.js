// src/utils/mockData.js — Centralized mock data for all modules
// Realistic Indian business data for hackathon demo

export const MOCK_VENDORS = [
  { _id: 'v1', companyName: 'Infra Supplies Pvt Ltd', category: 'Construction', gstNumber: '27AABCI5678B1Z0', contactPerson: 'Rajesh Kumar', email: 'rajesh@infrasupplies.in', phone: '+91 98765 43210', country: 'India', address: 'Plot 42, MIDC Andheri East, Mumbai 400093', status: 'Active', rating: 4.5, totalOrders: 24, createdAt: '2025-08-15' },
  { _id: 'v2', companyName: 'TechCore LTD', category: 'IT', gstNumber: '27AABCT3921B2Z0', contactPerson: 'Priya Sharma', email: 'priya@techcore.in', phone: '+91 87654 32109', country: 'India', address: '5th Floor, Cyber Tower, Hitech City, Hyderabad 500081', status: 'Active', rating: 4.2, totalOrders: 18, createdAt: '2025-09-20' },
  { _id: 'v3', companyName: 'FastShip Transport', category: 'Logistics', gstNumber: '27AABCF1942B3Z0', contactPerson: 'Amit Patel', email: 'amit@fastship.in', phone: '+91 76543 21098', country: 'India', address: '12, Industrial Estate, Naroda, Ahmedabad 382330', status: 'Blocked', rating: 3.1, totalOrders: 7, createdAt: '2025-10-05' },
  { _id: 'v4', companyName: 'GreenPack Solutions', category: 'Packaging', gstNumber: '27AABCG8871B4Z0', contactPerson: 'Sneha Reddy', email: 'sneha@greenpack.in', phone: '+91 65432 10987', country: 'India', address: '18/A, Whitefield Industrial Area, Bangalore 560066', status: 'Active', rating: 4.7, totalOrders: 31, createdAt: '2025-07-01' },
  { _id: 'v5', companyName: 'OfficeMart India', category: 'Office Supplies', gstNumber: '27AABCO5523B5Z0', contactPerson: 'Vikram Singh', email: 'vikram@officemart.in', phone: '+91 54321 09876', country: 'India', address: 'B-204, Udyog Vihar Phase IV, Gurugram 122015', status: 'Pending', rating: 0, totalOrders: 0, createdAt: '2026-05-28' },
  { _id: 'v6', companyName: 'Stellar Electronics', category: 'Electronics', gstNumber: '27AABCS7762B6Z0', contactPerson: 'Kavitha Nair', email: 'kavitha@stellar.in', phone: '+91 43210 98765', country: 'India', address: '22, Electronic City Phase 1, Bangalore 560100', status: 'Active', rating: 4.0, totalOrders: 15, createdAt: '2025-11-12' },
];

export const MOCK_RFQS = [
  { _id: 'rfq1', title: 'Office Furniture Procurement Q2', category: 'Furniture', deadline: '2026-06-15T23:59:00', status: 'Open', description: 'Ergonomic chairs and standing desks for 3rd Floor', lineItems: [{ item: 'Ergonomic Chair', quantity: 25, unit: 'NOS' }, { item: 'Standing Desks', quantity: 10, unit: 'NOS' }], assignedVendors: ['v1', 'v2', 'v4'], quotationsReceived: 3, createdBy: 'Demo Officer', createdAt: '2026-05-20' },
  { _id: 'rfq2', title: 'IT Hardware Refresh 2026', category: 'IT Hardware', deadline: '2026-06-30T23:59:00', status: 'Open', description: 'Laptops and monitors for engineering team', lineItems: [{ item: 'Laptop - i7 16GB', quantity: 15, unit: 'NOS' }, { item: 'Monitor 27" 4K', quantity: 15, unit: 'NOS' }, { item: 'Keyboard & Mouse Set', quantity: 15, unit: 'SET' }], assignedVendors: ['v2', 'v6'], quotationsReceived: 2, createdBy: 'Demo Officer', createdAt: '2026-05-25' },
  { _id: 'rfq3', title: 'Packaging Materials Q3', category: 'Raw Materials', deadline: '2026-07-10T23:59:00', status: 'Draft', description: 'Corrugated boxes and bubble wrap for warehouse', lineItems: [{ item: 'Corrugated Box (Large)', quantity: 500, unit: 'NOS' }, { item: 'Bubble Wrap Roll', quantity: 50, unit: 'ROLL' }], assignedVendors: ['v4'], quotationsReceived: 0, createdBy: 'Demo Officer', createdAt: '2026-06-01' },
  { _id: 'rfq4', title: 'Office Supplies Monthly', category: 'Office Supplies', deadline: '2026-06-20T23:59:00', status: 'Closed', description: 'Stationery, printer cartridges, and cleaning supplies', lineItems: [{ item: 'A4 Paper Ream', quantity: 100, unit: 'REAM' }, { item: 'Printer Cartridge (Black)', quantity: 20, unit: 'NOS' }], assignedVendors: ['v5'], quotationsReceived: 1, createdBy: 'Demo Officer', createdAt: '2026-05-10' },
];

export const MOCK_QUOTATIONS = [
  { _id: 'q1', rfqId: 'rfq1', rfqTitle: 'Office Furniture Procurement Q2', vendorId: 'v1', vendorName: 'Infra Supplies Pvt Ltd', items: [{ item: 'Ergonomic Chair', quantity: 25, unitPrice: 5800, total: 145000, deliveryDays: 10 }, { item: 'Standing Desks', quantity: 10, unitPrice: 8200, total: 82000, deliveryDays: 10 }], subtotal: 227000, gstPercent: 18, gstAmount: 40860, grandTotal: 267860, paymentTerms: '30 days net', deliveryDays: 10, rating: 4.5, status: 'Submitted', createdAt: '2026-05-22' },
  { _id: 'q2', rfqId: 'rfq1', rfqTitle: 'Office Furniture Procurement Q2', vendorId: 'v2', vendorName: 'TechCore LTD', items: [{ item: 'Ergonomic Chair', quantity: 25, unitPrice: 6200, total: 155000, deliveryDays: 14 }, { item: 'Standing Desks', quantity: 10, unitPrice: 9000, total: 90000, deliveryDays: 14 }], subtotal: 245000, gstPercent: 18, gstAmount: 44100, grandTotal: 289100, paymentTerms: '60 days net', deliveryDays: 14, rating: 4.2, status: 'Submitted', createdAt: '2026-05-23' },
  { _id: 'q3', rfqId: 'rfq1', rfqTitle: 'Office Furniture Procurement Q2', vendorId: 'v4', vendorName: 'GreenPack Solutions', items: [{ item: 'Ergonomic Chair', quantity: 25, unitPrice: 7100, total: 177500, deliveryDays: 7 }, { item: 'Standing Desks', quantity: 10, unitPrice: 8500, total: 85000, deliveryDays: 7 }], subtotal: 262500, gstPercent: 18, gstAmount: 47250, grandTotal: 309750, paymentTerms: '15 days', deliveryDays: 7, rating: 4.7, status: 'Submitted', createdAt: '2026-05-24' },
  { _id: 'q4', rfqId: 'rfq2', rfqTitle: 'IT Hardware Refresh 2026', vendorId: 'v2', vendorName: 'TechCore LTD', items: [{ item: 'Laptop - i7 16GB', quantity: 15, unitPrice: 72000, total: 1080000, deliveryDays: 21 }, { item: 'Monitor 27" 4K', quantity: 15, unitPrice: 28000, total: 420000, deliveryDays: 21 }, { item: 'Keyboard & Mouse Set', quantity: 15, unitPrice: 3500, total: 52500, deliveryDays: 21 }], subtotal: 1552500, gstPercent: 18, gstAmount: 279450, grandTotal: 1831950, paymentTerms: '45 days net', deliveryDays: 21, rating: 4.2, status: 'Submitted', createdAt: '2026-05-28' },
];

export const MOCK_APPROVALS = [
  { _id: 'a1', rfqId: 'rfq1', rfqTitle: 'Office Furniture Procurement Q2', vendorId: 'v1', vendorName: 'Infra Supplies Pvt Ltd', quotationId: 'q1', totalAmount: 267860, deliveryDays: 10, vendorRating: 4.5, status: 'Pending', currentStep: 3, steps: [{ label: 'Submitted', status: 'completed' }, { label: 'L1 Review', status: 'completed' }, { label: 'L2 Approval', status: 'active' }, { label: 'Generate PO', status: 'pending' }], approvalChain: [{ name: 'Rahul Mehta', role: 'Procurement Head', status: 'Approved', date: '2026-05-26T10:32:00' }, { name: 'Priya Shah', role: 'Finance Manager', status: 'Awaiting', date: '2026-05-27T00:00:00' }], createdAt: '2026-05-25' },
  { _id: 'a2', rfqId: 'rfq4', rfqTitle: 'Office Supplies Monthly', vendorId: 'v5', vendorName: 'OfficeMart India', quotationId: 'q5', totalAmount: 45000, deliveryDays: 5, vendorRating: 3.8, status: 'Approved', currentStep: 4, steps: [{ label: 'Submitted', status: 'completed' }, { label: 'L1 Review', status: 'completed' }, { label: 'L2 Approval', status: 'completed' }, { label: 'Generate PO', status: 'completed' }], approvalChain: [{ name: 'Rahul Mehta', role: 'Procurement Head', status: 'Approved', date: '2026-05-12T09:15:00' }, { name: 'Priya Shah', role: 'Finance Manager', status: 'Approved', date: '2026-05-13T14:22:00' }], createdAt: '2026-05-11' },
  { _id: 'a3', rfqId: 'rfq2', rfqTitle: 'IT Hardware Refresh 2026', vendorId: 'v2', vendorName: 'TechCore LTD', quotationId: 'q4', totalAmount: 1831950, deliveryDays: 21, vendorRating: 4.2, status: 'Pending', currentStep: 2, steps: [{ label: 'Submitted', status: 'completed' }, { label: 'L1 Review', status: 'active' }, { label: 'L2 Approval', status: 'pending' }, { label: 'Generate PO', status: 'pending' }], approvalChain: [{ name: 'Rahul Mehta', role: 'Procurement Head', status: 'Awaiting', date: '2026-06-01T00:00:00' }], createdAt: '2026-05-30' },
];

export const MOCK_PURCHASE_ORDERS = [
  { _id: 'po1', poNumber: 'PO-2026-001', rfqId: 'rfq4', vendorId: 'v5', vendorName: 'OfficeMart India', items: [{ item: 'A4 Paper Ream', quantity: 100, unitPrice: 320, total: 32000 }, { item: 'Printer Cartridge (Black)', quantity: 20, unitPrice: 650, total: 13000 }], subtotal: 45000, gstPercent: 18, gstAmount: 8100, grandTotal: 53100, status: 'Confirmed', approvalId: 'a2', createdAt: '2026-05-14', deliveryDate: '2026-05-19' },
  { _id: 'po2', poNumber: 'PO-2026-002', rfqId: 'rfq1', vendorId: 'v1', vendorName: 'Infra Supplies Pvt Ltd', items: [{ item: 'Ergonomic Chair', quantity: 25, unitPrice: 5800, total: 145000 }, { item: 'Standing Desks', quantity: 10, unitPrice: 8200, total: 82000 }], subtotal: 227000, gstPercent: 18, gstAmount: 40860, grandTotal: 267860, status: 'Draft', approvalId: 'a1', createdAt: '2026-06-02', deliveryDate: '2026-06-12' },
  { _id: 'po3', poNumber: 'PO-2026-003', rfqId: 'rfq2', vendorId: 'v6', vendorName: 'Stellar Electronics', items: [{ item: 'Laptop - i7 16GB', quantity: 5, unitPrice: 71000, total: 355000 }], subtotal: 355000, gstPercent: 18, gstAmount: 63900, grandTotal: 418900, status: 'Completed', approvalId: null, createdAt: '2026-04-20', deliveryDate: '2026-05-10' },
];

export const MOCK_INVOICES = [
  { _id: 'inv1', invoiceNumber: 'INV-2026-001', poId: 'po1', poNumber: 'PO-2026-001', vendorId: 'v5', vendorName: 'OfficeMart India', vendorGst: '27AABCO5523B5Z0', vendorAddress: 'B-204, Udyog Vihar Phase IV, Gurugram 122015', items: [{ item: 'A4 Paper Ream', quantity: 100, unitPrice: 320, total: 32000 }, { item: 'Printer Cartridge (Black)', quantity: 20, unitPrice: 650, total: 13000 }], subtotal: 45000, gstPercent: 18, gstAmount: 8100, grandTotal: 53100, status: 'Paid', issueDate: '2026-05-14', dueDate: '2026-06-13', paidDate: '2026-06-01' },
  { _id: 'inv2', invoiceNumber: 'INV-2026-002', poId: 'po3', poNumber: 'PO-2026-003', vendorId: 'v6', vendorName: 'Stellar Electronics', vendorGst: '27AABCS7762B6Z0', vendorAddress: '22, Electronic City Phase 1, Bangalore 560100', items: [{ item: 'Laptop - i7 16GB', quantity: 5, unitPrice: 71000, total: 355000 }], subtotal: 355000, gstPercent: 18, gstAmount: 63900, grandTotal: 418900, status: 'Pending', issueDate: '2026-05-12', dueDate: '2026-06-11', paidDate: null },
  { _id: 'inv3', invoiceNumber: 'INV-2026-003', poId: 'po2', poNumber: 'PO-2026-002', vendorId: 'v1', vendorName: 'Infra Supplies Pvt Ltd', vendorGst: '27AABCI5678B1Z0', vendorAddress: 'Plot 42, MIDC Andheri East, Mumbai 400093', items: [{ item: 'Ergonomic Chair', quantity: 25, unitPrice: 5800, total: 145000 }, { item: 'Standing Desks', quantity: 10, unitPrice: 8200, total: 82000 }], subtotal: 227000, gstPercent: 18, gstAmount: 40860, grandTotal: 267860, status: 'Draft', issueDate: '2026-06-04', dueDate: '2026-07-04', paidDate: null },
];

export const MOCK_ACTIVITY_LOGS = [
  { _id: 'log1', type: 'rfq', action: 'RFQ Created', description: 'Office Furniture Procurement Q2 created with 2 line items', user: 'Demo Officer', timestamp: '2026-06-05T14:30:00' },
  { _id: 'log2', type: 'quotation', action: 'Quotation Received', description: 'Infra Supplies Pvt Ltd submitted quotation for ₹2,67,860', user: 'Rajesh Kumar', timestamp: '2026-06-05T11:22:00' },
  { _id: 'log3', type: 'approval', action: 'Approval Granted', description: 'L1 Approval granted by Rahul Mehta for Office Furniture RFQ', user: 'Rahul Mehta', timestamp: '2026-06-04T16:45:00' },
  { _id: 'log4', type: 'po', action: 'PO Generated', description: 'Purchase Order PO-2026-001 generated for OfficeMart India', user: 'Demo Officer', timestamp: '2026-06-04T10:15:00' },
  { _id: 'log5', type: 'invoice', action: 'Invoice Paid', description: 'Invoice INV-2026-001 marked as paid — ₹53,100', user: 'Priya Shah', timestamp: '2026-06-03T09:30:00' },
  { _id: 'log6', type: 'vendor', action: 'Vendor Registered', description: 'OfficeMart India registered as a new vendor', user: 'Admin', timestamp: '2026-06-02T15:00:00' },
  { _id: 'log7', type: 'rfq', action: 'RFQ Closed', description: 'Office Supplies Monthly RFQ closed after vendor selection', user: 'Demo Officer', timestamp: '2026-06-01T12:00:00' },
  { _id: 'log8', type: 'approval', action: 'Approval Requested', description: 'IT Hardware Refresh 2026 sent for L1 approval', user: 'Demo Officer', timestamp: '2026-05-31T17:20:00' },
];

export const MOCK_NOTIFICATIONS = [
  { _id: 'n1', title: 'New Quotation Received', message: 'Infra Supplies submitted a quotation for Office Furniture RFQ', type: 'quotation', read: false, createdAt: '2026-06-05T11:22:00' },
  { _id: 'n2', title: 'Approval Required', message: 'Office Furniture Q2 needs your L2 approval', type: 'approval', read: false, createdAt: '2026-06-04T16:50:00' },
  { _id: 'n3', title: 'Invoice Overdue', message: 'Invoice INV-2026-002 from Stellar Electronics is past due', type: 'invoice', read: false, createdAt: '2026-06-04T09:00:00' },
  { _id: 'n4', title: 'PO Confirmed', message: 'Purchase Order PO-2026-001 has been confirmed', type: 'po', read: true, createdAt: '2026-06-03T14:00:00' },
  { _id: 'n5', title: 'Vendor Status Update', message: 'FastShip Transport has been blocked due to quality issues', type: 'vendor', read: true, createdAt: '2026-06-02T11:30:00' },
];

export const MOCK_DASHBOARD_STATS = {
  activeRfqs: 12,
  pendingApprovals: 5,
  posThisMonth: 2.3,
  monthlyInvoices: 3,
  activeRfqsTrend: +8,
  pendingApprovalsTrend: -2,
  posThisMonthTrend: +15,
  monthlyInvoicesTrend: +1,
};

export const MOCK_SPENDING_TRENDS = [
  { month: 'Jan', amount: 125000 },
  { month: 'Feb', amount: 180000 },
  { month: 'Mar', amount: 145000 },
  { month: 'Apr', amount: 290000 },
  { month: 'May', amount: 310000 },
  { month: 'Jun', amount: 267000 },
];

export const MOCK_VENDOR_PERFORMANCE = [
  { name: 'Infra Supplies', rating: 4.5, orders: 24, onTime: 92 },
  { name: 'TechCore', rating: 4.2, orders: 18, onTime: 88 },
  { name: 'GreenPack', rating: 4.7, orders: 31, onTime: 96 },
  { name: 'Stellar Elec.', rating: 4.0, orders: 15, onTime: 85 },
  { name: 'OfficeMart', rating: 3.8, orders: 8, onTime: 90 },
];

export const MOCK_SPENDING_BY_CATEGORY = [
  { name: 'IT Hardware', value: 450000, color: '#6366f1' },
  { name: 'Furniture', value: 280000, color: '#8b5cf6' },
  { name: 'Office Supplies', value: 95000, color: '#a78bfa' },
  { name: 'Logistics', value: 120000, color: '#c4b5fd' },
  { name: 'Packaging', value: 65000, color: '#818cf8' },
];

export const MOCK_MONTHLY_TRENDS = [
  { month: 'Jan', rfqs: 3, pos: 2, invoices: 2, spend: 125000 },
  { month: 'Feb', rfqs: 5, pos: 3, invoices: 3, spend: 180000 },
  { month: 'Mar', rfqs: 4, pos: 2, invoices: 2, spend: 145000 },
  { month: 'Apr', rfqs: 6, pos: 5, invoices: 4, spend: 290000 },
  { month: 'May', rfqs: 8, pos: 4, invoices: 3, spend: 310000 },
  { month: 'Jun', rfqs: 4, pos: 3, invoices: 2, spend: 267000 },
];
