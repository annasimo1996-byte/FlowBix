import { useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthContext } from './context/AuthContext'

// Importiamo le pagine
import LoginPage from './pages/LoginPage'
import DashboardView from './pages/DashboardView'
import ClientiView from './pages/ClientiView'
import AppuntamentiView from './pages/AppuntamentiView'
import SpeseRicaviView from './pages/FinanzeView'

import AppLayout from './layout/AppLayout'

function App() {
  const { isLogged } = useContext(AuthContext)

  return (
    <BrowserRouter>
      <Routes>
        
        {/* ROTTA DI LOGIN*/}
        <Route 
          path="/login" 
          element={isLogged ? <Navigate to="/" /> : <LoginPage />} 
        />

        {/* CONTENITORE DELLE ROTTE PROTETTE: 
           
        */}
        <Route 
          element={isLogged ? <AppLayout /> : <Navigate to="/login" />}
        >
          <Route path="/" element={<DashboardView />} />
          <Route path="/clienti" element={<ClientiView />} />
          <Route path="/appuntamenti" element={<AppuntamentiView />} />
          <Route path="/spese-ricavi" element={<SpeseRicaviView />} />
        </Route>

        {/* Rotta di fallback*/}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App