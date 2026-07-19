const pool = require("../config/db");

async function createTransaction(req, res) {
try {
    const { account_id, transaction_type, amount_transacted } = req.body;

    const result = await pool.query(
      `INSERT INTO user_transact (account_id, transaction_type, amount_transacted, datetime)
       VALUES ($1, $2, $3, NOW())
       RETURNING *`,
      [account_id, transaction_type, amount_transacted]
    );

    // Lookup the user_id for this account
    const userResult = await pool.query(
      `SELECT user_id FROM user_account WHERE account_id = $1`,
      [account_id]
    );

    res.status(201).json({
      transaction: result.rows[0],
      user_id: userResult.rows[0].user_id
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ error: error.message });
  }
}

async function getTransactionById(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM user_transact WHERE transact_id = $1", [id]);

    if (result.rows.length === 0) return res.status(404).json({ error: "Transaction not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getTransactionsByAccount(req, res) {
  try {
    const { account_id } = req.params;
    const result = await pool.query(
      "SELECT * FROM user_transact WHERE account_id = $1 ORDER BY datetime DESC",
      [account_id]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteTransaction(req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM user_transact WHERE transact_id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) return res.status(404).json({ error: "Transaction not found" });
    res.json({ message: "Transaction deleted", transaction: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  createTransaction,
  getTransactionById,
  getTransactionsByAccount,
  deleteTransaction
};
