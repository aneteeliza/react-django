import React from 'react';

const ResultDetail = ({ detail, onClose }) => {
  if (!detail) return null;

  return (
    <div className="modal">
      <h2>{detail.name}</h2>
      <p>Birthdate: {detail.birthdate}</p>
      <p>Service Details: {detail.serviceDetails}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default ResultDetail;
