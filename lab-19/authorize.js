function authorize(allowedRoles, getRole) {
    return (req, res, next) => {
      const role = getRole(req);
      if (!role) return res.status(401).send('Unauthorized');
      if (!allowedRoles.includes(role)) {
        return res.status(403).send('Forbidden');
      }
      next();
    };
  }
  
  module.exports = authorize;  