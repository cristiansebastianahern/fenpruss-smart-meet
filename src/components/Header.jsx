import React from 'react';

const Header = ({ theme, toggleTheme }) => {
  return (
    <header className="header">
      <h1>FENPRUSS Smart Meet</h1>
      <button 
        onClick={toggleTheme}
        className="theme-toggle"
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </header>
  );
};

export default Header;