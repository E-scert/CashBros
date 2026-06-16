const express = require("express");
const dotenv = require("dotenv");
const PORT = process.env.PORT || 3000;

dotenv.config();
const app = express();
app.use(express.json());

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

//start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
