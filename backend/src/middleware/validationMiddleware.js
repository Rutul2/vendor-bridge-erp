const validate = (schema) => async (req, res, next) => {
  try {
    const validated = await schema.validateAsync(req.body, { abortEarly: false, stripUnknown: true });
    req.body = validated;
    next();
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: error.details.map((detail) => detail.message) });
  }
};

export default validate;
