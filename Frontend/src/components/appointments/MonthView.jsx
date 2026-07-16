import React from "react";
import "./MonthView.css";

const MonthView = ({ appointments = [], selectedDate, onSelectDay }) => {
  const currentDateObj = new Date(selectedDate);
  const year = currentDateObj.getFullYear();
  const month = currentDateObj.getMonth();

  // Primo giorno del mese e quanti giorni ha il mese
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Giorno della settimana del primo giorno del mese
  let startDayOfWeek = firstDayOfMonth.getDay();
  startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1; 

  // Formatta la data in formato YYYY-MM-DD 
  const formatLocalDate = (dateObj) => {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const todayStr = formatLocalDate(new Date());

  // I giorni del mese precedente di riempimento
  const prevMonthDays = new Date(year, month, 0).getDate();
  const totalCells = Math.ceil((startDayOfWeek + daysInMonth) / 7) * 7;

  const daysGrid = [];
  
  for (let i = 0; i < totalCells; i++) {
    let dayNum, cellDateObj, isCurrentMonth = true;

    if (i < startDayOfWeek) {
      // Giorni del mese precedente
      dayNum = prevMonthDays - startDayOfWeek + i + 1;
      cellDateObj = new Date(year, month - 1, dayNum);
      isCurrentMonth = false;
    } else if (i < startDayOfWeek + daysInMonth) {
      // Giorni del mese corrente
      dayNum = i - startDayOfWeek + 1;
      cellDateObj = new Date(year, month, dayNum);
    } else {
      // Giorni del mese successivo
      dayNum = i - (startDayOfWeek + daysInMonth) + 1;
      cellDateObj = new Date(year, month + 1, dayNum);
      isCurrentMonth = false;
    }

    const dateStr = formatLocalDate(cellDateObj);
    daysGrid.push({ dateStr, dayNum, cellDateObj, isCurrentMonth });
  }

  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const getAppointmentsForDay = (dateStr) => {
    return appointments.filter((app) => {
      const appDate = app.date ? app.date.split("T")[0] : "";
      return appDate === dateStr;
    });
  };

  return (
    <div className="month-view-container">
      <div className="month-view-grid">
        {weekdays.map((w, idx) => (
          <div key={idx} className="month-weekday-header">{w}</div>
        ))}

        {daysGrid.map((cell, index) => {
          const isToday = cell.dateStr === todayStr;
          const isSelected = cell.dateStr === selectedDate;
          const dayApps = getAppointmentsForDay(cell.dateStr);

          return (
            <div
              key={index}
              className={`month-day-cell ${!cell.isCurrentMonth ? "outside-month" : ""} ${isToday ? "today" : ""} ${isSelected && cell.isCurrentMonth ? "selected" : ""}`}
              onClick={() => onSelectDay(cell.dateStr)}
            >
              <span className="month-day-number">{cell.dayNum}</span>
              <div className="month-day-indicators">
                {dayApps.slice(0, 2).map((app) => (
                  <div key={app._id || app.id} className="month-appointment-dot" title={app.clientName || "Impegno"}>
                    {app.time || "09:00"} {app.clientId?.name || app.clientName || "Cliente"}
                  </div>
                ))}
                {dayApps.length > 2 && (
                  <span className="month-more-badge">+{dayApps.length - 2} others</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;