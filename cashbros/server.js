const session = require("express-session");
const express = require("express");
const dotenv = require("dotenv");


dotenv.config();
const PORT = process.env.LOCAL_PORT || 3000;

const app = express();
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));



app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

//start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
