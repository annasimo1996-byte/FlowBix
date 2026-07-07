import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [isLogged, setIsLogged] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      
      if (token) {
        try {
          const response = await fetch('http://localhost:9998/api/auth/me', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })

          if (response.ok) {
            const data = await response.json()
            setUser(data.user)
            setIsLogged(true)
          } else {
            localStorage.removeItem('token')
            sessionStorage.removeItem('token')
          }
        } catch (error) {
          console.error("Errore durante la validazione del token:", error)
        }
      }
      
      setLoading(false)
    }

    checkToken()
  }, [])

  const login = (token, userData, rememberMe = false) => {
    if (rememberMe) {
      localStorage.setItem('token', token) // Sessione persistente (rimane se chiudi il browser)
    } else {
      sessionStorage.setItem('token', token) // Sessione temporanea (scompare se chiudi la scheda)
    }
    setUser(userData)
    setIsLogged(true)
  }

  const logout = () => {
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
    setUser(null)
    setIsLogged(false)
  }

  return (
    <AuthContext.Provider value={{ isLogged, user, loading, login, logout }}>
      
      {!loading ? children : (
        <div className="flex h-screen w-screen items-center justify-center bg-slate-900 text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}
    </AuthContext.Provider>
  )
}