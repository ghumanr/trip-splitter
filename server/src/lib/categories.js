const prisma = require("../prisma");

const defaultCategories = [
  { name: "Food", color: "#f97316" },
  { name: "Lodging", color: "#8b5cf6" },
  { name: "Transportation", color: "#06b6d4" },
  { name: "Activities", color: "#22c55e" },
  { name: "Shopping", color: "#ec4899" },
  { name: "Other", color: "#64748b" },
];

async function ensureDefaultCategories() {
  await Promise.all(
    defaultCategories.map((category) =>
      prisma.category.upsert({
        where: {
          name: category.name,
        },
        update: {
          color: category.color,
        },
        create: category,
      })
    )
  );
}

async function findOrCreateCategory(name) {
  await ensureDefaultCategories();

  const categoryName = name || "Other";
  const existing = await prisma.category.findUnique({
    where: {
      name: categoryName,
    },
  });

  if (existing) {
    return existing;
  }

  return prisma.category.create({
    data: {
      name: categoryName,
      color: "#64748b",
    },
  });
}

module.exports = {
  defaultCategories,
  ensureDefaultCategories,
  findOrCreateCategory,
};
