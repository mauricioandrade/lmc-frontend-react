import React from 'react';
import { Link, NavLink } from 'react-router-dom';

function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark rounded mb-4 shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          LMC App
        </Link>

        <div className="navbar-nav">
          <NavLink className="nav-link" to="/">
            Formulário
          </NavLink>
          <NavLink className="nav-link" to="/relatorio">
            Relatório
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Header;
