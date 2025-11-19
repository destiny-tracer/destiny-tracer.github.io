let debtChartInstance, savingChartInstance, cashflowChartInstance;

function renderDebtChart(debts) {
  const ctx = document.getElementById('debtChart').getContext('2d');
  if (debtChartInstance) debtChartInstance.destroy();

  debtChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: debts.map(d=>d.name),
      datasets: [{label:'Monthly EMI', data: debts.map(d=>d.emi), backgroundColor:'rgba(255,99,132,0.6)'}]
    },
    options: {
      responsive:true,
      plugins:{legend:{display:false}, title:{display:true, text:'Debt EMI Distribution'}}
    }
  });
}

function renderSavingChart(savings) {
  const ctx = document.getElementById('savingChart').getContext('2d');
  if (savingChartInstance) savingChartInstance.destroy();

  savingChartInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: savings.map(s=>s.name),
      datasets: [{data: savings.map(s=>s.amount), backgroundColor:['#3b82f6','#0ea5a4','#f59e0b','#ef4444','#8b5cf6']}]
    },
    options: {plugins:{title:{display:true,text:'Savings Distribution'}}}
  });
}

function renderCashflowChart(income, expenses, debtEMI, savings) {
  const ctx = document.getElementById('cashflowChart').getContext('2d');
  if (cashflowChartInstance) cashflowChartInstance.destroy();

  cashflowChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels:['Expenses','Debt EMI','Savings','Remaining'],
      datasets:[{data:[expenses,debtEMI,savings,Math.max(income - expenses - debtEMI - savings,0)], backgroundColor:['#f87171','#fb923c','#34d399','#60a5fa']}]
    },
    options:{plugins:{title:{display:true,text:'Cashflow Overview'}}}
  });
}
