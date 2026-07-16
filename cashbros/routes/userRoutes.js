const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
console.log("userRoutes file loaded");

//route
router.post("/", userController.addUser);
router.post("/login", userController.loginUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

// Get logged-in user
router.get("/me", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not logged in" });
  }
  res.json({ user: req.session.user });
});

// Logout
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out" });
  });
});

module.exports = router;
