import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from 'react-hot-toast'; 

// Importa os componentes
import App from './App.jsx';
import LmcForm from './components/LmcForm.jsx'; 
import Relatorio from './components/Relatorio.jsx'; 
import PaginaProdutos from './components/PaginaProdutos.jsx';
import PaginaTanques from './components/PaginaTanques.jsx'; 
import PaginaBicos from './components/PaginaBicos.jsx'; 
import PaginaEmpresa from './components/PaginaEmpresa.jsx'; // <-- 1. IMPORTE A NOVA PÁGINA

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'; // Mantenha seu CSS global se tiver

// 1. Define o "roteador"
const router = createBrowserRouter([
  {
    path: "/",          
    element: <App />,     
    children: [
      {
        index: true, 
        element: <LmcForm />, 
      },
      {
        path: "relatorio", 
        element: <Relatorio />, 
      },
      {
        path: "config/produtos", 
        element: <PaginaProdutos />, 
      },
      {
        path: "config/tanques", 
        element: <PaginaTanques />, 
      },
      {
        path: "config/bicos", // A URL
        element: <PaginaBicos />, // O componente
      },
      // --- 2. ADICIONE A NOVA ROTA AQUI ---
      {
        path: "config/empresas", // A URL (ex: localhost:5173/config/empresas)
        element: <PaginaEmpresa />, // O componente
      },
    ],
  },
]);

// 2. Renderiza o "Provedor de Rotas"
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Você pode mover seu Toaster para cá, para que ele funcione em todas as páginas */}
    <Toaster
      position="top-right"
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
    <RouterProvider router={router} />
  </React.StrictMode>,
)