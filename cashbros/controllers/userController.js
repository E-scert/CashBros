const bcrypt = require("bcrypt");
const pool = require("../config/db");


exports.loginUser = async (req,res)=>{
    try{
        const {name, surname, password} = req.body;
        const result = await pool.query('SELECT * FROM users WHERE name = $1 AND surname = $2' ,[name,surname]);
        
        if(result.rows.length === 0) return res.status(404).json({message: "User not found"});
        
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.hash_password);
        
        if(!isMatch) return res.status(401).json({message: "Invalid credentials"});

        req.session.user = {
          id: user.user_id,
          name: user.name,
          surname: user.surname
        }
        res.status(200).json({message: "Login successful", user: req.session.user});
    } catch (err) {
        res.status(500).json({message: "Error logging in", error: err.message});
    }
}
exports.addUser =async (req, res) =>{
 try {
    const { name, surname, password } = req.body;
    const password_hash = await bcrypt.hash(password, 8);
    const result = await pool.query(
      "insert into users(name,surname,hash_password) values ($1,$2,$3) returning *",[name, surname, password_hash],
    );
    res.status(201).json({ message: "Person added successfully", user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: "Error adding person", error: err.message });
  }
}
// UPDATE
exports.updateUser = async (req, res) => {
  try {
    const { name, surname, password } = req.body;
    const hashedPassword = password ? await bcrypt.hash(password,8) : null;
    const userId = parseInt(req.params._id,10);
    
   

    const result = await pool.query(
      'UPDATE users SET name = $1, surname = $2, hash_password = COALESCE($3, hash_password) WHERE user_id = $4 RETURNING *',
      [name, surname, hashedPassword, userId],
    );


    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User updated successfully', user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Error updating user', error: err.message });
  }
};

// DELETE
exports.deleteUser = async (req, res) => {
  try {
    const userId = parseInt(req.params._id || req.params.id, 10); // handle both id/_id
    console.log("Deleting user_id:", userId);

    const result = await pool.query(
      'DELETE FROM users WHERE user_id = $1 RETURNING *',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully", user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: "Error deleting person", error: err.message });
  }
};


function isAutheniticated(req, res, next){
  if(req.session.user){
    return next();
  }
  return res.status(401).json({message:"not logged in"});

}

exports.logoutUser = (req, res)=>{
  req.session.destroy(err=>{
    if(err) return res.status(500).json({message:"Error logging out", error: err.message});
    res.clearCookie("connect.sid");
    res.status(200).json({message:"Logout successful"});
  });
}

module.exports = exports;
