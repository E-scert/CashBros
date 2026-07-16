const form = document.getElementById("addUserForm");
const responseDiv = document.getElementById("response");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const surname = document.getElementById("surname").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:3000/api/users/addUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, surname, password })
    });

    const data = await res.json();
    responseDiv.innerText = JSON.stringify(data, null, 2);
  } catch (err) {
    responseDiv.innerText = "Error: " + err.message;
  }
});
