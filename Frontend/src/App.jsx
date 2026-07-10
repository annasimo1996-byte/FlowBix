import { useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthContext } from './context/AuthContext'

import LoginPage from './pages/LoginPage'
import DashboardView from './pages/DashboardView'
import ClientsView from './pages/ClientsView'
import AppuntamentiView from './pages/AppuntamentiView'
import SpeseRicaviView from './pages/FinanzeView'
//import ResetPasswordPage from "./pages/ResetPasswordPage"

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
          <Route path="/clients" element={<ClientsView />} />
          <Route path="/appuntamenti" element={<AppuntamentiView />} />
          <Route path="/spese-ricavi" element={<SpeseRicaviView />} />
        </Route>

        {/* Rotta di fallback*/}
        <Route path="*" element={<Navigate to="/" />} />

        {/*<Route path="/reset-password" element={<ResetPasswordPage />} />*/}
        
      </Routes>
    </BrowserRouter>
  )
}

export default App