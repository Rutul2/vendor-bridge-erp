import { sendMail } from '../../config/mailer.js';
import { logActivity } from '../../utils/activityLogger.js';
import { invoiceNotificationTemplate } from '../../utils/emailTemplates.js';
import { generateIdCode } from '../../utils/generateNumber.js';
import { generateInvoicePdf } from '../../utils/generatePdf.js';
import { countInvoices, createInvoice, findInvoiceById, findInvoices, updateInvoice } from './invoices.repository.js';

export const listInvoices = async ({ page, limit, status, vendor_id }) => {
  const skip = (Number(page || 1) - 1) * Number(limit || 20);
  const take = Number(limit || 20);
  const items = await findInvoices({ skip, take, status, vendor_id });
  const total = await countInvoices({ status, vendor_id });
  return { items, total, page: Number(page || 1), limit: take };
};

export const getInvoice = async (id) => {
  const invoice = await findInvoiceById(id);
  if (!invoice) throw { statusCode: 404, message: 'Invoice not found' };
  return invoice;
};

export const createNewInvoice = async ({ purchase_order_id, vendor_id, tax_amount, total_amount, status }, user) => {
  const invoiceNumber = generateIdCode('INV');
  const invoice = await createInvoice({
    invoice_number: invoiceNumber,
    purchase_order_id,
    vendor_id,
    tax_amount,
    total_amount,
    status: status || 'DRAFT',
  });
  const invoiceWithRelations = await findInvoiceById(invoice.id);
  const pdfPath = await generateInvoicePdf({ invoice: invoiceWithRelations, purchaseOrder: invoiceWithRelations.purchase_order, vendor: invoiceWithRelations.vendor });
  const updated = await updateInvoice(invoice.id, { pdf_url: pdfPath });
  await logActivity({ user_id: user.id, entity_type: 'INVOICE', entity_id: updated.id, action: 'CREATE', new_data: updated });
  return updated;
};

export const getInvoicePdf = async (id) => {
  const invoice = await findInvoiceById(id);
  if (!invoice || !invoice.pdf_url) throw { statusCode: 404, message: 'Invoice PDF not available' };
  return invoice.pdf_url;
};

export const emailInvoice = async (id, payload) => {
  const invoice = await findInvoiceById(id);
  if (!invoice) throw { statusCode: 404, message: 'Invoice not found' };
  const pdfPath = await getInvoicePdf(id);
  const html = invoiceNotificationTemplate({ vendorName: invoice.vendor.company_name, invoiceNumber: invoice.invoice_number, total: invoice.total_amount });
  await sendMail({
    to: payload.email,
    subject: payload.subject || `Invoice ${invoice.invoice_number}`,
    html: `${html}<p>${payload.message || ''}</p>`,
  });
  const updated = await updateInvoice(id, { status: 'SENT', sent_at: new Date() });
  await logActivity({ user_id: null, entity_type: 'INVOICE', entity_id: updated.id, action: 'EMAIL', new_data: updated });
  return updated;
};
