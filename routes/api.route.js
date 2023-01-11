/**
 * /api/v1  API Routes - user
 */
const express = require('express')
const router = express.Router()
// file upload middleware
const multer = require('multer')

// middleware
const upload = multer({ dest: '/tmp/' })

// Require controller modules
const authMiddleware = require('../middlewares/auth.middleware')
const commonController = require('../controllers/common.controller')

// --------------------------------------------------------
//
router.get("/", commonController.invalidAccess);
router.all("/ping", commonController.ping);

module.exports = router