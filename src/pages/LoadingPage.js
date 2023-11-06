// LoadingPage.js
import React from 'react';
import '../spinner.css'; // Make sure to import the CSS file

const LoadingPage = () => {
  const loadingStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    flexDirection: 'column',
  };

  return (
    <div style={loadingStyle}>
      <div className="spinner"></div> {/* Add the spinner */}
      <h2>Loading...</h2>
    </div>
  );
};

export default LoadingPage;
