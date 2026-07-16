import React from "react";
import "./AppointmentCard.css";

const AppointmentCard = ({ appointment, onStatusChange, onEdit, onDelete }) => {

  const clientName = appointment.clientId?.name || appointment.clientName || "Unspecified client";
  const clientPhone = appointment.clientId?.phone || appointment.phone || "";
  const serviceName = appointment.service || "General service";
  const timeString = appointment.time || "09:00";
  const priceString = appointment.price ? `€ ${appointment.price}` : "";
  const status = appointment.status || "scheduled";

  // Cambio di stato dalla tendina
  const handleStatusSelect = (e) => {
    e.stopPropagation();
    const newStatus = e.target.value;
    if (onStatusChange && newStatus !== status) {
      onStatusChange(appointment._id || appointment.id, newStatus);
    }
  };

  return (
    <div className="appointment-card">
      <div className="appointment-main-info">
        <div className="appointment-time-badge">{timeString}</div>
        <div className="appointment-details">
          <h5>{clientName}</h5>
          <p>{serviceName} {clientPhone ? `• ${clientPhone}` : ""}</p>
        </div>
      </div>

      <div className="appointment-meta">
        {priceString && <span className="appointment-price">{priceString}</span>}
        
        {/* Selettore dello stato */}
        <div className="appointment-status-wrapper" onClick={(e) => e.stopPropagation()}>
          <select
            className={`status-badge-select ${status}`}
            value={status}
            onChange={handleStatusSelect}
            title="Change status"
          >
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="canceled">Cancelled</option>
          </select>
        </div>

        {/* Modifica ed Eliminazione */}
        <div className="appointment-actions ms-2 d-flex gap-1">
          {onEdit && (
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary border-0 p-1"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(appointment);
              }}
              title="Edit appointment"
            >
              <i className="bi bi-pencil-fill" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              className="btn btn-sm btn-outline-danger border-0 p-1"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(appointment._id || appointment.id);
              }}
              title="Delete appointment"
            >
              <i className="bi bi-trash-fill" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;