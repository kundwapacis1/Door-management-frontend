import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Define the type for the navigation links
interface NavLink {
  name: string;
  to: string;
}

// Define the links for the header
const getNavLinks = (isAuthenticated: boolean, userRole?: string): NavLink[] => {
  const baseLinks = [
  { name: 'Home', to: '/' },
  { name: 'About', to: '/' },
  { name: 'Contact', to: '/' },
  ];

  if (isAuthenticated) {
    // Add dashboard link based on role
    if (userRole === 'admin') {
      baseLinks.push({ name: 'Admin Dashboard', to: '/admindashboard' });
    } else {
      baseLinks.push({ name: 'Dashboard', to: '/userdashboard' });
    }
    baseLinks.push({ name: 'Logout', to: '/logout' });
  } else {
    baseLinks.push({ name: 'Login', to: '/login' });
  }

  return baseLinks;
};

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  // Function to handle smooth scrolling to sections
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  // Function to handle navigation clicks
  const handleNavClick = (link: NavLink) => {
    if (link.name === 'Home' || link.name === 'About' || link.name === 'Contact') {
      // If we're on the landing page, scroll to section
      if (location.pathname === '/') {
        let sectionId = '';
        if (link.name === 'Home') sectionId = 'hero-section';
        else if (link.name === 'About') sectionId = 'about-section';
        else if (link.name === 'Contact') sectionId = 'contact-section';
        
        scrollToSection(sectionId);
      } else {
        // If we're on another page, navigate to home first, then scroll
        let sectionId = '';
        if (link.name === 'Home') sectionId = 'hero-section';
        else if (link.name === 'About') sectionId = 'about-section';
        else if (link.name === 'Contact') sectionId = 'contact-section';
        
        window.location.href = `/#${sectionId}`;
      }
    }
  };

  const headerStyle: React.CSSProperties = {
    background: "#154576", // Primary color from contact section
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
          {getNavLinks(isAuthenticated, user?.role).map((link) => (
            <Link 
              key={link.name} 
              to={link.to} 
              style={navLinkStyle}
              onClick={(e) => {
                if (link.name === 'Home' || link.name === 'About' || link.name === 'Contact') {
                  e.preventDefault();
                  handleNavClick(link);
                } else if (link.name === 'Logout') {
                  e.preventDefault();
                  logout();
                }
              }}
            >
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
          {getNavLinks(isAuthenticated, user?.role).map((link) => (
            <Link 
              key={link.name} 
              to={link.to} 
              style={navLinkStyle}
              onClick={(e) => {
                if (link.name === 'Home' || link.name === 'About' || link.name === 'Contact') {
                  e.preventDefault();
                  handleNavClick(link);
                  setIsOpen(false); // Close mobile menu after click
                } else if (link.name === 'Login') {
                  setIsOpen(false); // Close mobile menu after clicking Login
                } else if (link.name === 'Logout') {
                  e.preventDefault();
                  logout();
                  setIsOpen(false);
                } else {
                  setIsOpen(false); // Close mobile menu for other links
                }
              }}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
