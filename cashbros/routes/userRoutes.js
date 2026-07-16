const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
console.log("✅ userRoutes file loaded");

//route
router.post("/", userController.addUser);
router.put("/:_id", userController.updateUser);
router.delete("/:_id", userController.deleteUser);
router.post("/login", userController.loginUser);
router.put("/api/users/:id", userController.updateUser);
router.delete("/api/users/:id", userController.deleteUser);
module.exports = router;
