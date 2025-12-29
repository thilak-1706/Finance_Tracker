import express from "express";
import {
  addTransaction,
  getTransactions,
  deleteTransaction,
  updateTransaction, // <-- new
} from "../controllers/transactionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Add a new transaction
router.post("/", protect, addTransaction);

// Get all transactions
router.get("/", protect, getTransactions);

// Update a transaction
router.put("/:id", protect, updateTransaction); // <-- new

// Delete a transaction
router.delete("/:id", protect, deleteTransaction);

export default router;
