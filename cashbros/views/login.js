const form = document.getElementById("loginForm");
const responseDiv = document.getElementById("loginResponse");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const surname = document.getElementById("surname").value;
  const password = document.getElementById("password").value;

  try {
  const res = await fetch("http://localhost:3000/api/users/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name, surname, password }),
  credentials: "include"
});


    const data = await res.json();
    if(data.message === "Login successful"){
        window.location.href = "dashboard.html";
    }else{
        responseDiv.innerText = "Login failed. Please check your credentials.";
    }
    responseDiv.innerText = JSON.stringify(data, null, 2);
  } catch (err) {
    responseDiv.innerText = "Error: " + err.message;
  }
});
