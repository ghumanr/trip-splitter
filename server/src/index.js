const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const tripsRouter = require("./routes/trips");
const expensesRouter = require("./routes/expenses");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "TripSplitter API is running" });
});

app.use("/api/trips", tripsRouter);
app.use("/api/expenses", expensesRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});