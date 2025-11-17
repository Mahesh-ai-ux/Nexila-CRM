module.exports = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ msg: 'No user in request' });
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ msg: 'Forbidden: insufficient role' });
    }
    next();
  };
};
