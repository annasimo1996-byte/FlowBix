import { NavLink } from 'react-router-dom'
import './Sidebar.css'
import Logo from '../brand/Logo' 

const MENU_ITEMS = [
  { path: '/', label: 'Home', icon: 'bi-grid-1x2-fill' },
  { path: '/clienti', label: 'Clients', icon: 'bi-people-fill' },
  { path: '/appuntamenti', label: 'Appointments', icon: 'bi-calendar-week-fill' },
  { path: '/spese-ricavi', label: 'Finance', icon: 'bi-wallet2' },
]

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && <div className="sidebarBackdrop" onClick={onClose} />}

      <aside className={`sidebarContainer ${isOpen ? 'sidebarOpen' : ''}`}>
        
        <div className="sidebarTopContent">
          {/* Lobo e chiusura da mobile*/}
          <div className="sidebarHeader">
            <div className="sidebarLogo">
              <Logo />
              <span className="textWhite">Flow<span className="brandPurpleText">Bix</span></span>
            </div>
            <button className="closeSidebarBtn" onClick={onClose} title="Chiudi menu">
              <i className="bi bi-x-lg" />
            </button>
          </div>

          {/* Barra di ricerca interna su mobile */}
          <div className="sidebarSearchMobile">
            <div className="sidebarSearchInner">
              <i className="bi bi-search sidebarSearchIcon" />
              <input 
                type="text" 
                className="sidebarSearchInput" 
                placeholder="Search..." 
              />
            </div>
          </div>

          {/* Link di Navigazione */}
          <nav className="sidebarNav">
            {MENU_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose} 
                className={({ isActive }) => 
                  isActive ? 'sidebarLink sidebarLinkActive' : 'sidebarLink'
                }
              >
                <i className={`bi ${item.icon} sidebarIcon`} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* FOOTER */}
        <div className="sidebarFooter">
          <i className="bi bi-shield-check me-1" /> Secure Session
        </div>

      </aside>
    </>
  )
}

export default Sidebar