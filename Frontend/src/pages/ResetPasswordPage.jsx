/*import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import styles from './ResetPasswordPage.module.css'

function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') 
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState({ text: '', isError: false })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ text: '', isError: false })

    if (password !== confirmPassword) {
      setMessage({ text: 'The passwords do not match..', isError: true })
      return
    }

    setIsLoading(true)
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9998'

    try {
      //La chiamata che invia la nuova password al Backend
      const response = await fetch(`${BASE_URL}/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Token expired or invalid.')
      }

      setMessage({ text: 'Password successfully updated! You will be redirected to the login page...', isError: false })
      
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (error) {
      setMessage({ text: error.message, isError: true })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.resetWrapper}>
      <div className={styles.formPanel}>
        <h3 className={styles.title}>Choose a new password</h3>

        {message.text && (
          <div className={`alert ${message.isError ? 'alert-danger' : 'alert-success'} rounded-3 small py-2 mb-3`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className={styles.label}>New Password</label>
            <input 
              type="password" 
              className="form-control custom-input rounded-3" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-4">
            <label className={styles.label}>Confirm New Password</label>
            <input 
              type="password" 
              className="form-control custom-input rounded-3" 
              placeholder="••••••••" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary-custom w-100 rounded-3 py-1.5 fw-bold" disabled={isLoading}>
            {isLoading ? 'Aggiornamento...' : 'Reimposta la Password'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPasswordPage*/

function ResetPasswordPage() {
    return null; // Componente stub valido per la build, mantiene l'export corretto
}

export default ResetPasswordPage;