import { useState } from 'react'
import { Modal } from 'react-bootstrap'
import styles from './ResetPasswordModal.module.css'

function ResetPasswordModal({ show, onHide }) {
    const [resetEmail, setResetEmail] = useState('')
    const [modalMessage, setModalMessage] = useState({ text: '', isError: false })
    const [isResetLoading, setIsResetLoading] = useState(false)

    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault()
        setIsResetLoading(true)
        setModalMessage({ text: '', isError: false })

        const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9998'

        try {
            const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: resetEmail }),
            })

            const data = await response.json().catch(() => ({}))

            if (!response.ok) {
                throw new Error(data.message || "No user found with this email or server error.")
            }

            setModalMessage({ text: data.message || "Reset link successfully sent to your email!", isError: false })
            setResetEmail('')
        } catch (error) {
            setModalMessage({ text: error.message, isError: true })
        } finally {
            setIsResetLoading(false)
        }
    }

    // Resetta i messaggi quando il modal viene chiuso
    const handleClose = () => {
        setModalMessage({ text: '', isError: false })
        setResetEmail('')
        onHide()
    }

    return (
        <Modal show={show} onHide={handleClose} centered contentClassName={styles.modalContent}>
            <Modal.Header closeButton closeVariant="white" className={styles.modalHeader}>
                <Modal.Title className="fw-bold fs-5">Reset Password</Modal.Title>
            </Modal.Header>
            <form onSubmit={handleForgotPasswordSubmit}>
                <Modal.Body>
                    <p className={`small mb-3 ${styles.description}`}>
                        Enter your registered email address. We will send you a secure link, valid for one hour, to choose a new password.
                    </p>

                    {modalMessage.text && (
                        <div className={`alert ${modalMessage.isError ? 'alert-danger' : 'alert-success'} small py-2 mb-3 rounded-3`} role="alert">
                            {modalMessage.text}
                        </div>
                    )}

                    <div className="mb-1">
                        <label className={`form-label small fw-semibold mb-1 ${styles.label}`}>Email Address</label>
                        <input
                            type="email"
                            className="form-control custom-input rounded-3"
                            placeholder="you@company.com"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            required
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer className={`py-2 ${styles.modalFooter}`}>
                    <button type="button" className="btn btn-secondary btn-sm rounded-3 px-3" onClick={handleClose}>
                        Close
                    </button>
                    <button type="submit" className="btn btn-primary-custom btn-sm rounded-3 px-3 fw-bold" disabled={isResetLoading}>
                        {isResetLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </Modal.Footer>
            </form>
        </Modal>
    )
}

export default ResetPasswordModal