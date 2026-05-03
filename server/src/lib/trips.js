const prisma = require("../prisma");

const tripInclude = {
  createdBy: true,
  members: {
    include: {
      user: true,
    },
    orderBy: {
      joinedAt: "asc",
    },
  },
  expenses: {
    include: {
      paidBy: true,
      category: true,
      splits: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      expenseDate: "desc",
    },
  },
  payments: {
    include: {
      fromUser: true,
      toUser: true,
    },
    orderBy: {
      paidAt: "desc",
    },
  },
};

const money = (value) => Number(Number(value || 0).toFixed(2));

function formatExpense(expense) {
  return {
    id: expense.id,
    title: expense.title,
    amount: money(expense.amount),
    category: expense.category.name,
    categoryColor: expense.category.color,
    expenseDate: expense.expenseDate,
    notes: expense.notes,
    paidBy: {
      id: expense.paidBy.id,
      name: expense.paidBy.name,
      email: expense.paidBy.email,
    },
    splits: expense.splits.map((split) => ({
      id: split.id,
      amount: money(split.amount),
      user: {
        id: split.user.id,
        name: split.user.name,
        email: split.user.email,
      },
    })),
  };
}

function buildSettlements(balances) {
  const debtors = balances
    .filter((item) => item.balance < -0.01)
    .map((item) => ({ ...item, amount: money(Math.abs(item.balance)) }));
  const creditors = balances
    .filter((item) => item.balance > 0.01)
    .map((item) => ({ ...item, amount: money(item.balance) }));
  const settlements = [];
  let debtorIndex = 0;
  let creditorIndex = 0;

  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex];
    const creditor = creditors[creditorIndex];
    const amount = money(Math.min(debtor.amount, creditor.amount));

    if (amount > 0) {
      settlements.push({
        from: debtor.user,
        to: creditor.user,
        amount,
      });
    }

    debtor.amount = money(debtor.amount - amount);
    creditor.amount = money(creditor.amount - amount);

    if (debtor.amount <= 0.01) {
      debtorIndex += 1;
    }

    if (creditor.amount <= 0.01) {
      creditorIndex += 1;
    }
  }

  return settlements;
}

function formatTrip(trip) {
  const members = trip.members.map((member) => ({
    id: member.id,
    role: member.role,
    joinedAt: member.joinedAt,
    user: {
      id: member.user.id,
      name: member.user.name,
      email: member.user.email,
    },
  }));
  const balanceMap = new Map(
    members.map((member) => [
      member.user.id,
      {
        user: member.user,
        balance: 0,
      },
    ])
  );
  const categoryTotals = new Map();

  trip.expenses.forEach((expense) => {
    const total = money(expense.amount);
    const paidByBalance = balanceMap.get(expense.paidByUserId);

    if (paidByBalance) {
      paidByBalance.balance = money(paidByBalance.balance + total);
    }

    expense.splits.forEach((split) => {
      const splitBalance = balanceMap.get(split.userId);

      if (splitBalance) {
        splitBalance.balance = money(splitBalance.balance - money(split.amount));
      }
    });

    const categoryTotal = categoryTotals.get(expense.category.name) || {
      name: expense.category.name,
      color: expense.category.color,
      total: 0,
    };
    categoryTotal.total = money(categoryTotal.total + total);
    categoryTotals.set(expense.category.name, categoryTotal);
  });

  trip.payments.forEach((payment) => {
    const amount = money(payment.amount);
    const fromBalance = balanceMap.get(payment.fromUserId);
    const toBalance = balanceMap.get(payment.toUserId);

    if (fromBalance) {
      fromBalance.balance = money(fromBalance.balance + amount);
    }

    if (toBalance) {
      toBalance.balance = money(toBalance.balance - amount);
    }
  });

  const balances = Array.from(balanceMap.values())
    .map((item) => ({
      user: item.user,
      balance: money(item.balance),
    }))
    .sort((a, b) => b.balance - a.balance);
  const totalSpent = money(
    trip.expenses.reduce((sum, expense) => sum + money(expense.amount), 0)
  );

  return {
    id: trip.id,
    title: trip.title,
    description: trip.description,
    destination: trip.destination,
    startDate: trip.startDate,
    endDate: trip.endDate,
    createdAt: trip.createdAt,
    updatedAt: trip.updatedAt,
    createdBy: {
      id: trip.createdBy.id,
      name: trip.createdBy.name,
      email: trip.createdBy.email,
    },
    members,
    expenses: trip.expenses.map(formatExpense),
    payments: trip.payments.map((payment) => ({
      id: payment.id,
      amount: money(payment.amount),
      note: payment.note,
      paidAt: payment.paidAt,
      from: {
        id: payment.fromUser.id,
        name: payment.fromUser.name,
        email: payment.fromUser.email,
      },
      to: {
        id: payment.toUser.id,
        name: payment.toUser.name,
        email: payment.toUser.email,
      },
    })),
    balances,
    settlements: buildSettlements(balances),
    categoryTotals: Array.from(categoryTotals.values()).sort(
      (a, b) => b.total - a.total
    ),
    totalSpent,
  };
}

async function getTripById(tripId) {
  const trip = await prisma.trip.findUnique({
    where: {
      id: tripId,
    },
    include: tripInclude,
  });

  return trip ? formatTrip(trip) : null;
}

function getRequestUserId(req) {
  return req.headers["x-user-id"] || req.query.userId || req.body.userId;
}

module.exports = {
  formatTrip,
  getRequestUserId,
  getTripById,
  money,
  tripInclude,
};
