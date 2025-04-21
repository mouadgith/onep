import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import logoImage from '../image/logo.png';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [click, setClick] = useState(false);
  const [sidebarClosed, setSidebarClosed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleSidebar = () => {
    setSidebarClosed(!sidebarClosed);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark');
  };
  const handleClick = () => setClick(!click);
  const openPage = () => setClick(false);

  const handleCon = () => {
    navigate('/contact'); 
  };

  return (
    <nav className={`sidebar ${sidebarClosed ? 'close' : ''}`}>
      <header>
        <div className="image-text">
          <span className="image">
            <img src={logoImage} alt="Logo" />
          </span>
          <div className="text logo-text">
            <span className="name">ONEP</span>
            <span className="profession">Inventaire materiels</span>
          </div>
        </div>
        <i className='bi bi-caret-right-fill toggle' onClick={toggleSidebar} ></i>
      </header>
      
      <div className="menu-bar">
        <div className="menu">
          <ul className="menu-links p-0">
            <li className="nav-link">
              <Link to="/" onClick={openPage}>
                <i className='bi bi-person-fill icon'></i>
                <span className="text nav-text">Agent</span>
              </Link>
            </li>
            <li className="nav-link">
              <Link to="/materiels" onClick={openPage}>
                <i className='bi bi-pc-display icon'></i>
                <span className="text nav-text">Materiel</span>
              </Link>
            </li>
            <li className="nav-link">
              <Link to="/contrats" onClick={openPage}>
                <i className='bi bi-file-earmark-check-fill icon'></i>
                <span className="text nav-text">Contrats</span>
              </Link>
            </li>
            <li className="nav-link">
              <Link to="/parametrage" onClick={openPage}>
                <i className='bi bi-gear-fill icon'></i>
                <span className="text nav-text">Paramétrage</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

  );
};

export default Navbar;