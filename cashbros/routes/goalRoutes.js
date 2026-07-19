const express = require("express");
const router = express.Router();
const goalController = require("../controllers/goalController");

console.log("goalRoutes file loaded");

router.post("/", goalController.createGoal); 
router.get("/:id", goalController.getGoalById);
router.get("/account/:account_id", goalController.getGoalByAccount);
router.put("/:id", goalController.updateGoal);
router.delete("/:id", goalController.deleteGoal);

module.exports = router;
