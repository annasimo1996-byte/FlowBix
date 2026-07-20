import React, { useState, useEffect } from "react";
import { sendRequest } from "../../utils/api";
import "./Modal.css";

const initialFormState = {
  amount: "",
  category: "",
  date: "",
  description: "",
};

// Categorie predefinite di esempio (puoi personalizzarle come preferisci)
const CATEGORIES = [
  "Abbonamenti",
  "Utenze",
  "Software",
  "Marketing",
  "Fornitori",
  "Altro"
];

const FinanceModal = ({ isOpen, onClose, onSave, expenseToEdit = null }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (expenseToEdit) {
        // Modalità Modifica
        setFormData({
          amount: expenseToEdit.amount || "",
          category: expenseToEdit.category || "",
          date: expenseToEdit.date ? expenseToEdit.date.split("T")[0] : "",
          description: expenseToEdit.description || "",
        });
      } else {
        // Modalità Creazione (imposta la data odierna di default)
        setFormData({
          ...initialFormState,
          date: new Date().toISOString().split("T")[0],
        });
      }
      setError(null);
    }
  }, [isOpen, expenseToEdit]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let responseData;
      if (expenseToEdit) {
        // PUT per aggiornare
        responseData = await sendRequest(`/finance/${expenseToEdit._id}`, {
          method: "PUT",
          body: JSON.stringify({
            amount: Number(formData.amount),
            category: formData.category,
            date: formData.date,
            description: formData.description,
          }),
        });
      } else {
        // POST per creare
        responseData = await sendRequest("/finance", {
          method: "POST",
          body: JSON.stringify({
            amount: Number(formData.amount),
            category: formData.category,
            date: formData.date,
            description: formData.description,
          }),
        });
      }
      
      // Gestiamo la risposta se viene restituita dentro un oggetto data o direttamente
      const savedData = responseData.data || responseData;
      onSave(savedData, !!expenseToEdit);
      onClose();
    } catch (err) {
      setError(err.data?.message || err.message || "Error saving the expense.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop-custom">
      <div className="modal-content-custom">
        <h3>{expenseToEdit ? "Modifica Spesa" : "Nuova Spesa"}</h3>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-text-custom">{error}</div>}

          <div className="form-group-custom">
            <label>Amount (€)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              name="amount"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group-custom">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group-custom">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group-custom">
            <label>Description (Optional)</label>
            <textarea
              name="description"
              className="textarea-custom"
              rows="3"
              placeholder="Add details about this expense (max 500 chars)..."
              maxLength="500"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="modal-actions-custom">
            <button type="button" className="btn-secondary-custom" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-submit-custom" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FinanceModal;