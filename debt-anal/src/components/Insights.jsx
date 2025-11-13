import React from 'react';

export default function Insights({ insights }) {
  return (
    <div className="card">
      <h3>Insights & Suggestions</h3>
      <div dangerouslySetInnerHTML={{ __html: insights.join('<br/>') }} />
    </div>
  );
}
