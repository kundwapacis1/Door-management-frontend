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
  // State to manage the visibility of the mobile menu
  const [isOpen, setIsOpen] = useState(false);

  return (
    // Outer container for the header, applying the dark background
    <header className="bg-gray-900 shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title Section */}
          <div className="flex-shrink-0">
            <a href="/" className="text-white text-xl font-semibold tracking-wider">
              Smart Door Manager
            </a>
          </div>

          {/* Desktop Navigation Links (Visible on large screens) */}
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.to}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </nav>

          {/* Mobile Menu Button (Visible on small screens) */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed (Hamburger) */}
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                /* Icon when menu is open (X or Close) */
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel (Hidden by default, shown when isOpen is true) */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;