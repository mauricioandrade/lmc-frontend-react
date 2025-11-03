import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#161b22',
            color: '#c9d1d9',
            border: '1px solid #30363d',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#238636',
              secondary: '#ffffff',
            },
            style: {
              background: '#1f3c2e',
              border: '1px solid #38704f',
              color: '#7bff9d',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#da3633',
              secondary: '#ffffff',
            },
            style: {
              background: '#3c1f1f',
              border: '1px solid #8b3838',
              color: '#ff7b7b',
            },
          },
        }}
      />

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
