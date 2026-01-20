import React from 'react';

const BreadcrumbScore = ({ score }) => {
  return (
    <div className="breadcrumb-score">
      <div className="score-label">Breadcrumb Score</div>
      <div className="score-value">{score}</div>
      <div className="score-bar">
        <div 
          className="score-fill" 
          style={{ width: `${Math.min(score, 100)}%` }}
        />
      </div>
    </div>
  );
};

export default BreadcrumbScore;
