const pool = require("../config/db");

//create account for user
exports.createAccount = async (req, res) => {
  try {
    const { user_id, goal_name, goal_amount, goal_term } = req.body;

    // Step 1: insert goal
    const goalResult = await pool.query(
      `INSERT INTO goal (goal_name, goal_amount, goal_term)
       VALUES ($1, $2, $3)
       RETURNING goal_id`,
      [goal_name, goal_amount, goal_term]
    );

    const goalId = goalResult.rows[0].goal_id;

    // Step 2: insert account linked to that goal
    const accountResult = await pool.query(
      `INSERT INTO user_account (user_id, account_num, amount, goal_id)
       VALUES ($1, floor(random()*900000000+100000000)::text, 0, $2)
       RETURNING *`,
      [user_id, goalId]
    );

    res.status(201).json({
      message: "Account created successfully",
      account: accountResult.rows[0]
    });
  } catch (error) {
    console.error("Error creating account:", error);
    res.status(500).json({ error: "Failed to create account" });
  }
};

//get account by user_id with goal info
exports.getAccountByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const result = await pool.query(
      `SELECT ua.account_id,
              ua.account_num,
              ua.amount,
              g.goal_id,
              g.goal_name,
              g.goal_amount,
              g.goal_term,
              g.remaining_amount,
              g.status
       FROM user_account ua
       LEFT JOIN goal g ON ua.goal_id = g.goal_id
       WHERE ua.user_id = $1`,
      [user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No accounts found for this user' });
    }

    res.status(200).json({ account: result.rows });
  } catch (error) {
    console.error("Error fetching accounts:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAccountById = async (req, res) => {
  try {
    const { account_id } = req.params;
    const result = await pool.query(
      `SELECT ua.account_id,
              ua.account_num,
              ua.amount,
              g.goal_id,
              g.goal_name,
              g.goal_amount,
              g.goal_term,
              g.remaining_amount,
              g.status
       FROM user_account ua
       LEFT JOIN goal g ON ua.goal_id = g.goal_id
       WHERE ua.account_id = $1`,
      [account_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Account not found' });
    }

    res.status(200).json({ account: result.rows });
  } catch (error) {
    console.error("Error fetching account by ID:", error);
    res.status(500).json({ error: error.message });
  }
};




//Update account balance
exports.updateAccountBalance = async (req, res) =>{
    try{
        const {account_id} = req.params;
        const {amount} = req.body;

        const result = await pool.query(
            'UPDATE user_account SET amount = $1 WHERE account_id = $2 RETURNING *',
            [amount, account_id]
        )
        if(result.rows.length === 0){
            return res.status(404).json({error:'Account not found'})
        }

        return res.status(200).json({message: "Account balance updated successfully", account: result.rows});
    }catch (err){
        return res.status(400).json({error: err.message});
    }
    
}
//delete account
exports.deleteAccount = async (req, res)=>
{
    try {
        const {account_id} = req.params;
        await pool.query('DELETE FROM user_account WHERE account_id =$1',
            [account_id]
        )
        if(result.rows.length === 0){
            return res.status(404).json({error:'Account not found'});
        }
        res.status(200).json({ message: 'Account deleted successfully', deletedAccount: result.rows[0]});
    } catch (error) {
        console.error("Error deleting account:", error);
        res.status(500).json({ error: "Failed to delete account" });
    }
}

module.exports = exports;