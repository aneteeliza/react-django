import React from 'react';

const ResultsList = ({ results, onSelect }) => (
  <ul>
    {results.map((result, index) => (
      <li key={index} onClick={() => onSelect(result)}>
        {result.name} - {result.birthdate}
      </li>
    ))}
  </ul>
);

export default ResultsList;
