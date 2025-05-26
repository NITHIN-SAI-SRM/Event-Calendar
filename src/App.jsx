import React from 'react';
import Calendar from './components/Calendar';

const App = () => {
  return (
    <div
      style={{
        maxWidth: '900px',
        margin: '2rem auto',
        padding: '1rem',
        background: '#f4f4f4',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <Calendar />
     
    </div>
  );
};

export default App;