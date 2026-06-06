import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

export const generateInvoicePdf = async ({ invoice, purchaseOrder, vendor }) => {
  const fileName = `${invoice.invoice_number}.pdf`;
  const outputPath = path.resolve('tmp', fileName);

  await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });
  const doc = new PDFDocument({ margin: 50 });
  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  doc.fontSize(20).text('VendorBridge Invoice', { align: 'center' });
  doc.moveDown();

  doc.fontSize(12).text(`Invoice Number: ${invoice.invoice_number}`);
  doc.text(`PO Number: ${purchaseOrder.po_number}`);
  doc.text(`Vendor: ${vendor.company_name}`);
  doc.text(`Date: ${new Date(invoice.created_at).toISOString().slice(0, 10)}`);
  doc.moveDown();

  doc.text(`Total Amount: ${invoice.total_amount.toFixed(2)}`);
  doc.text(`Tax Amount: ${invoice.tax_amount.toFixed(2)}`);
  doc.text(`Status: ${invoice.status}`);
  doc.moveDown();

  doc.text('Thank you for using VendorBridge.', { align: 'center' });
  doc.end();

  await new Promise((resolve, reject) => {
    stream.on('finish', resolve);
    stream.on('error', reject);
  });

  return outputPath;
};
