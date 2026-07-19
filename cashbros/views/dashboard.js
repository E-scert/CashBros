async function loadUser() {
  try {
    const res = await fetch("http://localhost:3000/api/users/me", { credentials: "include" });
    const data = await res.json();
    console.log("ME route response:", data);

    if (data.user) {
      document.getElementById("userName").innerText = data.user.name;
      // Fetch ALL accounts for this user
      getAccounts(data.user.user_id);
    } else {
      window.location.href = "/login.html";
    }
  } catch (err) {
    console.error("Error loading user:", err);
    window.location.href = "/login.html";
  }
}

async function getAccounts(userId) {
  try {
    const res = await fetch(`http://localhost:3000/api/accounts/user/${userId}`);
    const data = await res.json();
    const accounts = data.account;

    const tbody = document.getElementById("accountsBody");
    tbody.innerHTML = "";

    if (accounts && accounts.length > 0) {
      accounts.forEach(acc => {
        // Calculate progress
        const progress = acc.goal_amount
          ? Math.min(100, Math.round(((acc.goal_amount - acc.remaining_amount) / acc.goal_amount) * 100))
          : 0;

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${acc.goal_name || "No goal set"}</td>
          <td>R ${acc.amount}</td>
          <td>${acc.goal_term || "N/A"}</td>
          <td>
            <div class="progress-bar">
              <div class="progress-fill ${progress < 30 ? 'red' : progress < 70 ? 'yellow' : 'green'}"
                   style="width:${progress}%"></div>
            </div>
            <span>${progress}%</span>
            <button onclick="viewAccount(${acc.account_id})">View Account</button>
          </td>
        `;
        tbody.appendChild(row);
      });
    } else {
      const row = document.createElement("tr");
      row.innerHTML = `<td colspan="4">No accounts found</td>`;
      tbody.appendChild(row);
    }
  } catch (err) {
    console.error("Error fetching accounts:", err);
  }
}

async function viewAccount(accountId) {
  console.log("View Account clicked for ID:", accountId);
  try {
    const res = await fetch(`http://localhost:3000/api/accounts/account/${accountId}`);
    const data = await res.json();
    console.log("Raw API response:", data);

    if (!data.account || data.account.length === 0) {
      alert("Account not found");
      return;
    }

    const acc = data.account[0];
    console.log("Parsed account object:", acc);

    // Fill modal fields
    document.getElementById("modalGoalName").innerText = acc.goal_name || "No goal";
    document.getElementById("modalAccountNum").innerText = acc.account_num;
    document.getElementById("modalBalance").innerText = acc.amount;
    document.getElementById("modalGoalAmount").innerText = acc.goal_amount || "N/A";
    document.getElementById("modalGoalTerm").innerText = acc.goal_term || "N/A";
    document.getElementById("modalStatus").innerText = acc.status || "N/A";

    // Set hidden accountId for transaction form
    document.getElementById("accountId").value = acc.account_id;

    // Progress calculation
    const progress = acc.goal_amount
      ? Math.min(100, Math.round(((acc.goal_amount - acc.remaining_amount) / acc.goal_amount) * 100))
      : 0;
    const progressFill = document.getElementById("modalProgressFill");
    progressFill.style.width = progress + "%";
    progressFill.className = "progress-fill " + (progress < 30 ? "red" : progress < 70 ? "yellow" : "green");
    document.getElementById("modalProgressText").innerText = progress + "%";

    // Withdraw button logic
    // const withdrawBtn = document.getElementById("withdrawBtn");
    // if (acc.status === "matured") {
    //   withdrawBtn.disabled = false;
    //   withdrawBtn.style.backgroundColor = "#4caf50";
    // } else {
    //   withdrawBtn.disabled = true;
    //   withdrawBtn.style.backgroundColor = "#555";
    // }

    // Load transactions for this account
    const txRes = await fetch(`http://localhost:3000/api/transactions/account/${accountId}`);
    const txData = await txRes.json();
    const tbody = document.getElementById("modalTransactionsBody");
    tbody.innerHTML = "";
    txData.forEach(tx => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${tx.transact_id}</td>
        <td>${tx.transaction_type}</td>
        <td>R ${tx.amount_transacted}</td>
        <td>${new Date(tx.datetime).toLocaleString()}</td>
      `;
      tbody.appendChild(row);
    });

    // Show modal
    document.getElementById("accountModal").style.display = "block";
  } catch (err) {
    console.error("Error viewing account:", err);
  }
}

function closeAccountModal() {
  document.getElementById("accountModal").style.display = "none";
}

// Transaction form submit
document.getElementById("createTransactionForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const accountId = document.getElementById("accountId").value;
  const transactionType = document.getElementById("transactionType").value;
  const amountTransacted = document.getElementById("amountTransacted").value;

  try {
    const res = await fetch("http://localhost:3000/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        account_id: accountId,
        transaction_type: transactionType,
        amount_transacted: amountTransacted
      })
    });

    const result = await res.json();
    console.log("Transaction result:", result);

    // Refresh account + transactions
    getAccounts(result.user_id || 0); // refresh accounts list
    getTransactions(accountId);       // refresh transactions table
  } catch (err) {
    console.error("Error creating transaction:", err);
  }
});

async function getTransactions(accountId) {
  try {
    const res = await fetch(`http://localhost:3000/api/transactions/account/${accountId}`);
    const data = await res.json();

    const tbody = document.getElementById("modalTransactionsBody");
    tbody.innerHTML = "";

    if (data.length > 0) {
      data.forEach(tx => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${tx.transact_id}</td>
          <td>${tx.transaction_type}</td>
          <td>R ${tx.amount_transacted}</td>
          <td>${new Date(tx.datetime).toLocaleString()}</td>
        `;
        tbody.appendChild(row);
      });
    } else {
      const row = document.createElement("tr");
      row.innerHTML = `<td colspan="4">No transactions found</td>`;
      tbody.appendChild(row);
    }
  } catch (err) {
    console.error("Error fetching transactions:", err);
  }
}

loadUser();
