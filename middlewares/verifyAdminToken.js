const jwt = require('jsonwebtoken');

const verifyAdminToken = (req, res, next) => {
  console.log(' Verifying access token...');


  const token = req.cookies?.adminAccessToken;
 console.log(token)
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized access — no token found' });
  }

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
   if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied — not an admin' });
    }
    
    req.user = decoded;
    console.log('Token verified:', req.user);

    next(); 
  } catch (err) {
    console.error('Invalid or expired token:', err.message);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = verifyAdminToken;
