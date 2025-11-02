import React from 'react';
import { Link, NavLink } from 'react-router-dom';

function Header() {
  return (
    // Navbar dark do Bootstrap
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark rounded mb-4 shadow-sm">
      <div className="container-fluid">
        
        {/* Link para a Home (Formulário) */}
        <Link className="navbar-brand" to="/">
          LMC App
        </Link>
        
        {/* Links de Navegação */}
        <div className="navbar-nav">
          {/* NavLink é especial: ele adiciona a classe 'active' se a URL for a atual */}
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