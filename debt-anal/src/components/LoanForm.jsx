import React from 'react';

export default function LoanForm({
  monthlyIncome,
  cashReserve,
  prepayAmount,
  onIncomeChange,
  onReserveChange,
  onPrepayChange,
  onAddLoan,
  onResetLoans,
  onExportCsv,
}) {
  return (
    <div className="card">
      <h3>Income & Resources</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <div>
          <label>Total monthly income (₹)</label>
          <input
            type="number"
            value={monthlyIncome}
            onChange={e => onIncomeChange(Number(e.target.value))}
          />
        </div>
        <div>
          <label>Cash reserve available for prepayment (₹)</label>
          <input
            type="number"
            value={cashReserve}
            onChange={e => onReserveChange(Number(e.target.value))}
          />
        </div>
      </div>

      <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
        <button className="btn" onClick={onAddLoan}>+ Add loan</button>
        <button className="btn ghost" onClick={onResetLoans}>Reset demo loans</button>
        <button className="btn ghost" onClick={onExportCsv}>Export CSV</button>
      </div>

      <div style={{ marginTop: '12px' }}>
        <label>One-time prepayment to apply (₹)</label>
        <input
          type="number"
          value={prepayAmount}
          onChange={e => onPrepayChange(Number(e.target.value))}
          style={{ width: '160px', marginLeft: '8px' }}
        />
      </div>
    </div>
  );
}
