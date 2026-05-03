const express = require("express");
const bcrypt = require("bcryptjs");
const prisma = require("../prisma");

const router = express.Router();

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const passwordHash = await bcrypt.hash(password, 10);
    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingUser?.passwordHash) {
      return res.status(409).json({ error: "An account already exists for that email" });
    }

    const user = existingUser
      ? await prisma.user.update({
          where: {
            id: existingUser.id,
          },
          data: {
            name: name.trim(),
            passwordHash,
          },
        })
      : await prisma.user.create({
          data: {
            name: name.trim(),
            email: normalizedEmail,
            passwordHash,
          },
        });

    return res.status(201).json({ user: publicUser(user) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to register" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email.trim().toLowerCase(),
      },
    });

    if (!user?.passwordHash) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    return res.json({ user: publicUser(user) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to log in" });
  }
});

module.exports = router;
