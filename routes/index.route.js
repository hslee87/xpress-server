/**
 * /api/v1   API Routes
 */
const express = require("express")
const router = express.Router()

// Require controller modules
const authMiddleware = require("../middlewares/auth.middleware")

// --------------------------------------------------------
//

module.exports = router
