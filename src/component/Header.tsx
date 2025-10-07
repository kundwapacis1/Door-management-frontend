import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Define the type for the navigation links
interface NavLink {
  name: string;
  to: string;
}

// Define the links for the header
const navLinks: NavLink[] = [
  { name: 'Home', to: '/' },
  { name: 'About', to: '/' },
  { name: 'Contact', to: '/' },
  { name: 'Login', to: '/login' },
];

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const headerStyle: React.CSSProperties = {
    background: "#2c3e50", // Same as sidebar background
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    position: "fixed",
    width: "100%",
    zIndex: 50,
  };

  const navLinkStyle: React.CSSProperties = {
    color: "#fff",
    padding: "10px",
    borderRadius: "5px",
    textDecoration: "none",
    fontWeight: "bold",
  };

  

  return (
    <header style={headerStyle}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px" }}>
        {/* Logo/Title */}
        <div style={{ color: "#fff", fontSize: "20px", fontWeight: "bold" }}>
          Smart Door Manager
        </div>

        {/* Desktop Navigation */}
        <nav style={{ display: "flex", gap: "15px" }}>
          {navLinks.map((link) => (
            <Link key={link.name} to={link.to} style={navLinkStyle}>
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <div style={{ display: "none" /* Show with media queries if needed */ }}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              background: "#34495e",
              padding: "8px",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
            }}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div style={{ display: "flex", flexDirection: "column", padding: "10px" }}>
          {navLinks.map((link) => (
            <Link key={link.name} to={link.to} style={navLinkStyle}>
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
