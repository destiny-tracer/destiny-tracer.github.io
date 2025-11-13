import React, { useState } from 'react';
import LoanForm from './components/LoanForm';

export default function App() {
  const [monthlyIncome, setMonthlyIncome] = useState(150000);
  const [cashReserve, setCashReserve] = useState(900000);
  const [prepayAmount, setPrepayAmount] = useState(150000);

  const handleAddLoan = () => {
    // Add loan logic here
  };

  const handleResetLoans = () => {
    // Reset demo loans logic here
  };

  const handleExportCsv = () => {
    // Export CSV logic here
  };

  return (
    <div className="container">
      <h1>Debt Health Analyzer (React)</h1>
      <LoanForm
        monthlyIncome={monthlyIncome}
        cashReserve={cashReserve}
        prepayAmount={prepayAmount}
        onIncomeChange={setMonthlyIncome}
        onReserveChange={setCashReserve}
        onPrepayChange={setPrepayAmount}
        onAddLoan={handleAddLoan}
        onResetLoans={handleResetLoans}
        onExportCsv={handleExportCsv}
      />
    </div>
  );
}
