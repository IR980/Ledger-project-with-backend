const express = require("express");
const authController = require("../controllers/auth.controller")
const router = express.Router()

// methoh POST - /api/auth/register
// register controller
router.post("/register", authController.userRegister)

// method POST - api/auth/login
// user login controller
router.post("/login",authController.userLogin);
module.exports = router;