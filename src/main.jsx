import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import LmcForm from './components/LmcForm.jsx';
import Relatorio from './components/Relatorio.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <LmcForm />,
      },
      {
        path: 'relatorio',
        element: <Relatorio />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
