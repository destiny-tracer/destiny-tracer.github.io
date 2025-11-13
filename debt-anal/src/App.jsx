import React, { useState } from 'react';
import LoanForm from './components/LoanForm';
import LoanTable from './components/LoanTable';
import StrategySelector from './components/StrategySelector';
import Summary from './components/Summary';
import Charts from './components/Charts';
import Timeline from './components/Timeline';
import Insights from './components/Insights';
import { simulate } from './utils/amortize';
// trigger deploy
export default function App() {
  const [monthlyIncome, setMonthlyIncome] = useState(150000);
  const [cashReserve, setCashReserve] = useState(900000);
  const [prepayAmount, setPrepayAmount] = useState(150000);
  const [strategy, setStrategy] = useState('snowball');
  const [loans, setLoans] = useState([
    { id: 1, name: 'Axis PL', balance: 900000, rate: 14, emi: 65002, tenure: 24 },
    { id: 2, name: 'Chola Loan', balance: 450000, rate: 13, emi: 32000, tenure: 18 },
    { id: 3, name: 'Fullerton', balance: 250000, rate: 15, emi: 28000, tenure: 12 },
  ]);
  const [timeline, setTimeline] = useState([]);
  const [insights, setInsights] = useState([]);

  const handleAddLoan = () => {
    const newLoan = {
      id: Date.now(),
      name: 'New Loan',
      balance: 0,
      rate: 12,
      emi: 0,
      tenure: 12,
    };
    setLoans([...loans, newLoan]);
  };

  const handleUpdateLoan = (id, field, value) => {
    setLoans(loans.map((loan) => (loan.id === id ? { ...loan, [field]: value } : loan)));
  };

  const handleRemoveLoan = (id) => {
    setLoans(loans.filter((loan) => loan.id !== id));
  };

  const handleResetLoans = () => {
    setLoans([
      { id: 1, name: 'Axis PL', balance: 900000, rate: 14, emi: 65002, tenure: 24 },
      { id: 2, name: 'Chola Loan', balance: 450000, rate: 13, emi: 32000, tenure: 18 },
      { id: 3, name: 'Fullerton', balance: 250000, rate: 15, emi: 28000, tenure: 12 },
    ]);
  };

  const handleExportCsv = () => {
    let csv = 'Loan,Balance,Rate,EMI,Tenure\n';
    loans.forEach((l) => {
      csv += `${l.name},${l.balance},${l.rate},${l.emi},${l.tenure}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'debt-summary.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleStrategyChange = (e) => {
    setStrategy(e.target.value);
  };
  const handleSimulate = () => {
  const result = simulate(loans, strategy, prepayAmount, monthlyIncome);
  setTimeline(result.timeline);
  setInsights(result.insights);
  setLoans(result.updatedLoans);
  };

  const totalOutstanding = loans.reduce((sum, loan) => sum + loan.balance, 0);
  const totalEmi = loans.reduce((sum, loan) => sum + loan.emi, 0);
  const dti = totalEmi / (monthlyIncome || 1) * 100;

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

      <LoanTable
        loans={loans}
        onUpdateLoan={handleUpdateLoan}
        onRemoveLoan={handleRemoveLoan}
      />

      <StrategySelector strategy={strategy} onChange={handleStrategyChange} />
      
      <div style={{ marginTop: '12px' }}>
        <button className="btn" onClick={handleSimulate}>Simulate</button>
      </div>


      <Summary
        totalOutstanding={totalOutstanding}
        totalEmi={totalEmi}
        dti={dti}
      />

      <Charts loans={loans} />

      <Timeline timeline={timeline} />

      <Insights insights={insights} />
    </div>
  );
}
