import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import prisma from '../src/config/database.js';

dotenv.config();

const ago = (months, days = 1) => {
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  d.setDate(days);
  return d;
};

const main = async () => {
  console.log('🌱 Seeding database...');

  // ─── 1. Roles ────────────────────────────────────────────────────────────
  for (const name of ['ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER', 'VENDOR']) {
    await prisma.role.upsert({ where: { name }, update: {}, create: { name } });
  }
  const adminRole   = await prisma.role.findUnique({ where: { name: 'ADMIN' } });
  const officerRole = await prisma.role.findUnique({ where: { name: 'PROCUREMENT_OFFICER' } });
  const managerRole = await prisma.role.findUnique({ where: { name: 'MANAGER' } });
  const vendorRole  = await prisma.role.findUnique({ where: { name: 'VENDOR' } });
  console.log('✅ Roles seeded');

  // ─── 2. Users ─────────────────────────────────────────────────────────────
  const hash = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@vendorbridge.com' },
    update: {},
    create: { name: 'Arjun Sharma', email: 'admin@vendorbridge.com', password_hash: hash, role_id: adminRole.id },
  });
  const officer = await prisma.user.upsert({
    where: { email: 'officer@vendorbridge.com' },
    update: {},
    create: { name: 'Priya Menon', email: 'officer@vendorbridge.com', password_hash: hash, role_id: officerRole.id },
  });
  const manager = await prisma.user.upsert({
    where: { email: 'manager@vendorbridge.com' },
    update: {},
    create: { name: 'Rahul Verma', email: 'manager@vendorbridge.com', password_hash: hash, role_id: managerRole.id },
  });
  const vendorUser1 = await prisma.user.upsert({
    where: { email: 'rajesh@infrasupplies.in' },
    update: {},
    create: { name: 'Rajesh Kumar', email: 'rajesh@infrasupplies.in', password_hash: hash, role_id: vendorRole.id },
  });
  const vendorUser2 = await prisma.user.upsert({
    where: { email: 'priya@techcore.in' },
    update: {},
    create: { name: 'Priya Nair', email: 'priya@techcore.in', password_hash: hash, role_id: vendorRole.id },
  });
  const vendorUser3 = await prisma.user.upsert({
    where: { email: 'amit@globallogix.com' },
    update: {},
    create: { name: 'Amit Desai', email: 'amit@globallogix.com', password_hash: hash, role_id: vendorRole.id },
  });
  console.log('✅ Users seeded');

  // ─── 3. Vendors ───────────────────────────────────────────────────────────
  const vendor1 = await prisma.vendor.upsert({
    where: { vendor_code: 'V001' },
    update: {},
    create: { company_name: 'Infra Supplies Pvt Ltd', vendor_code: 'V001', category: 'Construction', gst_number: '27AABCI5678B1Z0', email: 'rajesh@infrasupplies.in', phone: '+91 98765 43210', address: 'Plot 42, MIDC Andheri East, Mumbai 400093', rating: 4.5 },
  });
  const vendor2 = await prisma.vendor.upsert({
    where: { vendor_code: 'V002' },
    update: {},
    create: { company_name: 'TechCore Solutions Ltd', vendor_code: 'V002', category: 'IT Equipment', gst_number: '27AABCT3921B2Z0', email: 'priya@techcore.in', phone: '+91 87654 32109', address: '5th Floor, Cyber Tower, Hitech City, Hyderabad', rating: 4.2 },
  });
  const vendor3 = await prisma.vendor.upsert({
    where: { vendor_code: 'V003' },
    update: {},
    create: { company_name: 'Global Logix Corp', vendor_code: 'V003', category: 'Logistics', gst_number: '27AABCG1245B3Z0', email: 'amit@globallogix.com', phone: '+91 76543 21098', address: 'Tower B, DLF Cyber City, Gurgaon', rating: 3.9 },
  });
  console.log('✅ Vendors seeded');

  // ─── 4. RFQs ─────────────────────────────────────────────────────────────
  const rfq1 = await prisma.rfq.upsert({
    where: { id: 'rfq-seed-001-0000-0000-000000000001' },
    update: {},
    create: {
      id: 'rfq-seed-001-0000-0000-000000000001',
      title: 'Office Furniture Procurement Q3 2026',
      description: 'Ergonomic chairs, standing desks, and storage units for the new office wing.',
      deadline: new Date('2026-09-30'),
      created_by: officer.id, status: 'OPEN',
      items: { create: [
        { product_name: 'Ergonomic Chair', quantity: 50, unit: 'NOS', estimated_price: 8500 },
        { product_name: 'Standing Desk',   quantity: 20, unit: 'NOS', estimated_price: 25000 },
        { product_name: 'Filing Cabinet',  quantity: 15, unit: 'NOS', estimated_price: 6000 },
      ]},
      vendors: { create: [
        { vendor_id: vendor1.id, invitation_status: 'PENDING' },
        { vendor_id: vendor2.id, invitation_status: 'PENDING' },
        { vendor_id: vendor3.id, invitation_status: 'PENDING' },
      ]},
    },
  });

  const rfq2 = await prisma.rfq.upsert({
    where: { id: 'rfq-seed-002-0000-0000-000000000002' },
    update: {},
    create: {
      id: 'rfq-seed-002-0000-0000-000000000002',
      title: 'IT Infrastructure Upgrade 2026',
      description: 'Laptops, servers, and networking equipment for annual IT refresh.',
      deadline: new Date('2026-08-15'),
      created_by: officer.id, status: 'OPEN',
      items: { create: [
        { product_name: 'Laptop (Core i7, 16GB)',  quantity: 30, unit: 'NOS', estimated_price: 75000 },
        { product_name: 'Network Switch 48 Port',  quantity: 5,  unit: 'NOS', estimated_price: 45000 },
        { product_name: 'UPS 1KVA',                quantity: 10, unit: 'NOS', estimated_price: 12000 },
      ]},
      vendors: { create: [
        { vendor_id: vendor2.id, invitation_status: 'PENDING' },
        { vendor_id: vendor3.id, invitation_status: 'PENDING' },
      ]},
    },
  });

  const rfq3 = await prisma.rfq.upsert({
    where: { id: 'rfq-seed-003-0000-0000-000000000003' },
    update: {},
    create: {
      id: 'rfq-seed-003-0000-0000-000000000003',
      title: 'Annual Safety Equipment Supply',
      description: 'Hard hats, gloves, safety boots and fire extinguishers for site teams.',
      deadline: new Date('2026-07-31'),
      created_by: officer.id, status: 'PENDING_APPROVAL',
      items: { create: [
        { product_name: 'Safety Helmet',         quantity: 100, unit: 'NOS', estimated_price: 350 },
        { product_name: 'Safety Gloves (Pairs)', quantity: 200, unit: 'PKT', estimated_price: 150 },
        { product_name: 'Fire Extinguisher 5kg', quantity: 20,  unit: 'NOS', estimated_price: 2500 },
      ]},
      vendors: { create: [
        { vendor_id: vendor1.id, invitation_status: 'ACCEPTED' },
        { vendor_id: vendor3.id, invitation_status: 'ACCEPTED' },
      ]},
    },
  });

  const rfq4 = await prisma.rfq.upsert({
    where: { id: 'rfq-seed-004-0000-0000-000000000004' },
    update: {},
    create: {
      id: 'rfq-seed-004-0000-0000-000000000004',
      title: 'Pantry Supplies Q1 2026',
      description: 'Tea, coffee, water dispensers, and disposables for all floors.',
      deadline: new Date('2026-03-31'),
      created_by: officer.id, status: 'COMPLETED',
      items: { create: [
        { product_name: 'Water Dispenser',        quantity: 10, unit: 'NOS', estimated_price: 8000 },
        { product_name: 'Coffee Vending Machine', quantity: 5,  unit: 'NOS', estimated_price: 35000 },
        { product_name: 'Paper Cups 500pk',       quantity: 50, unit: 'BOX', estimated_price: 600 },
      ]},
      vendors: { create: [
        { vendor_id: vendor2.id, invitation_status: 'ACCEPTED' },
        { vendor_id: vendor3.id, invitation_status: 'ACCEPTED' },
      ]},
    },
  });

  await prisma.rfq.upsert({
    where: { id: 'rfq-seed-005-0000-0000-000000000005' },
    update: {},
    create: {
      id: 'rfq-seed-005-0000-0000-000000000005',
      title: 'Vehicle Fleet Maintenance Contract',
      description: 'Annual AMC for 12 company vehicles.',
      deadline: new Date('2026-12-31'),
      created_by: officer.id, status: 'DRAFT',
      items: { create: [
        { product_name: 'Full Service per vehicle', quantity: 12, unit: 'NOS', estimated_price: 15000 },
        { product_name: 'Tyre Replacement Set',      quantity: 6,  unit: 'SET', estimated_price: 28000 },
      ]},
    },
  });
  console.log('✅ RFQs seeded');

  // ─── 5. Quotations ────────────────────────────────────────────────────────
  const quotation1 = await prisma.quotation.upsert({
    where: { id: 'quo-seed-001-0000-0000-000000000001' },
    update: {},
    create: {
      id: 'quo-seed-001-0000-0000-000000000001',
      rfq_id: rfq3.id, vendor_id: vendor1.id,
      total_amount: 97750, delivery_days: 14, status: 'SUBMITTED',
      submitted_at: ago(1),
      notes: 'All items ISI certified. Payment: 30 days net.',
      items: { create: [
        { product_name: 'Safety Helmet',         quantity: 100, unit_price: 320,    subtotal: 32000 },
        { product_name: 'Safety Gloves (Pairs)', quantity: 200, unit_price: 140,    subtotal: 28000 },
        { product_name: 'Fire Extinguisher 5kg', quantity: 20,  unit_price: 1887.5, subtotal: 37750 },
      ]},
    },
  });

  const quotation2 = await prisma.quotation.upsert({
    where: { id: 'quo-seed-002-0000-0000-000000000002' },
    update: {},
    create: {
      id: 'quo-seed-002-0000-0000-000000000002',
      rfq_id: rfq3.id, vendor_id: vendor3.id,
      total_amount: 105500, delivery_days: 10, status: 'SUBMITTED',
      submitted_at: ago(1),
      notes: 'CE marked products. Expedited delivery. Includes installation.',
      items: { create: [
        { product_name: 'Safety Helmet',         quantity: 100, unit_price: 350,  subtotal: 35000 },
        { product_name: 'Safety Gloves (Pairs)', quantity: 200, unit_price: 155,  subtotal: 31000 },
        { product_name: 'Fire Extinguisher 5kg', quantity: 20,  unit_price: 1975, subtotal: 39500 },
      ]},
    },
  });

  const quotation3 = await prisma.quotation.upsert({
    where: { id: 'quo-seed-003-0000-0000-000000000003' },
    update: {},
    create: {
      id: 'quo-seed-003-0000-0000-000000000003',
      rfq_id: rfq4.id, vendor_id: vendor2.id,
      total_amount: 292500, delivery_days: 7, status: 'APPROVED',
      submitted_at: ago(4),
      notes: 'Branded products. 1 year warranty. Delivery: 7 days.',
      items: { create: [
        { product_name: 'Water Dispenser',        quantity: 10, unit_price: 7500,  subtotal: 75000 },
        { product_name: 'Coffee Vending Machine', quantity: 5,  unit_price: 33000, subtotal: 165000 },
        { product_name: 'Paper Cups 500pk',        quantity: 50, unit_price: 525,   subtotal: 26250 },
      ]},
    },
  });
  console.log('✅ Quotations seeded');

  // ─── 6. Approval (PENDING — for RFQ-3) ───────────────────────────────────
  await prisma.approval.upsert({
    where: { id: 'apr-seed-001-0000-0000-000000000001' },
    update: {},
    create: {
      id: 'apr-seed-001-0000-0000-000000000001',
      quotation_id: quotation1.id, approved_by: manager.id,
      status: 'PENDING', remarks: null,
    },
  });
  console.log('✅ Approval seeded');

  // ─── 7. Purchase Order (completed flow) ──────────────────────────────────
  const po1 = await prisma.purchaseOrder.upsert({
    where: { po_number: 'PO-2026-001' },
    update: {},
    create: {
      po_number: 'PO-2026-001',
      quotation_id: quotation3.id, vendor_id: vendor2.id,
      generated_by: officer.id, status: 'COMPLETED',
      items: { create: [
        { product_name: 'Water Dispenser',        quantity: 10, unit_price: 7500,  tax: 1350,  subtotal: 76350 },
        { product_name: 'Coffee Vending Machine', quantity: 5,  unit_price: 33000, tax: 5940,  subtotal: 170940 },
        { product_name: 'Paper Cups 500pk',        quantity: 50, unit_price: 525,   tax: 94.5, subtotal: 26344.5 },
      ]},
    },
  });

  const po2 = await prisma.purchaseOrder.upsert({
    where: { po_number: 'PO-2026-002' },
    update: {},
    create: {
      po_number: 'PO-2026-002',
      quotation_id: quotation2.id, vendor_id: vendor3.id,
      generated_by: officer.id, status: 'SENT',
      items: { create: [
        { product_name: 'Safety Helmet',         quantity: 100, unit_price: 350,  tax: 630,   subtotal: 35630 },
        { product_name: 'Safety Gloves (Pairs)', quantity: 200, unit_price: 155,  tax: 558,   subtotal: 31558 },
        { product_name: 'Fire Extinguisher 5kg', quantity: 20,  unit_price: 1975, tax: 711,   subtotal: 40211 },
      ]},
    },
  });
  console.log('✅ Purchase Orders seeded');

  // ─── 8. Invoices (spanning 6 months for chart data) ──────────────────────
  const invoiceData = [
    { number: 'INV-2026-001', po_id: po1.id, vendor_id: vendor2.id, tax: 7384.5,  total: 299884.5, status: 'PAID',    date: ago(5) },
    { number: 'INV-2026-002', po_id: po2.id, vendor_id: vendor3.id, tax: 5499,    total: 112499,   status: 'SENT',    date: ago(1) },
  ];
  for (const inv of invoiceData) {
    await prisma.invoice.upsert({
      where: { invoice_number: inv.number },
      update: {},
      create: {
        invoice_number: inv.number,
        purchase_order_id: inv.po_id,
        vendor_id: inv.vendor_id,
        tax_amount: inv.tax,
        total_amount: inv.total,
        status: inv.status,
        created_at: inv.date,
      },
    });
  }
  console.log('✅ Invoices seeded');

  // ─── 9. Notifications ─────────────────────────────────────────────────────
  const notifs = [
    { user_id: manager.id,     title: 'Approval Required',    message: 'Quotation for "Annual Safety Equipment Supply" needs your approval.', type: 'WARNING' },
    { user_id: officer.id,     title: 'Quotation Received',   message: 'Infra Supplies submitted a quotation for: Annual Safety Equipment Supply.', type: 'INFO' },
    { user_id: officer.id,     title: 'Quotation Received',   message: 'Global Logix Corp submitted a quotation for: Annual Safety Equipment Supply.', type: 'INFO' },
    { user_id: officer.id,     title: 'Invoice Paid',         message: 'Invoice INV-2026-001 from TechCore has been marked PAID.', type: 'SUCCESS' },
    { user_id: vendorUser1.id, title: 'New RFQ Assigned',     message: 'You have been invited to bid on: Office Furniture Procurement Q3 2026.', type: 'INFO' },
    { user_id: vendorUser2.id, title: 'New RFQ Assigned',     message: 'You have been invited to bid on: IT Infrastructure Upgrade 2026.', type: 'INFO' },
    { user_id: vendorUser3.id, title: 'PO Received',          message: 'Purchase Order PO-2026-002 has been issued to your company.', type: 'SUCCESS' },
    { user_id: admin.id,       title: 'New Vendor Registered', message: 'Global Logix Corp has been added to the vendor directory.', type: 'INFO' },
  ];
  for (const n of notifs) {
    await prisma.notification.create({ data: n }).catch(() => {});
  }
  console.log('✅ Notifications seeded');

  // ─── 10. Activity Logs ────────────────────────────────────────────────────
  const logs = [
    { user_id: officer.id,     entity_type: 'RFQ',            entity_id: rfq1.id,       action: 'CREATE' },
    { user_id: officer.id,     entity_type: 'RFQ',            entity_id: rfq2.id,       action: 'CREATE' },
    { user_id: officer.id,     entity_type: 'RFQ',            entity_id: rfq3.id,       action: 'CREATE' },
    { user_id: officer.id,     entity_type: 'RFQ',            entity_id: rfq4.id,       action: 'CREATE' },
    { user_id: vendorUser1.id, entity_type: 'QUOTATION',      entity_id: quotation1.id, action: 'CREATE' },
    { user_id: vendorUser3.id, entity_type: 'QUOTATION',      entity_id: quotation2.id, action: 'CREATE' },
    { user_id: vendorUser2.id, entity_type: 'QUOTATION',      entity_id: quotation3.id, action: 'CREATE' },
    { user_id: officer.id,     entity_type: 'PURCHASE_ORDER', entity_id: po1.id,        action: 'CREATE' },
    { user_id: officer.id,     entity_type: 'PURCHASE_ORDER', entity_id: po2.id,        action: 'CREATE' },
    { user_id: manager.id,     entity_type: 'APPROVAL',       entity_id: 'apr-seed-001-0000-0000-000000000001', action: 'PENDING' },
    { user_id: officer.id,     entity_type: 'INVOICE',        entity_id: 'INV-2026-001', action: 'CREATE' },
    { user_id: admin.id,       entity_type: 'VENDOR',         entity_id: vendor3.id,    action: 'CREATE' },
  ];
  for (const log of logs) {
    await prisma.activityLog.create({ data: log }).catch(() => {});
  }
  console.log('✅ Activity logs seeded');

  console.log('\n🎉 Database seeded successfully!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  Login Credentials  (password: password123)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  👑 Admin      : admin@vendorbridge.com');
  console.log('  📋 Officer    : officer@vendorbridge.com');
  console.log('  ✅ Manager    : manager@vendorbridge.com');
  console.log('  🏭 Vendor 1   : rajesh@infrasupplies.in');
  console.log('  💻 Vendor 2   : priya@techcore.in');
  console.log('  🚚 Vendor 3   : amit@globallogix.com');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
};

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
