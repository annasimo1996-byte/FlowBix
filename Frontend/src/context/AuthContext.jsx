import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [isLogged, setIsLogged] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    
    const token = localStorage.getItem('token')
    if (token) {
      
      setIsLogged(true)
    }
    setLoading(false)
  }, [])

  // Funzione di login 
  const login = (token, userData) => {
    localStorage.setItem('token', token)
    setUser(userData)
    setIsLogged(true)
  }

  // Funzione di login
  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setIsLogged(false)
  }

  return (
    <AuthContext.Provider value={{ isLogged, user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}