let AWS = require('aws-sdk');
let appconfig = require('../config');
AWS.config.update(appconfig.awsconfig);
let docClient = new AWS.DynamoDB.DocumentClient();
module.exports = docClient;