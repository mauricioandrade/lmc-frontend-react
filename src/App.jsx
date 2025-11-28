import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import { defaultToastOptions } from './config/toastConfig';
import './App.css';

function App() {
  return (
    <>
      <Toaster {...defaultToastOptions} />
      <div className="app-shell">
        <div className="app-gradient" aria-hidden="true" />
        <div className="app-container">
          <Header />
          <main className="app-main" role="main">
            <Outlet />
          </main>
          <footer className="app-footer">
            <p className="app-footer__copyright">
              &copy; {new Date().getFullYear()} Kairo LMC
            </p>
         <p className="app-footer__tagline">
  Kairo LMC - Desenvolvido por{" "}
  <a
    href="https://github.com/mauricioandrade"
    target="_blank"
    rel="noopener noreferrer"
  >
    Mauricio Andrade
  </a>
</p>
          </footer>
        </div>
      </div>
    </>
  );
}

export default App;
