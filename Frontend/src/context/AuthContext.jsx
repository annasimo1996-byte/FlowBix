import { createContext, useState, useEffect, useCallback } from 'react'
import { sendRequest } from '../utils/api'

export const AuthContext = createContext()

//Memorizza solo i dati minimi indispensabili per la UI
const sanitizeUser = (rawUser) => {
  if (!rawUser) return null
  return {
    id: rawUser.id || rawUser._id,
    firstName: rawUser.firstName || '',
    lastName: rawUser.lastName || '',
    email: rawUser.email || '',
    avatarUrl: rawUser.avatarUrl || null,
    providers: {
      google: Boolean(rawUser.providers?.google),
      github: Boolean(rawUser.providers?.github),
    },
  }
}

const readStoredSession = () => {
  const token = localStorage.getItem('token')
  const savedUser = localStorage.getItem('user')

  if (!token || !savedUser) {
    return { token: null, user: null, status: 'anonymous' }
  }

  try {
    const user = sanitizeUser(JSON.parse(savedUser))
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

  // Funzione helper per pulire la sessione lato client
  const clearClientSession = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    setAuthStatus('anonymous')
  }, [])

  // Ascolta l'evento 'auth:unauthorized' inviato da sendRequest su errori 401/403
  useEffect(() => {
    const handleUnauthorized = () => {
      console.warn("Sessione scaduta o non autorizzata. Effettuo logout automatico.")
      clearClientSession()
    }

    window.addEventListener('auth:unauthorized', handleUnauthorized)

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized)
    }
  }, [clearClientSession])

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
          const cleanUser = sanitizeUser(freshUserData)
          setUser(cleanUser)
          localStorage.setItem('user', JSON.stringify(cleanUser))
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
          clearClientSession()
        } else {
          setAuthStatus('authenticated')
        }
      }
    }

    verifyTokenInBackground()

    return () => controller.abort()
  }, [token, clearClientSession])

  const login = (newToken, userData) => {
    const cleanUser = sanitizeUser(userData)
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(cleanUser))
    setToken(newToken)
    setUser(cleanUser)
    setAuthStatus('authenticated')
  }

  // Logout (Server-side + Client-side)
  const logout = async () => {
    try {
      // Invia la richiesta al backend per incrementare tokenVersion ed invalidare il JWT
      await sendRequest('/auth/logout', { method: 'POST' })
    } catch (err) {
      console.warn("Errore durante il logout dal server:", err.message)
    } finally {
      // Pulisce comunque lo stato locale indipendentemente dall'esito della chiamata
      clearClientSession()
    }
  }

  return (
    <AuthContext.Provider value={{ isLogged, user, isBootstrapped, isVerifyingToken, authStatus, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}