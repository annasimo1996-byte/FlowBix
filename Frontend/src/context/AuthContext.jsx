import { createContext, useState, useEffect } from 'react'
import { sendRequest } from '../utils/api'

export const AuthContext = createContext()

const readStoredSession = () => {
  const token = localStorage.getItem('token')
  const savedUser = localStorage.getItem('user')

  if (!token || !savedUser) {
    return { token: null, user: null, status: 'anonymous' }
  }

  try {
    const user = JSON.parse(savedUser)
    return { token, user, status: 'checking' }
  } catch {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    return { token: null, user: null, status: 'anonymous' }
  }
}

export function AuthProvider({ children }) {
  const initialSession = readStoredSession()

  const [token, setToken] = useState(initialSession.token)
  const [user, setUser] = useState(initialSession.user)
  const [authStatus, setAuthStatus] = useState(initialSession.status)

  // Stati semantici granulari
  const isBootstrapped = authStatus !== 'checking' || !token
  const isVerifyingToken = authStatus === 'checking'
  const isLogged = Boolean(token && user)

  useEffect(() => {
    const controller = new AbortController()
    const tokenAtStart = token

    const verifyTokenInBackground = async () => {
      if (!tokenAtStart) {
        setAuthStatus('anonymous')
        return
      }

      try {
        const freshUserData = await sendRequest('/users/me', { 
          method: 'GET',
          signal: controller.signal 
        })

        if (localStorage.getItem('token') !== tokenAtStart) {
          return
        }

        if (freshUserData) {
          setUser(freshUserData)
          localStorage.setItem('user', JSON.stringify(freshUserData))
        }
        setAuthStatus('authenticated')
      } catch (err) {
        if (err.name === 'AbortError' || err.message?.includes('aborted')) {
          return
        }

        if (localStorage.getItem('token') !== tokenAtStart) {
          return
        }

        console.warn("Background token verification failed:", err.message)

        if (err instanceof SyntaxError || err.status === 401 || err.status === 403) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setToken(null)
          setUser(null)
          setAuthStatus('anonymous')
        } else {
          setAuthStatus('authenticated')
        }
      }
    }

    verifyTokenInBackground()

    return () => controller.abort()
  }, [token])

  const login = (newToken, userData) => {
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(userData))
    setToken(newToken)
    setUser(userData)
    setAuthStatus('authenticated')
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    setAuthStatus('anonymous')
  }

  return (
    <AuthContext.Provider value={{ isLogged, user, isBootstrapped, isVerifyingToken, authStatus, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}