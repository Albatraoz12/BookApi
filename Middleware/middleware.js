require('dotenv').config();
const jwt = require('jsonwebtoken');

function authorization(req, res, next) {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(403).json({ error: 'You have no access here' });
  }

  try {
    const data = jwt.verify(token, process.env.SECRET);
    req.userId = data.id;
    return next();
  } catch {
    return res.status(403).json({ error: 'You have an invalid token' });
  }
}

module.exports = { authorization };
