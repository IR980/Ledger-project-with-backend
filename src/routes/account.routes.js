const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const accountController = require("../controllers/account.controller")
const router = express.Router();

// POST - api/account/
// create new accounts

router.post("/", authMiddleware.authMiddleware, accountController.createAccount);

/**
 * - GET /api/accounts/
 * - Get all accounts of the logged-in user
 * - Protected Route
 */
router.get("/", authMiddleware.authMiddleware, accountController.getUserAccount)

router.get("/balance/:accountId", authMiddleware.authMiddleware, accountController.getAccountBalance)

module.exports = router;