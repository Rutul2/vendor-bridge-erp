import { successResponse } from '../../utils/response.js';
import { getVendorRfq, listVendorRfqs } from './vendor-rfqs.service.js';

export const listVendorRfqsHandler = async (req, res) => {
  const vendor_id = req.user.vendor_id || req.query.vendor_id;
  const data = await listVendorRfqs({ vendor_id, page: req.query.page, limit: req.query.limit });
  return successResponse(res, 'Vendor RFQs retrieved', data);
};

export const getVendorRfqHandler = async (req, res) => {
  const vendor_id = req.user.vendor_id || req.query.vendor_id;
  const data = await getVendorRfq({ vendor_id, rfq_id: req.params.id });
  return successResponse(res, 'Vendor RFQ retrieved', data);
};
