CREATE TYPE "RoleName" AS ENUM ('ADMIN','PROCUREMENT_OFFICER','MANAGER','VENDOR');
CREATE TYPE "RfqStatus" AS ENUM ('DRAFT','OPEN','UNDER_REVIEW','PENDING_APPROVAL','APPROVED','REJECTED','COMPLETED');
CREATE TYPE "QuotationStatus" AS ENUM ('PENDING','SUBMITTED','APPROVED','REJECTED');
CREATE TYPE "PurchaseOrderStatus" AS ENUM ('CREATED','SENT','CONFIRMED','PARTIALLY_DELIVERED','COMPLETED','CANCELLED');
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT','SENT','PAID','OVERDUE','CANCELLED');
CREATE TYPE "NotificationType" AS ENUM ('INFO','SUCCESS','WARNING','ERROR');
CREATE TYPE "ApprovalStatus" AS ENUM ('APPROVED','REJECTED');

CREATE TABLE "Role" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name "RoleName" NOT NULL UNIQUE
);

CREATE TABLE "User" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role_id uuid NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp(3) NOT NULL DEFAULT now(),
  updated_at timestamp(3) NOT NULL DEFAULT now(),
  CONSTRAINT "User_role_id_fkey" FOREIGN KEY (role_id) REFERENCES "Role"(id) ON DELETE RESTRICT
);

CREATE TABLE "Vendor" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  vendor_code text NOT NULL UNIQUE,
  category text NOT NULL,
  gst_number text,
  email text NOT NULL,
  phone text,
  address text,
  rating double precision DEFAULT 0,
  status text NOT NULL DEFAULT 'ACTIVE',
  deleted_at timestamp(3),
  created_at timestamp(3) NOT NULL DEFAULT now(),
  updated_at timestamp(3) NOT NULL DEFAULT now()
);

CREATE TABLE "Rfq" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  deadline timestamp(3) NOT NULL,
  created_by uuid NOT NULL,
  status "RfqStatus" NOT NULL DEFAULT 'DRAFT',
  created_at timestamp(3) NOT NULL DEFAULT now(),
  updated_at timestamp(3) NOT NULL DEFAULT now(),
  deleted_at timestamp(3),
  CONSTRAINT "Rfq_created_by_fkey" FOREIGN KEY (created_by) REFERENCES "User"(id) ON DELETE CASCADE
);
CREATE INDEX "Rfq_status_index" ON "Rfq" (status);

CREATE TABLE "RfqItem" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id uuid NOT NULL,
  product_name text NOT NULL,
  description text,
  quantity integer NOT NULL,
  unit text NOT NULL,
  estimated_price double precision NOT NULL,
  CONSTRAINT "RfqItem_rfq_id_fkey" FOREIGN KEY (rfq_id) REFERENCES "Rfq"(id) ON DELETE CASCADE
);

CREATE TABLE "RfqVendor" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id uuid NOT NULL,
  vendor_id uuid NOT NULL,
  invitation_status text NOT NULL DEFAULT 'PENDING',
  invited_at timestamp(3) NOT NULL DEFAULT now(),
  CONSTRAINT "RfqVendor_rfq_id_fkey" FOREIGN KEY (rfq_id) REFERENCES "Rfq"(id) ON DELETE CASCADE,
  CONSTRAINT "RfqVendor_vendor_id_fkey" FOREIGN KEY (vendor_id) REFERENCES "Vendor"(id) ON DELETE CASCADE,
  CONSTRAINT "RfqVendor_rfq_id_vendor_id_unique" UNIQUE (rfq_id, vendor_id)
);

CREATE TABLE "Quotation" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id uuid NOT NULL,
  vendor_id uuid NOT NULL,
  total_amount double precision NOT NULL,
  delivery_days integer NOT NULL,
  notes text,
  status "QuotationStatus" NOT NULL DEFAULT 'PENDING',
  submitted_at timestamp(3),
  created_at timestamp(3) NOT NULL DEFAULT now(),
  CONSTRAINT "Quotation_rfq_id_fkey" FOREIGN KEY (rfq_id) REFERENCES "Rfq"(id) ON DELETE CASCADE,
  CONSTRAINT "Quotation_vendor_id_fkey" FOREIGN KEY (vendor_id) REFERENCES "Vendor"(id) ON DELETE CASCADE
);
CREATE INDEX "Quotation_status_index" ON "Quotation" (status);

CREATE TABLE "QuotationItem" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id uuid NOT NULL,
  product_name text NOT NULL,
  quantity integer NOT NULL,
  unit_price double precision NOT NULL,
  subtotal double precision NOT NULL,
  CONSTRAINT "QuotationItem_quotation_id_fkey" FOREIGN KEY (quotation_id) REFERENCES "Quotation"(id) ON DELETE CASCADE
);

CREATE TABLE "Approval" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id uuid NOT NULL,
  approved_by uuid NOT NULL,
  status "ApprovalStatus" NOT NULL,
  remarks text,
  approved_at timestamp(3) NOT NULL DEFAULT now(),
  CONSTRAINT "Approval_quotation_id_fkey" FOREIGN KEY (quotation_id) REFERENCES "Quotation"(id) ON DELETE CASCADE,
  CONSTRAINT "Approval_approved_by_fkey" FOREIGN KEY (approved_by) REFERENCES "User"(id) ON DELETE RESTRICT
);

CREATE TABLE "PurchaseOrder" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  po_number text NOT NULL UNIQUE,
  quotation_id uuid NOT NULL,
  vendor_id uuid NOT NULL,
  generated_by uuid NOT NULL,
  status "PurchaseOrderStatus" NOT NULL DEFAULT 'CREATED',
  created_at timestamp(3) NOT NULL DEFAULT now(),
  CONSTRAINT "PurchaseOrder_quotation_id_fkey" FOREIGN KEY (quotation_id) REFERENCES "Quotation"(id) ON DELETE CASCADE,
  CONSTRAINT "PurchaseOrder_vendor_id_fkey" FOREIGN KEY (vendor_id) REFERENCES "Vendor"(id) ON DELETE CASCADE,
  CONSTRAINT "PurchaseOrder_generated_by_fkey" FOREIGN KEY (generated_by) REFERENCES "User"(id) ON DELETE RESTRICT
);

CREATE TABLE "PurchaseOrderItem" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id uuid NOT NULL,
  product_name text NOT NULL,
  quantity integer NOT NULL,
  unit_price double precision NOT NULL,
  tax double precision NOT NULL,
  subtotal double precision NOT NULL,
  CONSTRAINT "PurchaseOrderItem_purchase_order_id_fkey" FOREIGN KEY (purchase_order_id) REFERENCES "PurchaseOrder"(id) ON DELETE CASCADE
);

CREATE TABLE "Invoice" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text NOT NULL UNIQUE,
  purchase_order_id uuid NOT NULL,
  vendor_id uuid NOT NULL,
  tax_amount double precision NOT NULL,
  total_amount double precision NOT NULL,
  status "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
  pdf_url text,
  sent_at timestamp(3),
  created_at timestamp(3) NOT NULL DEFAULT now(),
  CONSTRAINT "Invoice_purchase_order_id_fkey" FOREIGN KEY (purchase_order_id) REFERENCES "PurchaseOrder"(id) ON DELETE CASCADE,
  CONSTRAINT "Invoice_vendor_id_fkey" FOREIGN KEY (vendor_id) REFERENCES "Vendor"(id) ON DELETE CASCADE
);

CREATE TABLE "Notification" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type "NotificationType" NOT NULL DEFAULT 'INFO',
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamp(3) NOT NULL DEFAULT now(),
  CONSTRAINT "Notification_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "User"(id) ON DELETE CASCADE
);

CREATE TABLE "ActivityLog" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  entity_type text NOT NULL,
  entity_id text NOT NULL,
  action text NOT NULL,
  old_data jsonb,
  new_data jsonb,
  created_at timestamp(3) NOT NULL DEFAULT now(),
  CONSTRAINT "ActivityLog_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "User"(id) ON DELETE CASCADE
);
CREATE INDEX "ActivityLog_entity_index" ON "ActivityLog" (entity_type, entity_id);
