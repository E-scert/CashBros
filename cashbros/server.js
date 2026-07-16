const session = require("express-session");
const express = require("express");
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

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

//start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
