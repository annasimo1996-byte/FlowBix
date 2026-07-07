import React, { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import './Navbar.css' 

function Navbar() {
  const location = useLocation()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/':
      case '/dashboard':
        return 'Home'
      case '/clients':
        return 'Clients'
      case '/appointments':
        return 'Appointments'
      case '/finance':
        return 'Finance'
      case '/settings':
        return 'Settings'
      default:
        return 'FlowBix' 
    }
  }

  const mockUser = {
    name: 'Anna Moreau',
    role: 'Pro plan',
    avatarUrl: null 
  }

  const getInitials = (name) => {
    if (!name) return '??'
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  const handleLogout = () => {
    console.log("Esecuzione logout...")
    // Collegamento della funzione AuthContext
  }

  return (
    <header className="navbarContainer">
      
      {/*Titolo della pagina*/}
      <div>
        <h1 className="navbarTitle">{getPageTitle(location.pathname)}</h1>
      </div>

      {/*Input di ricerca*/}
      <div className="navbarSearchWrapper">
        <i className="bi bi-search navbarSearchIcon" />
        <input 
          type="text" 
          className="navbarSearchInput" 
          placeholder="Search clients, appointments..." 
        />
      </div>

      {/*Notifiche e informazioni utente */}
      <div className="navbarRight">
        
        {/* Pulsante notifiche */}
        <button className="notificationBtn" title="Notifiche">
          <i className="bi bi-bell-fill" />
          <span className="notificationBadge" />
        </button>

        {/* Contenitore Dropdown con Ref di controllo */}
        <div className="userDropdownWrapper" ref={dropdownRef}>
        
          <div className="userDropdownTrigger" onClick={() => setDropdownOpen(!dropdownOpen)}>
            
            
            <div className="avatarCircle">
              {mockUser.avatarUrl ? (
                <img 
                  src={mockUser.avatarUrl} 
                  alt={mockUser.name} 
                  className="avatarImage" 
                />
              ) : (
                <span>{getInitials(mockUser.name)}</span>
              )}
            </div>

            {/* Nome  e ruolo */}
            <div className="userInfoText d-none d-sm-flex flex-column">
              <span className="userProfileName">{mockUser.name}</span>
              <span className="userProfileRole">{mockUser.role}</span>
            </div>

            <i className={`bi bi-chevron-down dropdownArrow d-none d-sm-block transitionArrow ${dropdownOpen ? 'rotate' : ''}`} />
          </div>

          {/* Menu Dropdown */}
          {dropdownOpen && (
            <div className="customDropdownMenu">
              <div className="dropdownHeader d-sm-none">
                <div className="fw-semibold text-white">{mockUser.name}</div>
                <div className="small text-muted">{mockUser.role}</div>
                <hr className="my-2 border-secondary" />
              </div>
              <button className="dropdownItem">
                <i className="bi bi-person me-2" /> Profile
              </button>
              <button className="dropdownItem">
                <i className="bi bi-gear me-2" /> Settings
              </button>
              <hr className="dropdownDivider" />
              <button className="dropdownItem logoutItem" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2" /> Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  )
}

export default Navbar