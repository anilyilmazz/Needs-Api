const express = require("express");
const router = express.Router();
const chatController = require("../Controllers/chat");
const checkAuth = require("../Middleware/checkAuth");

router.get("/", chatController.connect);

module.exports = router; 