const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

//middleware
app.use(express.json());

//test route
app.get("/", (req, res) => {
  res.send("Cashbros backend is live!.");
});

//start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
