import React from 'react';
import { Outlet } from 'react-router-dom'; // Importa o Outlet
import Header from './components/Header';   // Importa nosso novo Header

function App() {
  return (
    // 'container' centraliza, 'mt-4' dá margem
    <div className="container mt-4">
      <div className="row">
        {/* 'col-md-10' e 'mx-auto' centraliza o conteúdo */}
        <div className="col-lg-10 col-xl-10 mx-auto">
          
          {/* 1. O Header com os links de navegação */}
          <Header />
          
          <main>
            {/* 2. O React Router renderiza o LmcForm OU o Relatorio aqui */}
            <Outlet />
          </main>
          
          <footer className="mt-5 text-center text-muted">
            <p>&copy; {new Date().getFullYear()} Seu Sistema LMC</p>
          </footer>

        </div>
      </div>
    </div>
  );
}

export default App;