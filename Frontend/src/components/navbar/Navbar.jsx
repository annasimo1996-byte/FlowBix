import React, { useState, useEffect, useRef, useContext } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import './Navbar.css'

function Navbar({ onToggleSidebar }) {
  const location = useLocation()
  const { user, logout } = useContext(AuthContext)
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
      case '/profile':
        return 'Profile'
      default:
        return 'FlowBix'
    }
  }
  const currentUserName = user ? `${user.firstName} ${user.lastName}` : 'User'

  //Iniziali utente
  const getInitials = (firstName, lastName) => {
    if (!firstName || !lastName) return 'U'
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }

  return (
    <header className="navbarContainer">

      {/* Menu Hamburger */}
      <div className="navbarLeftSection">
        <button className="hamburgerBtn" onClick={onToggleSidebar} title="Apri menu">
          <i className="bi bi-list" />
        </button>
        <h1 className="navbarTitle">{getPageTitle(location.pathname)}</h1>
      </div>
      
      {/* Informazioni utente */}
      <div className="navbarRight">
        
        {/* Contenitore Dropdown */}
        <div className="userDropdownWrapper" ref={dropdownRef}>

          <div className="userDropdownTrigger"
            onClick={() => setDropdownOpen((prev) => !prev)}>

            <div className="avatarCircle">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={currentUserName}
                  className="avatarImage"
                />
              ) : (
                <span>{getInitials(user?.firstName, user?.lastName)}</span>
              )}
            </div>

            {/* Nome utente dinamico */}
            <div className="userInfoText">
              <span className="userProfileName">{currentUserName}</span>
            </div>

            <i className={`bi bi-chevron-down dropdownArrow transitionArrow ${dropdownOpen ? 'rotate' : ''}`} />
          </div>

          {/* Menu Dropdown */}
          {dropdownOpen && (
            <div className="customDropdownMenu">
              <div className="dropdownHeaderResponsive">
                <div className="dropdownUserName">{currentUserName}</div>
                <hr className="dropdownMenuDivider" />
              </div>
              <Link
                to="/profile"
                className="dropdownItem"
                onClick={() => setDropdownOpen(false)}
              >
                <i className="bi bi-person me-2" /> Profile
              </Link>
              <hr className="dropdownDivider" />
              {/*logout */}
              <button className="dropdownItem logoutItem" onClick={logout}>
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