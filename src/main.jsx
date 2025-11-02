import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Importa os componentes
import App from './App.jsx';
import LmcForm from './components/LmcForm.jsx';
import Relatorio from './components/Relatorio.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'; // Mantenha seu CSS global se tiver

// 1. Define o "roteador"
const router = createBrowserRouter([
  {
    path: "/",          // A URL base (ex: localhost:5173/)
    element: <App />,   // Sempre renderiza o 'App' (nosso layout com header e footer)
    children: [
      {
        index: true, // A rota "index" (padrão)
        element: <LmcForm />, // Mostra o formulário na home
      },
      {
        path: "relatorio", // A URL (ex: localhost:5173/relatorio)
        element: <Relatorio />, // Mostra o componente de relatório
      },
    ],
  },
]);

// 2. Renderiza o "Provedor de Rotas"
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)