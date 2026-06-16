const bcrypt = require("bcrypt");
const pool = require("../config/db");

async function addUser(req, res) {
  const { name, surname, password } = req.body;

  try {
    const password_hash = await bcrypt.hash(password, 8);
    const result = await pool.query(
      "insert into users(name,surname,hash_password) values ($1,$2,$3) returning *",

      [name, surname, password_hash],
    );
    res
      .status(201)
      .json({ message: "Person added successfully", user: result.rows[0] });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding person", error: err.message });
  }
}

module.exports = { addUser };
