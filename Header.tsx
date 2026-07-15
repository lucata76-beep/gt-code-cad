import React from 'react';

interface HeaderProps {
  version?: string;
}

const Header: React.FC<HeaderProps> = ({ version = '1.0.0' }) => (
  <header className="header">
    <div className="logo">
      <div className="logo-icon glow-effect">GT</div>
      <span className="logo-text">.Code</span>
    </div>
    <div className="version">v{version}</div>
  </header>
);

export default Header;
