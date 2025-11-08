import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import { defaultToastOptions } from './config/toastConfig';

function App() {
  return (
    <>
      <Toaster {...defaultToastOptions} />
      <div className="container mt-4">
        <div className="row">
          <div className="col-lg-10 col-xl-10 mx-auto">
            <Header />
            <main>
              <Outlet />
            </main>
            <footer className="mt-5 text-center text-muted">
              <p>&copy; {new Date().getFullYear()} Seu Sistema LMC</p>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
