const errorHandler = (err, req, res, next) => {
  console.error(err);
  
  if (err.isJoi) {
    return res.status(400).json({ success: false, message: 'Validation error', errors: err.details.map(d => d.message) });
  }

  if (err.code === 'P2002') {
    return res.status(409).json({ success: false, message: 'Unique constraint failed', field: err.meta?.target });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';
  return res.status(statusCode).json({ success: false, message });
};

export default errorHandler;
