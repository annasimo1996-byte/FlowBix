import React from "react";
import "./AppointmentCard.css";

const AppointmentCard = ({ appointment, onStatusChange }) => {

  const clientName = appointment.clientId?.name || appointment.clientName || "Unspecified client";
  const clientPhone = appointment.clientId?.phone || appointment.phone || "";
  const serviceName = appointment.service || "General service";
  const timeString = appointment.time || "09:00";
  const priceString = appointment.price ? `€ ${appointment.price}` : "";
  const status = appointment.status || "scheduled";

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
        <span className={`status-badge ${status}`}>
          {status === "scheduled" && "Scheduled"}
          {status === "completed" && "Completed"}
          {status === "canceled" && "Cancelled"} 
        </span>
      </div>
    </div>
  );
};

export default AppointmentCard;