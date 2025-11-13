function renderChart(debts) {
  const ctx = document.getElementById('debtChart').getContext('2d');
  const labels = debts.map(d => d.accountName);
  const data = debts.map(d => d.emi);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Monthly EMI',
        data: data,
        backgroundColor: 'rgba(54, 162, 235, 0.6)'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'EMI Distribution by Debt' }
      }
    }
  });
}
