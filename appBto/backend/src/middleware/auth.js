const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    console.log('Auth Headers:', req.headers);
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'Authentication required' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      console.log('Decoded token:', decoded);
      req.user = decoded;
      next();
    } catch (jwtError) {
      console.error('JWT Verification failed:', jwtError);
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

const roleCheck = (roles) => (req, res, next) => {
  console.log('Role Check - User:', req.user);
  console.log('Role Check - Required Roles:', roles);
  
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  next();
};

module.exports = { authMiddleware, roleCheck }; 