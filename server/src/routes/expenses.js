const express = require("express");
const prisma = require("../prisma");

const router = express.Router();

// Add expense
router.post("/", async (req, res) => {
  try {
    const { tripId, paidByUserId, title, amount, category, expenseDate, notes } = req.body;

    const expense = await prisma.expense.create({
      data: {
        tripId,
        paidByUserId,
        title,
        amount,
        category,
        expenseDate: new Date(expenseDate),
        notes,
      },
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create expense" });
  }
});

module.exports = router;