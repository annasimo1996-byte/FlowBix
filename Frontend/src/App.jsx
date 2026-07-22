import { useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthContext } from './context/AuthContext'

import LoginPage from './pages/LoginPage'
import ProfileView from "./pages/ProfileView"
import DashboardView from './pages/DashboardView'
import ClientsView from './pages/ClientsView'
import AppointmentsView from './pages/AppointmentsView'
import FinanceView from './pages/FinanceView'

import AppLayout from './layout/AppLayout'

function AppShellSkeleton() {
  return (
    <div className="screenContainer">
      <div className="rightContentWrapper">
        <main className="pageDynamicArea" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff' }}>
          <p>Loading...</p>
        </main>
      </div>
    </div>
  )
}

function ProtectedShell() {
  const { isLogged, isBootstrapped, authStatus } = useContext(AuthContext)

  if (!isBootstrapped && !isLogged) {
    return <AppShellSkeleton />
  }

  if (isLogged) {
    return <AppLayout authStatus={authStatus} />
  }

  return <Navigate to="/login" replace />
}

function App() {
  const { isLogged } = useContext(AuthContext)

  return (
    <BrowserRouter>
      <Routes>
        {/* ROTTA DI LOGIN */}
        <Route
          path="/login"
          element={isLogged ? <Navigate to="/" replace /> : <LoginPage />}
        />

        {/* CONTENITORE DELLE ROTTE PROTETTE */}
        <Route element={<ProtectedShell />}>
          <Route path="/profile" element={<ProfileView />} />
          <Route path="/" element={<DashboardView />} />
          <Route path="/clients" element={<ClientsView />} />
          <Route path="/appointments" element={<AppointmentsView />} />
          <Route path="/finance" element={<FinanceView />} />
        </Route>

        {/* Rotta di fallback  */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App