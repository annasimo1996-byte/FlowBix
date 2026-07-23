import { NavLink } from 'react-router-dom'
import './Sidebar.css'
import Logo from '../brand/Logo' 
import packageJson from '../../../package.json'

const MENU_ITEMS = [
  { path: '/', label: 'Home', icon: 'bi-grid-1x2-fill' },
  { path: '/clients', label: 'Clients', icon: 'bi-people-fill' },
  { path: '/appointments', label: 'Appointments', icon: 'bi-calendar-week-fill' },
  { path: '/finance', label: 'Finance', icon: 'bi-wallet2' },
]

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && <div className="sidebarBackdrop" onClick={onClose} />}

      <aside className={`sidebarContainer ${isOpen ? 'sidebarOpen' : ''}`}>
        
        <div className="sidebarTopContent">
          {/*Logo e chiusura da mobile*/}
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

        <div className="sidebarFooter">
          {/*Badge Versione*/}
          <a 
            href="https://github.com/annasimo1996-byte/FlowBix/releases" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footerVersionBadge"
            title="Vedi le note di rilascio su GitHub"
          >
            v{packageJson.version}
          </a>

          {/*Link Social e Repository */}
          <div className="footerSocialLinks">
            <a 
              href="https://github.com/annasimo1996-byte" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Profilo GitHub"
              title="GitHub"
            >
              <i className="bi bi-github" />
            </a>
            <a 
              href="https://www.linkedin.com/in/anna-maria-simonetti/" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Profilo LinkedIn"
              title="LinkedIn"
            >
              <i className="bi bi-linkedin" />
            </a>
          </div>

          {/*Copyright */}
          <span className="footerCopyright">© 2026 Anna Maria Simonetti</span>
        </div>

      </aside>
    </>
  )
}

export default Sidebar