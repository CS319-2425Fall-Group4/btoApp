const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Mock user object to bypass authentication
  req.user = {
    id: 1, // Mock user ID
    role: 'GUIDE', // Mock role (e.g., 'GUIDE', 'ADMIN', etc.)
  };

  console.warn('Authentication is bypassed! Replace this middleware with actual implementation once ready.');
  next();

  /**
   * 
  // code for production
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
   */
};

const roleCheck = (roles) => (req, res, next) => {
  // Check roles against the mocked user
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  next();
  /** 
   * 
  // code for production
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  next();
   */
};

module.exports = { authMiddleware, roleCheck }; 