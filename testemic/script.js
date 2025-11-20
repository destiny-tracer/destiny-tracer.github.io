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
  renderBreakdown(loanAmount, monthlyRate, emi, loanTenure);
}

function resetForm() {
  document.getElementById('loanAmount').value = '';
  document.getElementById('interestRate').value = '';
  document.getElementById('loanTenure').value = '';
  document.getElementById('results').style.display = 'none';
  document.getElementById('emiChart').style.display = 'none';
  document.getElementById('breakdownTable').style.display = 'none';
}

function toggleDarkMode() {
  document.body.classList.toggle('dark');
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
        backgroundColor: ['#0ea5a4', '#3b82f6'],
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

function renderBreakdown(principal, rate, emi, months) {
  const tbody = document.getElementById('breakdownBody');
  tbody.innerHTML = '';
  let balance = principal;

  for (let i = 1; i <= months; i++) {
    const interest = balance * rate;
    const principalPaid = emi - interest;
    balance -= principalPaid;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${i}</td>
      <td>₹${principalPaid.toFixed(2)}</td>
      <td>₹${interest.toFixed(2)}</td>
      <td>₹${balance.toFixed(2)}</td>
    `;
    tbody.appendChild(row);
  }

  document.getElementById('breakdownTable').style.display = 'block';
}

function exportPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text("EMI Calculation Results", 10, 10);
  doc.text(`Monthly EMI: ₹${document.getElementById('emiResult').innerText}`, 10, 20);
  doc.text(`Total Interest: ₹${document.getElementById('interestResult').innerText}`, 10, 30);
  doc.text(`Total Payment: ₹${document.getElementById('totalPaymentResult').innerText}`, 10, 40);
  doc.save("emi-calculation.pdf");
}
