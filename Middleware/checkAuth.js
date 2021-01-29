  
const jwt = require("jsonwebtoken");
let appconfig = require('../config.js');

const secretKey = appconfig.secretkeyforjwt;

module.exports = (req, res, next) => {
  try {
    const token = req.headers.token;
    const decoded = jwt.verify(token, secretKey);
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Auth failed",
    });
  }
};