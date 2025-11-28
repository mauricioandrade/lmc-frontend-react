import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.css';

const NAV_ITEMS = [
  { to: '/', label: 'Formulário' },
  { to: '/relatorio', label: 'Relatório' },
  { to: '/config/produtos', label: 'Produtos' },
  { to: '/config/tanques', label: 'Tanques' },
  { to: '/config/bicos', label: 'Bicos' },
  { to: '/config/empresas', label: 'Empresas' },
];

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinkClassName = ({ isActive }) =>
    `app-navbar__link${isActive ? ' is-active' : ''}`;

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="app-navbar__wrapper">
      <nav className="app-navbar" aria-label="Navegação principal">
        <div className="app-navbar__brand-group">
          <Link className="app-navbar__brand" to="/">
            <span className="app-navbar__brand-badge">K</span>
            <span className="app-navbar__brand-text">Kairo LMC</span>
          </Link>
        </div>

        <button
          type="button"
          className="app-navbar__toggler"
          aria-label="Alternar menu de navegação"
          aria-expanded={isMenuOpen}
          onClick={toggleMenu}
        >
          <span className="app-navbar__toggler-bar" />
          <span className="app-navbar__toggler-bar" />
          <span className="app-navbar__toggler-bar" />
        </button>

        <div className={`app-navbar__menu${isMenuOpen ? ' is-open' : ''}`}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={navLinkClassName}
              onClick={closeMenu}
            >
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}

export default Header;