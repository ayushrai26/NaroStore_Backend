const jwt = require('jsonwebtoken');

const verifyUserToken = (req, res, next) => {
  console.log(' Verifying access token...');

  console.log(req.cookies,'cookie')
  const token = req.cookies?.userAccessToken;
 console.log(token,'usertoken')
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized access — no token found' });
  }

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    
    req.user = decoded;
    console.log('✅ Token verified:', req.user);

    next(); 
  } catch (err) {
    console.error('Invalid or expired token:', err.message);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = verifyUserToken;
