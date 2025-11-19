// script.js

// ======== Helper Functions ========
function getData(key) {
  return JSON.parse(localStorage.getItem(key) || '[]');
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function resetData() {
  localStorage.clear();
  location.reload();
}

// ======== Data Arrays ========
let debts = getData('debts');
let savings = getData('savings');
let incomeData = getData('income');
let expensesData = getData('expenses');

// ======== DOM Elements ========
const addBtn = document.getElementById('addBtn');
const resetBtn = document.getElementById('resetBtn');

const totalIncomeEl = document.getElementById('totalIncome');
const totalExpensesEl = document.getElementById('totalExpenses');
const totalDebtEl = document.getElementById('totalDebt');
const totalSavingsEl = document.getElementById('totalSavings');

const debtStrategyEl = document.getElementById('debtStrategy');
const savingStrategyEl = document.getElementById('savingStrategy');

const statusChartEl = document.getElementById('statusChart').getContext('2d');

let chartInstance = null;

// ======== Functions ========

function calculateTotals() {
  const totalIncome = incomeData.reduce((a, b) => a + b, 0);
  const totalExpenses = expensesData.reduce((a, b) => a + b, 0);
  const totalDebt = debts.reduce((a, b) => a + b.amount, 0);
  const totalSavings = savings.reduce((a, b) => a + b.amount, 0);

  totalIncomeEl.textContent = `₹ ${totalIncome.toLocaleString()}`;
  totalExpensesEl.textContent = `₹ ${totalExpenses.toLocaleString()}`;
  totalDebtEl.textContent = `₹ ${totalDebt.toLocaleString()}`;
  totalSavingsEl.textContent = `₹ ${totalSavings.toLocaleString()}`;

  return { totalIncome, totalExpenses, totalDebt, totalSavings };
}

function generateDebtStrategy(totalDebt, totalIncome) {
  if (totalDebt === 0) return 'No debts! 🎉 Keep saving.';
  const ratio = totalDebt / totalIncome;
  if (ratio > 2) return 'High debt: prioritize clearing highest interest debts first 💳.';
  if (ratio > 1) return 'Medium debt: consider EMI consolidation or balance transfer ⚡.';
  return 'Manageable debt: continue regular payments 🏦.';
}

function generateSavingStrategy(totalSavings, totalIncome) {
  if (totalSavings === 0) return 'Start saving! Allocate at least 20% of income 💰.';
  const ratio = totalSavings / totalIncome;
  if (ratio < 0.5) return 'Increase SIP or FD contributions to grow savings faster 📈.';
  return 'Good savings! Explore high-yield options like mutual funds or gold 💎.';
}

function updateChart(totals) {
  const data = {
    labels: ['Income', 'Expenses', 'Debt', 'Savings'],
    datasets: [{
      label: 'Financial Overview',
      data: [totals.totalIncome, totals.totalExpenses, totals.totalDebt, totals.totalSavings],
      backgroundColor: ['#0ea5a4', '#f97316', '#ef4444', '#3b82f6'],
      borderRadius: 6
    }]
  };

  if (chartInstance) {
    chartInstance.data = data;
    chartInstance.update();
  } else {
    chartInstance = new Chart(statusChartEl, {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
}

function updateSummary() {
  const totals = calculateTotals();
  debtStrategyEl.textContent = generateDebtStrategy(totals.totalDebt, totals.totalIncome);
  savingStrategyEl.textContent = generateSavingStrategy(totals.totalSavings, totals.totalIncome);
  updateChart(totals);
}

// ======== Event Listeners ========

addBtn.addEventListener('click', () => {
  // Income
  const primaryIncome = parseFloat(document.getElementById('primaryIncome').value) || 0;
  const additionalIncome = parseFloat(document.getElementById('additionalIncome').value) || 0;
  if (primaryIncome) incomeData.push(primaryIncome);
  if (additionalIncome) incomeData.push(additionalIncome);

  // Expenses
  const expenses = parseFloat(document.getElementById('expenses').value) || 0;
  const emiPayments = parseFloat(document.getElementById('emiPayments').value) || 0;
  if (expenses) expensesData.push(expenses);
  if (emiPayments) expensesData.push(emiPayments);

  // Debts
  const debtName = document.getElementById('debtName').value.trim();
  const debtType = document.getElementById('debtType').value;
  const debtAmount = parseFloat(document.getElementById('debtAmount').value) || 0;
  const debtInterest = parseFloat(document.getElementById('debtInterest').value) || 0;
  const debtTenure = parseInt(document.getElementById('debtTenure').value) || 0;

  if (debtName && debtAmount > 0) {
    debts.push({ debtName, debtType, amount: debtAmount, interest: debtInterest, tenure: debtTenure });
  }

  // Savings
  const savingName = document.getElementById('savingName').value.trim();
  const savingType = document.getElementById('savingType').value;
  const savingAmount = parseFloat(document.getElementById('savingAmount').value) || 0;

  if (savingName && savingAmount > 0) {
    savings.push({ savingName, savingType, amount: savingAmount });
  }

  // Save to localStorage
  saveData('debts', debts);
  saveData('savings', savings);
  saveData('income', incomeData);
  saveData('expenses', expensesData);

  // Update summary
  updateSummary();

  // Clear inputs
  document.getElementById('debtForm').reset();
});

resetBtn.addEventListener('click', resetData);

// ======== Initialize ========
updateSummary();
