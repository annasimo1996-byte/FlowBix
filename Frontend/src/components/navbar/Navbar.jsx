import React, { useState, useEffect, useRef, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import './Navbar.css'

function Navbar({ onToggleSidebar }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const { user, logout } = useContext(AuthContext)

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

  const fullName = user ? `${user.firstName} ${user.lastName}` : 'User'

  const getInitials = (firstName, lastName) => {
    if (!firstName && !lastName) return '??'
    const fLetter = firstName ? firstName[0] : ''
    const lLetter = lastName ? lastName[0] : ''
    return `${fLetter}${lLetter}`.toUpperCase()
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="navbarContainer">

      {/* Sinistra */}
      <div className="d-flex align-items-center gap-3">

        {/* Mobile */}
        <button
          className="btn text-white p-0 d-lg-none navbarMobileToggle"
          onClick={onToggleSidebar}
          title="Apri menu"
        >
          <i className="bi bi-list" />
        </button>

        <h1 className="navbarTitle mb-0 d-none d-lg-block">
          {getPageTitle(location.pathname)}
        </h1>

        {/* LOGO MOBILE */}
        <div className="d-flex align-items-center gap-2 d-lg-none">
          <span className="text-white fw-bold navbarLogoMobile">
            Flow<span className="navbarBrandPurple">Bix</span>
          </span>
        </div>
      </div>

      {/* Input di ricerca*/}
      <div className="navbarSearchWrapper d-none d-lg-block">
        <i className="bi bi-search navbarSearchIcon" />
        <input
          type="text"
          className="navbarSearchInput"
          placeholder="Search clients, appointments..."
        />
      </div>

      {/* Notifiche e informazioni utente */}
      <div className="navbarRight">

        {/* Pulsante notifiche */}
        <button className="notificationBtn" title="Notifiche">
          <i className="bi bi-bell-fill" />
          <span className="notificationBadge" />
        </button>

        {/* Contenitore Dropdown */}
        <div className="userDropdownWrapper" ref={dropdownRef}>

          <div className="userDropdownTrigger" onClick={() => setDropdownOpen(!dropdownOpen)}>

            <div className="avatarCircle">
              <span>{getInitials(user?.firstName, user?.lastName)}</span>
            </div>

            <div className="userInfoText d-none d-sm-flex flex-column">
              <span className="userProfileName">{fullName}</span>
            </div>

            <i className={`bi bi-chevron-down dropdownArrow d-none d-sm-block transitionArrow ${dropdownOpen ? 'rotate' : ''}`} />
          </div>

          {/* Menu Dropdown */}
          {dropdownOpen && (
            <div className="customDropdownMenu">
              <div className="dropdownHeader d-sm-none">
              
                <div className="fw-semibold text-white">{fullName}</div>
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