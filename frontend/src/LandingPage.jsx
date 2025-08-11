import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css'; 


const LandingPage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/analyze');
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    //   background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: 'white',
      flexDirection: 'column'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Welcome to Sentiment Analyzer</h1>
      <p style={{ marginBottom: '2rem' }}>Get real-time emotion insights from your text!</p>
      <button
        onClick={handleStart}
        style={{
          padding: '1rem 2rem',
          backgroundColor: '#6C47FF',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1.2rem',
          cursor: 'pointer',
          color: 'white',
          boxShadow: '0px 5px 15px rgba(0,0,0,0.2)'
        }}
      >
        Let’s Get Started 🚀
      </button>
    </div>
  );
};

export default LandingPage;
