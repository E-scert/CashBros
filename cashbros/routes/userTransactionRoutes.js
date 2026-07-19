const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/userTransactionController");

console.log("userTransactionRoutes loaded");

router.post("/", transactionController.createTransaction);
router.get("/:id", transactionController.getTransactionById);
router.get("/account/:account_id", transactionController.getTransactionsByAccount);
router.delete("/:id", transactionController.deleteTransaction);

module.exports = router;
