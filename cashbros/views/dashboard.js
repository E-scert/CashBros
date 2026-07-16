async function loadUser() {
  try {
    const res = await fetch("http://localhost:3000/api/users/me", {
      credentials: "include"
    });
    const data = await res.json();
    
    console.log("Data from /me:", data);

    if (data.user) {
      document.getElementById("userName").innerText = data.user.name;

      // Later: fetch balance and maturity from backend
      document.getElementById("balance").innerText = "R 0.00";
      document.getElementById("maturity").innerText = "Not set";
    } else {
      window.location.href = "/login.html";
    }
  } catch (err) {
    console.error("Error loading user:", err);
    window.location.href = "/login.html";
  }
}

function logout() {
  fetch("http://localhost:3000/api/users/logout", { method: "POST" })
    .then(() => window.location.href = "/login.html");
}

loadUser();
