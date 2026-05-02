import type { Trip } from "../types";

export const trips: Trip[] = [
  {
    id: "1",
    title: "Miami Spring Break",
    description: "Trip to Miami with friends",
    members: ["Ranveer", "Alex", "Sam", "Jordan"],
    expenses: [
      {
        id: "e1",
        title: "Hotel",
        amount: 400,
        paidBy: "Ranveer",
        category: "Lodging",
        date: "2026-04-15",
      },
      {
        id: "e2",
        title: "Dinner",
        amount: 120,
        paidBy: "Alex",
        category: "Food",
        date: "2026-04-16",
      },
    ],
    balances: [
      { user: "Ranveer", balance: 180 },
      { user: "Alex", balance: -20 },
      { user: "Sam", balance: -80 },
      { user: "Jordan", balance: -80 },
    ],
  },
  {
    id: "2",
    title: "Chicago Weekend",
    description: "Short city trip",
    members: ["Ranveer", "Chris"],
    expenses: [
      {
        id: "e3",
        title: "Train Tickets",
        amount: 90,
        paidBy: "Chris",
        category: "Travel",
        date: "2026-04-10",
      },
    ],
    balances: [
      { user: "Ranveer", balance: -45 },
      { user: "Chris", balance: 45 },
    ],
  },
];