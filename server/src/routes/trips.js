const express = require("express");
const prisma = require("../prisma");

const router = express.Router();

// Get all trips
router.get("/", async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      include: {
        members: {
          include: {
            user: true,
          },
        },
        expenses: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(trips);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch trips" });
  }
});

// Get one trip by id
router.get("/:tripId", async (req, res) => {
  try {
    const { tripId } = req.params;

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        members: {
          include: {
            user: true,
          },
        },
        expenses: true,
      },
    });

    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    res.json(trip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch trip" });
  }
});

// Create a trip
router.post("/", async (req, res) => {
  try {
    const { title, description, createdById } = req.body;

    const trip = await prisma.trip.create({
      data: {
        title,
        description,
        createdById,
      },
    });

    await prisma.tripMember.create({
      data: {
        tripId: trip.id,
        userId: createdById,
        role: "owner",
      },
    });

    const fullTrip = await prisma.trip.findUnique({
      where: { id: trip.id },
      include: {
        members: {
          include: {
            user: true,
          },
        },
        expenses: true,
      },
    });

    res.status(201).json(fullTrip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create trip" });
  }
});

module.exports = router;