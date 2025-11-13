import React from 'react';

export default function StrategySelector({ strategy, onChange }) {
  return (
    <div className="card">
      <h3>Strategies</h3>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <label>
          <input
            type="radio"
            name="strategy"
            value="snowball"
            checked={strategy === 'snowball'}
            onChange={onChange}
          />
          Snowball (smallest balance first)
        </label>
        <label>
          <input
            type="radio"
            name="strategy"
            value="avalanche"
            checked={strategy === 'avalanche'}
            onChange={onChange}
          />
          Avalanche (highest rate first)
        </label>
      </div>
      <div style={{ marginTop: '8px' }} className="small muted">
        Simulation will apply the prepayment to selected priority loan and roll freed-up EMI amounts into next targets.
      </div>
    </div>
  );
}
