const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("node:path");

dotenv.config();
const PORT = process.env.LOCAL_PORT || 3000;

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.static(path.join(__dirname,"views")));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60,
    sameSite: "lax"
  }
}));

// Routes
const userRoutes = require("./routes/userRoutes");
const userAccountRoutes = require("./routes/userAccountRoutes");
console.log("Loading goalRoutes...");
const goalRoutes = require("./routes/goalRoutes");
const transactionRoutes = require("./routes/userTransactionRoutes");

app.use("/api/users", userRoutes);
app.use("/api/accounts", userAccountRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/transactions", transactionRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
