import React, { useState, useEffect, useRef } from "react";
import { sendRequest } from "../../utils/api";
import "./NewClientModal.css";

const NewClientModal = ({ isOpen, onClose, clientToEdit, onClientSaved }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        notes: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    
    // Riferimento per gestire l'AbortController ed evitare race condition/stale state
    const abortControllerRef = useRef(null);

    // Cleanup alla chiusura o smontaggio del componente
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    useEffect(() => {
        if (clientToEdit) {
            setFormData({
                name: clientToEdit.name || "",
                email: clientToEdit.email || "",
                phone: clientToEdit.phone || "",
                company: clientToEdit.company || "",
                notes: clientToEdit.notes || "",
            });
        } else {
            setFormData({ 
                name: "", 
                email: "", 
                phone: "", 
                company: "", 
                notes: "" 
            });
        }
        setError(null);
    }, [clientToEdit, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        // Inizializza un nuovo AbortController per questa specifica sottomissione
        abortControllerRef.current = new AbortController();

        const isEditing = Boolean(clientToEdit && clientToEdit._id);
        const url = isEditing ? `/clients/${clientToEdit._id}` : "/clients";
        const method = isEditing ? "PUT" : "POST";

        try {
            const savedClient = await sendRequest(url, {
                method: method,
                body: JSON.stringify(formData),
                signal: abortControllerRef.current.signal,
            });

            onClientSaved(savedClient, isEditing);
            setFormData({ name: "", email: "", phone: "", company: "", notes: "" });
            onClose();
        } catch (err) {
            if (err.name === "AbortError") return; // Ignora se la chiamata è stata abortita
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-backdrop-custom">
            <div className="modal-content-custom">
                <h3>{clientToEdit ? "Modifica Cliente" : "Nuovo Cliente"}</h3>
                {error && <p className="error-text-custom">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group-custom">
                        <label>Nome</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group-custom">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group-custom">
                        <label>Telefono</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group-custom">
                        <label>Azienda</label>
                        <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group-custom">
                        <label>Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows="3"
                            className="textarea-custom"
                        />
                    </div>

                    <div className="modal-actions-custom">
                        <button
                            type="button"
                            className="btn-secondary-custom"
                            onClick={onClose}
                            disabled={submitting}
                        >
                            Annulla
                        </button>
                        <button
                            type="submit"
                            className="btn-submit-custom"
                            disabled={submitting}
                        >
                            {submitting ? "Salvataggio..." : "Salva Cliente"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewClientModal;