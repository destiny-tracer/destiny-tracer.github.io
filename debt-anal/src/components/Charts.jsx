import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale);

export default function Charts({ loans }) {
  const labels = loans.map((l) => l.name);
  const balances = loans.map((l) => l.balance);
  const emis = loans.map((l) => l.emi);

  const balanceData = {
    labels,
    datasets: [{ label: 'Balance', data: balances, backgroundColor: '#0f71ff' }],
  };

  const emiData = {
    labels,
    datasets: [{ label: 'EMI per month', data: emis, backgroundColor: '#0f71ff' }],
  };

  const options = {
    plugins: { legend: { display: false } },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="card">
      <h3>Charts</h3>
      <div className="chart-wrap" style={{ height: '200px' }}>
        <Bar data={balanceData} options={options} />
      </div>
      <div style={{ height: '12px' }}></div>
      <div className="chart-wrap" style={{ height: '200px' }}>
        <Bar data={emiData} options={options} />
      </div>
    </div>
  );
}
