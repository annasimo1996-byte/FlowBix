import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
// Cerca questo file nel tuo progetto (es. src/main.jsx) e aggiungi questa riga in cima:
import 'bootstrap-icons/font/bootstrap-icons.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)