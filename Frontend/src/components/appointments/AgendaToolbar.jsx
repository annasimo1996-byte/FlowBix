import React from "react";
import "./AgendaToolbar.css";

const AgendaToolbar = ({ currentView, onViewChange, selectedDate, onDateChange, onNavigate }) => {
  return (
    <div className="agenda-toolbar">
      {/* Navigazione temporale */}
      <div className="toolbar-nav-group">
        <button className="btn-flowbix inactive" onClick={() => onNavigate("prev")} title="Previous period">
          &larr; Back 
        </button>
        <button className="btn-flowbix inactive" onClick={() => onNavigate("today")}>
          Today
        </button>
        <button className="btn-flowbix inactive" onClick={() => onNavigate("next")} title="Subsequent period">
          Next &rarr;
        </button>
        
        <input
          type="date"
          className="form-control custom-input toolbar-date-input"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          
        />
      </div>

      {/* Selezione della vista */}
      <div className="toolbar-view-group">
        <button
          className={`btn-flowbix ${currentView === "day" ? "active" : "inactive"}`}
          onClick={() => onViewChange("day")}
        >
          Day
        </button>
        <button
          className={`btn-flowbix ${currentView === "week" ? "active" : "inactive"}`}
          onClick={() => onViewChange("week")}
        >
          Week
        </button>
        <button
          className={`btn-flowbix ${currentView === "month" ? "active" : "inactive"}`}
          onClick={() => onViewChange("month")}
        >
          Month
        </button>
      </div>
    </div>
  );
};

export default AgendaToolbar;