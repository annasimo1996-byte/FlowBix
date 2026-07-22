import React, { useState, useEffect } from "react";
import { sendRequest } from "../../utils/api";
import "./Modal.css";

const initialFormState = {
  clientId: "",
  date: "",
  time: "09:00",
  service: "",
  price: "",
  status: "scheduled",
};

const AppointmentModal = ({ isOpen, onClose, onSave, selectedDate, clients = [], appointmentToEdit = null }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (appointmentToEdit) {
        // Modalità Modifica
        setFormData({
          clientId: appointmentToEdit.clientId?._id || appointmentToEdit.clientId || "",
          date: appointmentToEdit.date ? appointmentToEdit.date.split("T")[0] : "",
          time: appointmentToEdit.time || "09:00",
          service: appointmentToEdit.service || "",
          price: appointmentToEdit.price || "",
          status: appointmentToEdit.status || "scheduled",
        });
      } else {
        // Modalità Creazione
        let formattedDate = "";
        if (selectedDate) {
          const d = new Date(selectedDate);
          formattedDate = !isNaN(d.getTime()) ? d.toISOString().split("T")[0] : selectedDate;
        } else {
          formattedDate = new Date().toISOString().split("T")[0];
        }

        setFormData({
          ...initialFormState,
          date: formattedDate,
        });
      }
      setError(null);
    }
  }, [isOpen, selectedDate, appointmentToEdit]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (clients.length === 0) {
      setError("Please add at least one client before creating an appointment.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let responseData;
      if (appointmentToEdit) {
        // PUT per aggiornare
        responseData = await sendRequest(`/appointments/${appointmentToEdit._id}`, {
          method: "PUT",
          body: JSON.stringify(formData),
        });
      } else {
        // POST per creare
        responseData = await sendRequest("/appointments", {
          method: "POST",
          body: JSON.stringify(formData),
        });
      }
      onSave(responseData, !!appointmentToEdit);
      onClose();
    } catch (err) {
      setError(err.data?.message || "Error saving the appointment.");
    } finally {
      setLoading(false);
    }
  };

  const hasClients = clients.length > 0;

  return (
    <div className="modal-backdrop-custom">
      <div className="modal-content-custom">
        <h3>{appointmentToEdit ? "Edit Appointment" : "New Appointment"}</h3>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-text-custom">{error}</div>}

          <div className="form-group-custom">
            <label>Client</label>
            <select
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              required
              disabled={!hasClients}
            >
              {hasClients ? (
                <>
                  <option value="">Select a customer</option>
                  {clients.map((client) => (
                    <option key={client._id || client.id} value={client._id || client.id}>
                      {client.name} {client.surname || ""}
                    </option>
                  ))}
                </>
              ) : (
                <option value="">No clients found - Add a client first</option>
              )}
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
              placeholder="E.g. Consulting / Treatment"
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
            <label>Status</label>
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
            <button type="submit" className="btn-submit-custom" disabled={loading || !hasClients}>
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;