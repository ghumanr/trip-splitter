const express = require("express");
const prisma = require("../prisma");
const { findOrCreateCategory } = require("../lib/categories");
const { getTripById, money } = require("../lib/trips");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      tripId,
      paidByUserId,
      title,
      amount,
      category,
      categoryId,
      expenseDate,
      notes,
      splitUserIds,
    } = req.body;

    if (!tripId || !paidByUserId || !title || !amount || Number(amount) <= 0) {
      return res.status(400).json({ error: "Expense details are required" });
    }

    const trip = await prisma.trip.findUnique({
      where: {
        id: tripId,
      },
      include: {
        members: true,
      },
    });

    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    const selectedUserIds = [
      ...new Set(
        Array.isArray(splitUserIds) && splitUserIds.length
          ? splitUserIds
          : trip.members.map((member) => member.userId)
      ),
    ];

    if (!selectedUserIds.includes(paidByUserId)) {
      selectedUserIds.push(paidByUserId);
    }

    const categoryRecord = categoryId
      ? await prisma.category.findUnique({
          where: {
            id: categoryId,
          },
        })
      : await findOrCreateCategory(category);

    if (!categoryRecord) {
      return res.status(404).json({ error: "Category not found" });
    }

    const total = money(amount);
    const baseShare = Math.floor((total / selectedUserIds.length) * 100) / 100;
    let remaining = money(total - baseShare * selectedUserIds.length);

    await prisma.$transaction(async (tx) => {
      const expense = await tx.expense.create({
        data: {
          tripId,
          paidByUserId,
          title: title.trim(),
          amount: total,
          categoryId: categoryRecord.id,
          expenseDate: expenseDate ? new Date(expenseDate) : new Date(),
          notes: notes?.trim() || null,
        },
      });

      for (const userId of selectedUserIds) {
        const adjustment = remaining > 0 ? 0.01 : 0;
        remaining = money(remaining - adjustment);

        await tx.expenseSplit.create({
          data: {
            expenseId: expense.id,
            userId,
            amount: money(baseShare + adjustment),
          },
        });
      }
    });

    const fullTrip = await getTripById(tripId);

    res.status(201).json(fullTrip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create expense" });
  }
});

router.delete("/:expenseId", async (req, res) => {
  try {
    const { expenseId } = req.params;

    const expense = await prisma.expense.findUnique({
      where: {
        id: expenseId,
      },
    });

    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    await prisma.expense.delete({
      where: {
        id: expenseId,
      },
    });

    const fullTrip = await getTripById(expense.tripId);

    res.json(fullTrip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete expense" });
  }
});

module.exports = router;