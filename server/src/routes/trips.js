const express = require("express");
const prisma = require("../prisma");
const { formatTrip, getRequestUserId, getTripById, tripInclude } = require("../lib/trips");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const userId = getRequestUserId(req);
    const trips = await prisma.trip.findMany({
      where: userId
        ? {
            members: {
              some: {
                userId,
              },
            },
          }
        : undefined,
      include: tripInclude,
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(trips.map(formatTrip));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch trips" });
  }
});

router.get("/:tripId", async (req, res) => {
  try {
    const { tripId } = req.params;
    const trip = await getTripById(tripId);

    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    res.json(trip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch trip" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, destination, startDate, endDate, members = [] } = req.body;
    const createdById = getRequestUserId(req) || req.body.createdById;

    if (!title || !createdById) {
      return res.status(400).json({ error: "Title and user are required" });
    }

    const owner = await prisma.user.findUnique({
      where: {
        id: createdById,
      },
    });

    if (!owner) {
      return res.status(404).json({ error: "User not found" });
    }

    const trip = await prisma.$transaction(async (tx) => {
      const createdTrip = await tx.trip.create({
        data: {
          title: title.trim(),
          description: description?.trim() || null,
          destination: destination?.trim() || null,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
          createdById,
        },
      });

      await tx.tripMember.create({
        data: {
          tripId: createdTrip.id,
          userId: createdById,
          role: "owner",
        },
      });

      const normalizedMembers = members
        .map((member) =>
          typeof member === "string"
            ? { email: member, name: member.split("@")[0] }
            : member
        )
        .filter((member) => member?.email)
        .map((member) => ({
          email: member.email.trim().toLowerCase(),
          name: member.name?.trim() || member.email.split("@")[0],
        }))
        .filter((member) => member.email !== owner.email);

      for (const member of normalizedMembers) {
        const user = await tx.user.upsert({
          where: {
            email: member.email,
          },
          update: {
            name: member.name,
          },
          create: {
            name: member.name,
            email: member.email,
          },
        });

        await tx.tripMember.upsert({
          where: {
            tripId_userId: {
              tripId: createdTrip.id,
              userId: user.id,
            },
          },
          update: {},
          create: {
            tripId: createdTrip.id,
            userId: user.id,
          },
        });
      }

      return tx.trip.findUnique({
        where: {
          id: createdTrip.id,
        },
        include: tripInclude,
      });
    });

    res.status(201).json(formatTrip(trip));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create trip" });
  }
});

router.post("/:tripId/members", async (req, res) => {
  try {
    const { tripId } = req.params;
    const { name, email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const trip = await prisma.trip.findUnique({
      where: {
        id: tripId,
      },
    });

    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    const user = await prisma.user.upsert({
      where: {
        email: email.trim().toLowerCase(),
      },
      update: {
        name: name?.trim() || email.split("@")[0],
      },
      create: {
        name: name?.trim() || email.split("@")[0],
        email: email.trim().toLowerCase(),
      },
    });

    await prisma.tripMember.upsert({
      where: {
        tripId_userId: {
          tripId,
          userId: user.id,
        },
      },
      update: {},
      create: {
        tripId,
        userId: user.id,
      },
    });

    const fullTrip = await getTripById(tripId);

    res.status(201).json(fullTrip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add member" });
  }
});

router.post("/:tripId/payments", async (req, res) => {
  try {
    const { tripId } = req.params;
    const { fromUserId, toUserId, amount, note } = req.body;

    if (!fromUserId || !toUserId || !amount || Number(amount) <= 0) {
      return res.status(400).json({ error: "Payment details are required" });
    }

    await prisma.payment.create({
      data: {
        tripId,
        fromUserId,
        toUserId,
        amount,
        note: note?.trim() || null,
      },
    });

    const fullTrip = await getTripById(tripId);

    res.status(201).json(fullTrip);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to record payment" });
  }
});

router.delete("/:tripId", async (req, res) => {
  try {
    const { tripId } = req.params;

    await prisma.trip.delete({
      where: {
        id: tripId,
      },
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete trip" });
  }
});

module.exports = router;