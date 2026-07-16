import React from "react";
import AppointmentCard from "./AppointmentCard";
import "./DayView.css";

const DayView = ({ appointments = [], selectedDate, onStatusChange, onEdit, onDelete }) => {
  const formatDateHeader = (dateString) => {
    if (!dateString) return "";
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-EN", options);
  };

  return (
    <div className="day-view-container">
      <div className="day-view-date-title">
        <span>{formatDateHeader(selectedDate)}</span>
        <span className="day-view-count">
          {appointments.length} {appointments.length === 1 ? "appointment" : "appointments"}
        </span>
      </div>

      {appointments.length === 0 ? (
        <div className="day-view-empty">
          <p>No appointments scheduled for today..</p>
        </div>
      ) : (
        appointments.map((appointment) => (
          <AppointmentCard
            key={appointment._id || appointment.id}
            appointment={appointment}
            onStatusChange={onStatusChange}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
};

export default DayView;