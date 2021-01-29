let appconfig = require('../config');
var nodemailer = require('nodemailer');


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: appconfig.emailconfig.email,
    pass: appconfig.emailconfig.password
  }
});

module.exports = transporter;