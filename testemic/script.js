function calculateEMI() {
  const loanAmount = parseFloat(document.getElementById('loanAmount').value);
  const interestRate = parseFloat(document.getElementById('interestRate').value);
  const loanTenure = parseInt(document.getElementById('loanTenure').value);

  if (isNaN(loanAmount) || isNaN(interestRate) || isNaN(loanTenure)) {
    alert('Please enter valid numbers in all fields.');
    return;
  }

  const monthlyRate = interestRate / (12 * 100);
  const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTenure)) /
              (Math.pow(1 + monthlyRate, loanTenure) - 1);
  const totalPayment = emi * loanTenure;
  const totalInterest = totalPayment - loanAmount;

  document.getElementById('emiResult').innerText = emi.toFixed(2);
  document.getElementById('interestResult').innerText = totalInterest.toFixed(2);
  document.getElementById('totalPaymentResult').innerText = totalPayment.toFixed(2);
  document.getElementById('results').style.display = 'block';

  renderChart(loanAmount, totalInterest);
}

function resetForm() {
  document.getElementById('loanAmount').value = '';
  document.getElementById('interestRate').value = '';
  document.getElementById('loanTenure').value = '';
  document.getElementById('results').style.display = 'none';
  document.getElementById('emiChart').style.display = 'none';
}

function renderChart(principal, interest) {
  const ctx = document.getElementById('emiChart').getContext('2d');
  document.getElementById('emiChart').style.display = 'block';

  if (window.emiChartInstance) {
    window.emiChartInstance.destroy();
  }

  window.emiChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Principal', 'Interest'],
      datasets: [{
        data: [principal, interest],
        backgroundColor: ['#3b82f6', '#f59e0b'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}
