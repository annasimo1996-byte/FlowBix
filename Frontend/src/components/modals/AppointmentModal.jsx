import React, { useState, useEffect } from "react";
import { sendRequest } from "../../utils/api";
import "./Modal.css";

const initialFormState = {
  clientId: "",
  clientName: "",
  date: "",
  time: "09:00",
  service: "",
  price: "",
  status: "scheduled",
};

const AppointmentModal = ({ isOpen, onClose, onSave, selectedDate, clients = [] }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sincronizza o resetta il modale con la data
  useEffect(() => {
    if (isOpen) {
      setFormData({
        ...initialFormState,
        date: selectedDate || new Date().toISOString().split("T")[0],
      });
      setError(null);
    }
  }, [isOpen, selectedDate]);

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
      const responseData = await sendRequest("/appointments", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      onSave(responseData);
      onClose(); 
    } catch (err) {
      setError(err.data?.message || "Error saving the appointment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop-custom">
      <div className="modal-content-custom">
        <h3>Nuovo Appuntamento</h3>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-text-custom">{error}</div>}

          <div className="form-group-custom">
            <label>Client</label>
            <select
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              required
            >
              <option value="">Select a customer</option>
              {clients.map((client) => (
                <option key={client._id || client.id} value={client._id || client.id}>
                  {client.name}
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
            <label>Hours</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group-custom">
            <label>Service</label>
            <input
              type="text"
              name="service"
              placeholder="Es. Consulting / Treatment"
              value={formData.service}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group-custom">
            <label>Price (€)</label>
            <input
              type="number"
              name="price"
              placeholder="0.00"
              value={formData.price}
              onChange={handleChange}
            />
          </div>

          <div className="form-group-custom">
            <label>State</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="canceled">Canceled</option>
            </select>
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

export default AppointmentModal;