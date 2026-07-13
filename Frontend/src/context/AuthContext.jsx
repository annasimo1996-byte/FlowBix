import { createContext, useState, useEffect } from 'react'
import { sendRequest } from '../utils/api'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [isLogged, setIsLogged] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token')
      const savedUser = localStorage.getItem('user')
      
      if (!token || !savedUser) {
        setLoading(false)
        return
      }

      setIsLogged(true)
      setUser(JSON.parse(savedUser))

      try {
        const freshUserData = await sendRequest('/users/me', { method: 'GET' })
        if (freshUserData) {
          setUser(freshUserData)
          localStorage.setItem('user', JSON.stringify(freshUserData))
        }
      } catch (err) {
        console.warn("Token verification with the server failed:", err.message)
        
        if (err.status === 401 || err.status === 403 || (err.message && err.message.includes('expired'))) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setIsLogged(false)
          setUser(null)
        }
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = (token, userData) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    setIsLogged(true)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setIsLogged(false)
  }

  return (
    <AuthContext.Provider value={{ isLogged, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}