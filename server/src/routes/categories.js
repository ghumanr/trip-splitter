const express = require("express");
const prisma = require("../prisma");
const { ensureDefaultCategories } = require("../lib/categories");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    await ensureDefaultCategories();

    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return res.json(categories);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch categories" });
  }
});

module.exports = router;
