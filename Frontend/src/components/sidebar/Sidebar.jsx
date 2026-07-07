import { NavLink } from 'react-router-dom'
import './Sidebar.css'

import Logo from '../brand/Logo' 

const MENU_ITEMS = [
  { path: '/', label: 'Home', icon: 'bi-grid-1x2-fill' },
  { path: '/clienti', label: 'Clients', icon: 'bi-people-fill' },
  { path: '/appuntamenti', label: 'Appointments', icon: 'bi-calendar-week-fill' },
  { path: '/spese-ricavi', label: 'Finance', icon: 'bi-wallet2' },
]

function Sidebar() {
  return (
    <aside className="sidebarContainer">
      
      <div>
        <div className="sidebarLogo d-flex align-items-center gap-2">
          <Logo />
          <span className="text-white">Flow<span style={{ color: 'var(--brand-purple)' }}>Bix</span></span>
        </div>

        <nav className="sidebarNav">
          {MENU_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
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
        <i className="bi bi-shield-check me-1" /> 
      </div>

    </aside>
  )
}

export default Sidebar