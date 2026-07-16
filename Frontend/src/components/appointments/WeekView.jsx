import React, { useState } from "react";
import "./WeekView.css";

const WeekView = ({ appointments = [], selectedDate, onSelectDay }) => {

  const [expandedId, setExpandedId] = useState(null);

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

  const toggleExpand = (appId) => {
    setExpandedId(prevId => (prevId === appId ? null : appId));
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
                  dayAppointments.map((app) => {
                    const appId = app._id || app.id;
                    const isExpanded = expandedId === appId;
                    const clientName = app.clientId?.name || app.clientName || "Client";
                    const serviceName = app.service || "General service";
                    const priceString = app.price ? `€ ${app.price}` : "";
                    const status = app.status || "scheduled";

                    return (
                      <div 
                        key={appId} 
                        className={`mini-appointment-card ${isExpanded ? "expanded" : ""}`}
                        onClick={() => toggleExpand(appId)}
                        title="Click to toggle details"
                      >
                        <div className="mini-card-header-row">
                          <div className="mini-appointment-time">{app.time || "09:00"}</div>
                          <div className="mini-appointment-client">{clientName}</div>
                        </div>

                        {isExpanded && (
                          <div className="mini-card-details-expanded">
                            <p className="mini-service-text">{serviceName}</p>
                            <div className="mini-card-footer">
                              {priceString && <span className="mini-price">{priceString}</span>}
                              <span className={`status-badge ${status}`}>
                                {status}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
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