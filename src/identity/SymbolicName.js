import React from 'react';

const SymbolicName = ({ name }) => {
  return (
    <div className="symbolic-name">
      <span className="symbol">§</span>
      <span className="name">({name})</span>
    </div>
  );
};

export default SymbolicName;
