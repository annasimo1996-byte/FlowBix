import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [isLogged, setIsLogged] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Quando la pagina si carica, controlliamo se c'è un token JWT salvato nel browser
    const token = localStorage.getItem('token')
    if (token) {
      // In futuro qui faremo una validazione reale con il Backend. Per ora fingiamo sia valido:
      setIsLogged(true)
    }
    setLoading(false)
  }, [])

  // Funzione per effettuare il login (salva il token e aggiorna lo stato)
  const login = (token, userData) => {
    localStorage.setItem('token', token)
    setUser(userData)
    setIsLogged(true)
  }

  // Funzione per effettuare il logout (cancella il token e resetta lo stato)
  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setIsLogged(false)
  }

  return (
    <AuthContext.Provider value={{ isLogged, user, loading, login, logout }}>
      {/* Mostriamo l'applicazione solo quando il controllo del token iniziale è terminato */}
      {!loading && children}
    </AuthContext.Provider>
  )
}