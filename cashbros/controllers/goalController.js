const pool = require("../config/db");

// CREATE goal and link to account
exports.createGoal = async (req, res) => {
  try {
    const { goal_name, goal_amount, goal_term, account_id } = req.body;

    const result = await pool.query(
      `INSERT INTO goal (goal_name, goal_amount, goal_term, remaining_amount) 
       VALUES ($1, $2, $3, $2) RETURNING *`,
      [goal_name, goal_amount, goal_term]
    );

    // Link goal to account
    await pool.query(
      "UPDATE user_account SET goal_id = $1 WHERE account_id = $2",
      [result.rows[0].goal_id, account_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating goal:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET goal by ID
exports.getGoalById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM goal WHERE goal_id = $1", [id]);

    if (result.rows.length === 0) return res.status(404).json({ error: "Goal not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET goal by account
exports.getGoalByAccount = async (req, res) => {
  try {
    const { account_id } = req.params;
    const result = await pool.query(
      `SELECT g.* FROM goal g 
       JOIN user_account ua ON g.goal_id = ua.goal_id 
       WHERE ua.account_id = $1`,
      [account_id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: "No goal for this account" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE goal
exports.updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const { goal_name, goal_amount, goal_term, status } = req.body;

    const result = await pool.query(
      `UPDATE goal 
       SET goal_name = COALESCE($1, goal_name),
           goal_amount = COALESCE($2, goal_amount),
           goal_term = COALESCE($3, goal_term),
           status = COALESCE($4, status)
       WHERE goal_id = $5 RETURNING *`,
      [goal_name, goal_amount, goal_term, status, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: "Goal not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE goal
exports.deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM goal WHERE goal_id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) return res.status(404).json({ error: "Goal not found" });
    res.json({ message: "Goal deleted", goal: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
