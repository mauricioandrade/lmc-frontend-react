import React from 'react';
import { Link, NavLink } from 'react-router-dom';

function Header() {
  
  // Estilo customizado para o NavLink
  const navLinkStyle = ({ isActive }) => ({
    color: isActive ? '#ffffff' : '#c9d1d9',
    fontWeight: isActive ? 'bold' : 'normal',
    paddingBottom: '5px',
    borderBottom: isActive ? '2px solid #1f6feb' : '2px solid transparent',
    textDecoration: 'none'
  });

  return (
    <nav 
      className="navbar navbar-expand-lg navbar-dark mb-4 shadow-sm rounded-4"
      style={{
        backgroundColor: '#161b22', 
        border: '1px solid #30363d'
      }}
    >
      <div className="container-fluid" style={{ maxWidth: '900px' }}>
        
        <Link className="navbar-brand fw-bold" to="/" style={{ color: '#58a6ff' }}>
          Sistema LMC
        </Link>
        
        <div className="navbar-nav d-flex flex-row gap-4">
          <NavLink className="nav-link" to="/" style={navLinkStyle}>
            Formulário
          </NavLink>
          <NavLink className="nav-link" to="/relatorio" style={navLinkStyle}>
            Relatório
          </NavLink>
          <NavLink className="nav-link" to="/config/produtos" style={navLinkStyle}>
            Produtos
          </NavLink>
          <NavLink className="nav-link" to="/config/tanques" style={navLinkStyle}>
            Tanques
          </NavLink>
          <NavLink className="nav-link" to="/config/bicos" style={navLinkStyle}>
            Bicos
          </NavLink>
          
          {/* --- NOVO LINK ADICIONADO --- */}
          <NavLink 
            className="nav-link" 
            to="/config/empresas" // Rota para a nova página
            style={navLinkStyle} 
          >
            Empresas
          </NavLink>
          {/* --- FIM DA MUDANÇA --- */}

        </div>
      </div>
    </nav>
  );
}

export default Header;