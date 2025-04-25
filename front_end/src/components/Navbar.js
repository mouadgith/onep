import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoImage from '../image/logo.png';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Navbar.css';

const Navbar = ({ auth, logout }) => {
  const [sidebarClosed, setSidebarClosed] = React.useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarClosed(!sidebarClosed);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`sidebar ${sidebarClosed ? 'close' : ''}`}>
      <header>
        <div className="image-text">
          <span className="image">
            <img src={logoImage} alt="Logo" />
          </span>
          <div className="text logo-text">
            <span className="name">ONEP</span>
            <span className="profession">Inventaire matériels</span>
          </div>
        </div>
        <i className='bi bi-caret-right-fill toggle' onClick={toggleSidebar}></i>
      </header>
      
      <div className="menu-bar">
        <div className="menu">
          <ul className="menu-links p-0">
            <li className="nav-link">
              <Link to="/" className={isActive('/') ? 'active' : ''}>
                <i className='bi bi-house-fill icon'></i>
                <span className="text nav-text">Accueil</span>
              </Link>
            </li>
            <li className="nav-link">
              <Link to="/agents" className={isActive('/agents') ? 'active' : ''}>
                <i className='bi bi-person-fill icon'></i>
                <span className="text nav-text">Agent</span>
              </Link>
            </li>
            <li className="nav-link">
              <Link to="/materiels" className={isActive('/materiels') ? 'active' : ''}>
                <i className='bi bi-pc-display icon'></i>
                <span className="text nav-text">Matériel</span>
              </Link>
            </li>
            <li className="nav-link">
              <Link to="/contrats" className={isActive('/contrats') ? 'active' : ''}>
                <i className='bi bi-file-earmark-check-fill icon'></i>
                <span className="text nav-text">Contrats</span>
              </Link>
            </li>
            <li className="nav-link">
              <Link to="/archive" className={isActive('/archive') ? 'active' : ''}>
                <i className='bi bi-archive-fill icon'></i>
                <span className="text nav-text">Archive</span>
              </Link>
            </li>
            {auth?.type === 'admin' && (
              <li className="nav-link">
                <Link to="/parametrage" className={isActive('/parametrage') ? 'active' : ''}>
                  <i className='bi bi-gear-fill icon'></i>
                  <span className="text nav-text">Paramétrage</span>
                </Link>
              </li>
            )}
          </ul>
        </div>

        <div className="bottom-content">
          <li className="nav-link">
            <button onClick={logout} className="logout-btn">
              <i className='bi bi-box-arrow-left icon'></i>
              <span className="text nav-text">Déconnexion</span>
            </button>
          </li>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
