import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/globals.css';

// Intercept browser refresh/load to always start at the home page
// This applies only when the application completely reloads (e.g., F5 refresh)
// Client-side React Router navigation will operate normally without hitting this code.
if (window.location.pathname !== '/' || window.location.hash !== '') {
  window.history.replaceState(null, '', '/');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
