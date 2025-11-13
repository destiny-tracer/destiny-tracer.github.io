import React from 'react';

export default function Timeline({ timeline }) {
  return (
    <div className="card">
      <h3>Plan Timeline (first 24 months)</h3>
      <pre>
        {timeline.length === 0
          ? '—'
          : timeline
              .map(
                (t) =>
                  `M${t.month}: Remaining ₹${Math.round(t.totalOutstanding).toLocaleString(
                    'en-IN'
                  )} | EMI ₹${Math.round(t.totalEmi).toLocaleString('en-IN')}`
              )
              .join('\n')}
      </pre>
    </div>
  );
}
