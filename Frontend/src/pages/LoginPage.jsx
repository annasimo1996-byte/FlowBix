import { useState, useContext } from 'react'
import { Tab, Nav } from 'react-bootstrap'
import { AuthContext } from '../context/AuthContext'
import styles from './LoginPage.module.css' 
import Logo from '../components/brand/Logo'

import SocialButtons from '../components/common/SocialButtons'
import Divider from '../components/common/Divider'

const FLOW_STEPS = [
  { icon: 'bi-people-fill', label: 'Clients', color: '#4d9fe8' },
  { icon: 'bi-calendar-week-fill', label: 'Appointments', color: '#7c6cff' },
  { icon: 'bi-wallet2', label: 'Finance', color: '#34a853' },
]

function LoginPage() {
  const [tab, setTab] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [showResetModal, setShowResetModal] = useState(false)

  const { login } = useContext(AuthContext)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setIsLoading(true)

    const BASE_URL = import.meta.env.VITE_API_URL 

    try {
      if (tab === 'login') {
        const response = await fetch(`${BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })

        if (!response.ok) {
          const contentType = response.headers.get("content-type")
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json()
            throw new Error(data.message || 'Invalid credentials')
          } else {
            throw new Error(`Server error (${response.status}). Check the connection.`)
          }
        }

        const data = await response.json()
        login(data.token, data.user)
      } else {
        const response = await fetch(`${BASE_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ firstName, lastName, email, password }),
        })

        if (!response.ok) {
          const data = await response.json().catch(() => ({}))
          throw new Error(data.message || 'Registration failed')
        }

        setTab('login')
        setPassword('')
        alert('Registration successful! Please sign in.')
      }
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.loginWrapper}>

      {/* Pannello Sinistro */}
      <div className={`${styles.heroPanel} brand-sidebar-gradient d-none d-lg-flex flex-column justify-content-between`}>
        <div className="fs-3 fw-bold text-white d-flex align-items-center gap-2">
          <Logo size="32px" />
          <span>Flow<span className={styles.brandPurpleText}>Bix</span></span>
        </div>

        <div>
          <h2 className="display-6 fw-bold lh-sm mb-3 text-white">
            Automate the busywork.
            <br />
            <span className={styles.brandPurpleText}>
              Build flows visually.
            </span>
          </h2>
          <p className={`${styles.heroDescription} text-light opacity-75 fs-5 mb-5`}>
            Manage your clients, track appointments, and monitor your finances all in one place.
          </p>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            {FLOW_STEPS.map((step, i) => (
              <div key={step.label} className="d-flex align-items-center gap-2">
                <div className={`${styles.stepBadge} p-2 px-3 rounded-3 d-flex align-items-center gap-2`}>
                  <i className={`bi ${step.icon} fs-5`} style={{ color: step.color }} />
                  <span className="small fw-medium text-white-50">{step.label}</span>
                </div>
                {i < FLOW_STEPS.length - 1 && <i className="bi bi-arrow-right text-muted" />}
              </div>
            ))}
          </div>
        </div>

        <div></div> 
      </div>

      {/* Pannello Destro */}
      <div className={styles.formPanel}>
        <div className={`${styles.formInnerContainer} w-100`}>

          <div className="d-lg-none mb-3 fs-3 fw-bold d-flex align-items-center gap-2">
            <Logo size="32px" />
            <span className="text-white">Flow<span className={styles.brandPurpleText}>Bix</span></span>
          </div>

          <h3 className="fw-bold mb-1 text-white">
            {tab === 'login' ? 'Welcome back' : 'Create your account'}
          </h3>
          <p className="text-white-50 opacity-75 mb-3">
            {tab === 'login' ? 'Sign in to continue to your workspace.' : 'Start automating in minutes.'}
          </p>

          {errorMessage && (
            <div className="alert alert-danger rounded-3 small py-2 mb-3" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2" />
              {errorMessage}
            </div>
          )}

          <Tab.Container activeKey={tab} onSelect={(k) => { setTab(k ?? 'login'); setErrorMessage(''); }}>
            <Nav variant="pills" className={`${styles.customNavPills} nav-justified mb-3 p-1 rounded-3`}>
              <Nav.Item>
                <Nav.Link eventKey="login" className="rounded-3 text-white">Login</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="register" className="rounded-3 text-white">Register</Nav.Link>
              </Nav.Item>
            </Nav>

            <SocialButtons />
            <Divider />

            <Tab.Content>
              <Tab.Pane eventKey="login">
                <form onSubmit={handleSubmit}>
                  <div className="mb-2">
                    <label className="form-label small fw-semibold text-light mb-1">Email</label>
                    <input type="email" className="form-control custom-input rounded-3" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="mb-2">
                    <label className="form-label small fw-semibold text-light mb-1">Password</label>
                    <input type="password" className="form-control custom-input rounded-3" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="form-check">
                      <input className={`${styles.customCheckbox} form-check-input`} type="checkbox" id="remember" />
                      <label className="form-check-label small text-white-50" htmlFor="remember">Remember me</label>
                    </div>
                    
                    {/*<button 
                      type="button" 
                      onClick={() => setShowResetModal(true)} 
                      className={`${styles.brandPurpleText} btn btn-link p-0 small text-decoration-none fw-medium align-baseline border-0 bg-transparent`}
                    >
                      Forgot password?
                    </button>*/}
                  </div>
                  
                  <button type="submit" className="btn btn-primary-custom w-100 rounded-3 py-1.5 fw-bold" disabled={isLoading}>
                    {isLoading ? 'Processing...' : 'Sign in'}
                  </button>
                </form>
              </Tab.Pane>

              <Tab.Pane eventKey="register">
                <form onSubmit={handleSubmit}>
                  <div className="row g-2 mb-2">
                    <div className="col-6">
                      <label className="form-label small fw-semibold text-light mb-1">First name</label>
                      <input type="text" className="form-control custom-input rounded-3" placeholder="Anna" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold text-light mb-1">Last name</label>
                      <input type="text" className="form-control custom-input rounded-3" placeholder="Moreau" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                    </div>
                  </div>
                  <div className="mb-2">
                    <label className="form-label small fw-semibold text-light mb-1">Email</label>
                    <input type="email" className="form-control custom-input rounded-3" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-light mb-1">Password</label>
                    <input type="password" className="form-control custom-input rounded-3" placeholder="Create a strong password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                  
                  <button type="submit" className="btn btn-primary-custom w-100 rounded-3 py-1.5 fw-bold" disabled={isLoading}>
                    {isLoading ? 'Processing...' : 'Create account'}
                  </button>
                </form>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>

          <p className="text-center text-white-50 small mt-3 mb-0">
            {tab === 'login' ? "Don't have an account? " : 'Already registered? '}
            <button type="button" className={`${styles.brandPurpleText} btn btn-link p-0 align-baseline text-decoration-none small fw-semibold`} onClick={() => { setTab(tab === 'login' ? 'register' : 'login'); setErrorMessage(''); }}>
              {tab === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>

    </div>
  )
}

export default LoginPage