import React from 'react';

export default function LoanTable({ loans, onUpdateLoan, onRemoveLoan }) {
  const handleChange = (id, field, value) => {
    onUpdateLoan(id, field, value);
  };

  return (
    <div className="card">
      <h3>Loans</h3>
      <div className="loans-list">
        <table>
          <thead>
            <tr>
              <th>Loan</th>
              <th>Balance (₹)</th>
              <th>Rate % p.a.</th>
              <th>EMI ₹</th>
              <th>Tenure mo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan.id}>
                <td>
                  <input
                    value={loan.name}
                    onChange={(e) => handleChange(loan.id, 'name', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={loan.balance}
                    onChange={(e) => handleChange(loan.id, 'balance', Number(e.target.value))}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    step="0.01"
                    value={loan.rate}
                    onChange={(e) => handleChange(loan.id, 'rate', Number(e.target.value))}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={loan.emi}
                    onChange={(e) => handleChange(loan.id, 'emi', Number(e.target.value))}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={loan.tenure}
                    onChange={(e) => handleChange(loan.id, 'tenure', Number(e.target.value))}
                  />
                </td>
                <td>
                  <button className="btn ghost" onClick={() => onRemoveLoan(loan.id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: '8px' }} className="small muted">
        Add all debts (credit cards, personal loans, auto, home). Use realistic remaining balances and EMIs.
      </div>
    </div>
  );
