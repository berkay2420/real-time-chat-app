// middlewares/proxy.js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 10,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many requests try again later."
    });
  }
});

module.exports = limiter; 