import React from 'react';

export default function Summary({ totalOutstanding, totalEmi, dti }) {
  return (
    <div className="card">
      <h3>Summary</h3>
      <div className="summary-row">
        <div className="chip">Total outstanding: ₹{totalOutstanding.toLocaleString('en-IN')}</div>
        <div className="chip">Total EMI: ₹{totalEmi.toLocaleString('en-IN')}</div>
        <div className="chip">DTI: {dti.toFixed(1)}%</div>
      </div>
      <div style={{ marginTop: '10px' }} className="small muted">
        Debt-to-Income (DTI) = Total monthly EMI / Monthly income
      </div>
    </div>
  );
}
