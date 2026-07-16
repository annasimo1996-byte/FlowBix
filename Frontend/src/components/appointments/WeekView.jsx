import React from "react";
import "./WeekView.css";

const WeekView = ({ appointments = [], selectedDate, onSelectDay }) => {
  // Calcolo dei giorni della settimana del giorno selezionato
  const getDaysOfWeek = (dateString) => {
    const curr = new Date(dateString);
    const day = curr.getDay();
    // Imposta a Lunedì 
    const diff = curr.getDate() - day + (day === 0 ? -6 : 1);
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(curr.setDate(diff + i));
      weekDays.push(new Date(nextDay));
    }
    return weekDays;
  };

  const weekDays = getDaysOfWeek(selectedDate);
  const todayStr = new Date().toISOString().split("T")[0];

  // Filtrare gli appuntamenti di uno specifico giorno
  const getAppointmentsForDay = (dateObj) => {
    const dateStr = dateObj.toISOString().split("T")[0];
    return appointments.filter((app) => {
      const appDate = app.date ? app.date.split("T")[0] : "";
      return appDate === dateStr;
    });
  };

  return (
    <div className="week-view-container">
      <div className="week-view-grid">
        {weekDays.map((dayObj, index) => {
          const dateStr = dayObj.toISOString().split("T")[0];
          const isToday = dateStr === todayStr;
          const dayAppointments = getAppointmentsForDay(dayObj);

          const dayName = dayObj.toLocaleDateString("en-EN", { weekday: "long" });
          const dayDate = dayObj.toLocaleDateString("en-EN", { day: "numeric", month: "short" });

          return (
            <div key={index} className={`week-day-column ${isToday ? "today" : ""}`}>
              <div className="week-day-header">
                <span className="week-day-name">{dayName}</span>
                <span className="week-day-date">{dayDate}</span>
              </div>

              <div className="week-day-appointments">
                {dayAppointments.length === 0 ? (
                  <div className="week-empty-slot">No obligation</div>
                ) : (
                  dayAppointments.map((app) => (
                    <div key={app._id || app.id} className="mini-appointment-card">
                      <div className="mini-appointment-time">{app.time || "09:00"}</div>
                      <div className="mini-appointment-client">
                        {app.clientId?.name || app.clientName || "Client"}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeekView;