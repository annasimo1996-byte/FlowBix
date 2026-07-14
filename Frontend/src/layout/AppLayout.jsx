import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import './AppLayout.css'
import Sidebar from '../components/sidebar/Sidebar'
import Navbar from '../components/navbar/Navbar'

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  return (
    <div className="screenContainer">

      {/* Stato e funzione di chiusura sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <div className="rightContentWrapper">

        {/* Funzione di attivazione alla navbar */}
        <Navbar onToggleSidebar={toggleSidebar} />

        {/* Area dinamica delle viste */}
        <main className="pageDynamicArea">
          <Outlet />
        </main>

      </div>
    </div>
  )
}

export default AppLayout