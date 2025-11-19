// ===== Data Arrays =====
let debts = [];
let savings = [];
let income = {};
let expenses = {};

// ===== LocalStorage =====
function saveData() {
  localStorage.setItem('smartDebt', JSON.stringify({debts, savings, income, expenses}));
}

function loadData() {
  const data = JSON.parse(localStorage.getItem('smartDebt'));
  if (!data) return;
  debts = data.debts || [];
  savings = data.savings || [];
  income = data.income || {};
  expenses = data.expenses || {};
  updateSummary();
}

// ===== Income & Expense =====
function collectIncomeExpenses() {
  income.primary = parseFloat(document.getElementById('primaryIncome').value) || 0;
  income.additional = parseFloat(document.getElementById('additionalIncome').value) || 0;
  income.rental = parseFloat(document.getElementById('rentalIncome').value) || 0;
  income.misc = parseFloat(document.getElementById('miscIncome').value) || 0;

  expenses.living = parseFloat(document.getElementById('livingExpense').value) || 0;
  expenses.education = parseFloat(document.getElementById('educationExpense').value) || 0;
  expenses.travel = parseFloat(document.getElementById('travelExpense').value) || 0;
  expenses.misc = parseFloat(document.getElementById('miscExpense').value) || 0;
}

// ===== Debt =====
function calculateEMI(principal, rate, tenure) {
  if (rate === 0) return Math.round(principal / tenure);
  let monthlyRate = rate / 12 / 100;
  return Math.round((principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
    (Math.pow(1 + monthlyRate, tenure) - 1));
}

function addDebt() {
  collectIncomeExpenses();
  const debt = {
    name: document.getElementById('debtName').value,
    type: document.getElementById('debtType').value,
    principal: parseFloat(document.getElementById('debtAmount').value) || 0,
    interest: parseFloat(document.getElementById('debtInterest').value) || 0,
    tenure: parseInt(document.getElementById('debtTenure').value) || 0,
    paid: parseInt(document.getElementById('debtPaid').value) || 0
  };
  debt.emi = calculateEMI(debt.principal, debt.interest, debt.tenure);
  debt.remainingEMI = debt.tenure - debt.paid;
  debts.push(debt);
  saveData();
  updateSummary();
}

// ===== Savings =====
function addSaving() {
  const saving = {
    name: document.getElementById('savingName').value,
    type: document.getElementById('savingType').value,
    amount: parseFloat(document.getElementById('savingAmount').value) || 0
  };
  savings.push(saving);
  saveData();
  updateSummary();
}

// ===== Summary & Strategies =====
function updateSummary() {
  collectIncomeExpenses();

  // Debt totals
  const totalDebtEMI = debts.reduce((sum,d)=>sum+d.emi,0);
  const totalDebtOutstanding = debts.reduce((sum,d)=>sum+d.emi*d.remainingEMI,0);

  // Savings totals
  const totalSavings = savings.reduce((sum,s)=>sum+s.amount,0);

  // Income & Expenses
  const totalIncome = Object.values(income).reduce((a,b)=>a+b,0);
  const totalExpenses = Object.values(expenses).reduce((a,b)=>a+b,0);
  const surplus = totalIncome - totalExpenses - totalDebtEMI;

  // Display summary
  let html = `
    <p><strong>Total Income:</strong> ₹${totalIncome}</p>
    <p><strong>Total Expenses:</strong> ₹${totalExpenses}</p>
    <p><strong>Total Debt EMI:</strong> ₹${totalDebtEMI}</p>
    <p><strong>Total Debt Outstanding:</strong> ₹${totalDebtOutstanding}</p>
    <p><strong>Total Savings:</strong> ₹${totalSavings}</p>
    <p><strong>Available Surplus:</strong> ₹${surplus}</p>
    <h3>💡 Debt Strategy</h3>
  `;

  // Debt strategies: Snowball & Avalanche
  const snowball = [...debts].sort((a,b)=>a.remainingEMI*a.emi - b.remainingEMI*b.emi);
  const avalanche = [...debts].sort((a,b)=>b.interest - a.interest);

  html += `<h4>Snowball (smallest debt first)</h4><ul>`;
  snowball.forEach(d=>html+=`<li>${d.name} - ₹${d.remainingEMI*d.emi} remaining</li>`);
  html += `</ul><h4>Avalanche (highest interest first)</h4><ul>`;
  avalanche.forEach(d=>html+=`<li>${d.name} - ${d.interest}% interest</li>`);
  html += `</ul>`;

  // Savings strategy (double current savings in 5 years approx)
  html += `<h3>💰 Savings Strategy</h3>`;
  savings.forEach(s=>{
    const doubled = s.amount * 2;
    html += `<p>${s.name} (${s.type}) → Target: ₹${doubled}</p>`;
  });

  document.getElementById('summary').innerHTML = html;

  // Render Charts
  renderDebtChart(debts);
  renderSavingChart(savings);
  renderCashflowChart(totalIncome, totalExpenses, totalDebtEMI, totalSavings);
}

// ===== Load Data on Start =====
window.onload = loadData;
function resetAllData() {
  if (!confirm("⚠️ Are you sure you want to reset all data? This cannot be undone.")) return;

  // Clear arrays and objects
  debts = [];
  savings = [];
  income = {};
  expenses = {};

  // Clear localStorage
  localStorage.removeItem('smartDebt');

  // Reset all input fields
  document.querySelectorAll('input').forEach(input => input.value = '');
  document.querySelectorAll('select').forEach(select => select.selectedIndex = 0);

  // Update summary and charts
  updateSummary();
}
