import React from 'react';
import './Tube.scss';

const Tube = ({ tube, onClick, isSelected }) => {
  return (
    <div className={`tube ${isSelected ? 'selected' : ''}`} onClick={onClick}>
      <div className="tube__contents">
        {tube.slice().reverse().map((color, index) => (
          <div key={index} className={`water ${color}`} style={{ height: '25%' }}></div>
        ))}
      </div>
      <div className="tube__outer-glass"></div>
    </div>
  );
};

export default Tube;
