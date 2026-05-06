const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const tripsRouter = require("./routes/trips");
const expensesRouter = require("./routes/expenses");
const authRouter = require("./routes/auth");
const categoriesRouter = require("./routes/categories");

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

function isAllowedOrigin(origin) {
  if (!origin) {
    return true;
  }

  if (allowedOrigins.includes(origin)) {
    return true;
  }

  return /^http:\/\/localhost:517\d$/.test(origin);
}

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "TripSplitter API is running" });
});

app.use("/api/auth", authRouter);
app.use("/api/trips", tripsRouter);
app.use("/api/expenses", expensesRouter);
app.use("/api/categories", categoriesRouter);

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  console.error(error);
  return res.status(error.status || 500).json({
    error: error.message || "Something went wrong",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});