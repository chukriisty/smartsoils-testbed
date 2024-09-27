import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          {/* Use direct URL path for logo image */}
          <img src="https://smartsoils-testbed.s3.amazonaws.com/assets/logo-blue.png" alt="Berkeley Lab Logo" />
        </Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/">HOME</Link>
        </li>
        <li>
          <Link to="/data-visualization">DATA VISUALIZATION</Link>
        </li>
        <li>
          <Link to="/science">SCIENCE</Link>
        </li>
        <li>
          <Link to="/contact">CONTACT</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
