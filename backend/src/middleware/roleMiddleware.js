const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  if (!allowedRoles.includes(req.user.role.name)) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  next();
};

export default authorize;
