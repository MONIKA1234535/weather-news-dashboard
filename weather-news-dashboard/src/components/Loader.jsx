import React from 'react';

// A simple, centered spinning loader component.
export default function Loader({ message = "Loading data..." }) {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
}