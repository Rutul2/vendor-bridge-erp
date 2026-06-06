import fs from 'fs';
import { successResponse } from '../../utils/response.js';
import { createNewInvoice, emailInvoice, getInvoice, getInvoicePdf, listInvoices, updateInvoiceStatus } from './invoices.service.js';

export const listInvoicesHandler = async (req, res) => {
  const query = { ...req.query };
  if (req.user.role.name === 'VENDOR' && req.user.vendor_id) {
    query.vendor_id = req.user.vendor_id;
  }
  const data = await listInvoices(query);
  return successResponse(res, 'Invoices retrieved successfully', data);
};

export const getInvoiceHandler = async (req, res) => {
  const data = await getInvoice(req.params.id);
  return successResponse(res, 'Invoice retrieved successfully', data);
};

export const createInvoiceHandler = async (req, res) => {
  const data = await createNewInvoice(req.body, req.user);
  return successResponse(res, 'Invoice created successfully', data);
};

export const getInvoicePdfHandler = async (req, res) => {
  const filePath = await getInvoicePdf(req.params.id);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: 'Invoice PDF not found' });
  }
  return res.sendFile(filePath);
};

export const emailInvoiceHandler = async (req, res) => {
  const data = await emailInvoice(req.params.id, req.body, req.user);
  return successResponse(res, 'Invoice email sent successfully', data);
};

export const updateInvoiceStatusHandler = async (req, res) => {
  const data = await updateInvoiceStatus(req.params.id, req.body.status, req.user);
  return successResponse(res, 'Invoice status updated successfully', data);
};
