const pool = require("../config/db");

//create account for user
exports.createAccount = async (req,res) => {
    try{
        const {user_id, account_num } = req.body;

        const result = await pool.query(
            'INSERT INTO user_account (user_id, account_num) VALUES ($1, $2) returning *',[user_id, account_num]
        )
        res.status(201).json(result.rows[0]);

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error("Error creating account:", error);
        res.status(500).json({ error: "Failed to create account" });
    }
}

//get account by user_id
exports.getAccountByUser = async (req,res)=>{
    try{
        const {user_id} = req.params;
        const result = await pool.query(
            'SELECT * FROM user_account WHERE user_id = $1', [user_id]
        )
        if(result.rows.length ===0){
            return res.status(404).json({error: 'Account not found for this user'});
        }
        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error("Error fetching account:", error);
        res.status(500).json({ error: error.message });
    }
}

//Update account balance
exports.updateAccountBalance = async (req, res) =>{
    try{
        const {account_id} = req.params;
        const {amount} = req.body;

        const result = await pool.query(
            'UPDATE user_account SET amount = $1 WHERE account_id = $2 RETURNING *',
            [amount, account_id]
        )

        res.json(result.rows[0]);
    }catch (err){
        res.status(400).json({error: err.message});
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
        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error("Error deleting account:", error);
        res.status(500).json({ error: "Failed to delete account" });
    }
}