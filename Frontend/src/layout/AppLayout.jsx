import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Offcanvas } from 'react-bootstrap' 
import './AppLayout.css'
import Sidebar from '../components/sidebar/Sidebar'
import Navbar from '../components/navbar/Navbar'

function AppLayout() {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)

  const handleToggleSidebar = () => setShowMobileSidebar(!showMobileSidebar)
  const handleCloseSidebar = () => setShowMobileSidebar(false)

  return (
    <div className="screenContainer">

      {/* SIDEBAR DESKTOP*/}
      <div className="d-none d-lg-block">
        <Sidebar />
      </div>

      {/* SIDEBAR MOBILE*/}
      <Offcanvas
        show={showMobileSidebar}
        onHide={handleCloseSidebar}
        responsive="lg"
        className="text-white p-0 d-lg-none custom-mobile-offcanvas"
      >
        <Offcanvas.Body className="p-0 d-flex flex-column mobile-sidebar-body">

          <div className="d-flex align-items-center gap-2 px-3 pt-3 pb-2 w-100">
            <div className="navbarSearchWrapper m-0 flex-grow-1">
              <i className="bi bi-search navbarSearchIcon" />
              <input
                type="text"
                className="navbarSearchInput"
                placeholder="Search..."
              />
            </div>
            <button 
              type="button" 
              className="btn-close btn-close-white mobile-close-btn" 
              onClick={handleCloseSidebar}
              aria-label="Close"
            />
          </div>
          <Sidebar onItemClick={handleCloseSidebar}/>
          
        </Offcanvas.Body>
      </Offcanvas>

      <div className="rightContentWrapper">
        <Navbar onToggleSidebar={handleToggleSidebar} />

        <main className="pageDynamicArea">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout