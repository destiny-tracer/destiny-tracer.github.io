let debts = [];

function calculateEMI(principal, rate, tenure) {
  let monthlyRate = rate / 12 / 100;
  let emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1);
  return Math.round(emi);
}

function addDebt() {
  const debt = {
    accountName: document.getElementById('accountName').value,
    accountType: document.getElementById('accountType').value,
    accountNo: document.getElementById('accountNo').value,
    dateOpened: document.getElementById('dateOpened').value,
    sanctionAmount: parseFloat(document.getElementById('sanctionAmount').value),
    interestRate: parseFloat(document.getElementById('interestRate').value),
    tenure: parseInt(document.getElementById('tenure').value),
    paidEMI: parseInt(document.getElementById('paidEMI').value)
  };

  debt.emi = calculateEMI(debt.sanctionAmount, debt.interestRate, debt.tenure);
  debt.totalEMI = debt.tenure;
  debt.remainingEMI = debt.totalEMI - debt.paidEMI;
  debt.dateClosure = new Date(new Date(debt.dateOpened).setMonth(new Date(debt.dateOpened).getMonth() + debt.tenure)).toISOString().split('T')[0];

  debts.push(debt);
  updateSummary();
}

function updateSummary() {
  let totalEMI = debts.reduce((sum, d) => sum + d.emi, 0);
  let totalOutstanding = debts.reduce((sum, d) => sum + (d.emi * d.remainingEMI), 0);

  document.getElementById('summary').innerHTML = `
    <p><strong>Total Monthly EMI:</strong> ₹${totalEMI}</p>
    <p><strong>Total Outstanding:</strong> ₹${totalOutstanding}</p>
  `;

  renderChart(debts);
  suggestStrategy();
}

function suggestStrategy() {
  const snowball = [...debts].sort((a, b) => (a.remainingEMI * a.emi) - (b.remainingEMI * b.emi));
  const avalanche = [...debts].sort((a, b) => b.interestRate - a.interestRate);

  let html = `<h3>💡 Snowball Method</h3><ul>`;
  snowball.forEach(d => {
    html += `<li>${d.accountName} - ₹${d.remainingEMI * d.emi} remaining</li>`;
  });
  html += `</ul><h3>⚡ Avalanche Method</h3><ul>`;
  avalanche.forEach(d => {
    html += `<li>${d.accountName} - ${d.interestRate}% interest</li>`;
  });
  html += `</ul>`;

  document.getElementById('summary').innerHTML += html;
}

document.getElementById('themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('dark');
});
