import React from "react";
import "./AgendaToolbar.css";

const AgendaToolbar = ({ currentView, onViewChange, selectedDate, onDateChange, onNavigate }) => {
  return (
    <div className="agenda-toolbar">
      {/* Navigazione temporale */}
      <div className="toolbar-nav-group">
        <button className="btn-flowbix inactive mobile-hidden" onClick={() => onNavigate("prev")} title="Previous period">
          &larr; Back 
        </button>
        <button className="btn-flowbix inactive mobile-hidden" onClick={() => onNavigate("today")}>
          Today
        </button>
        <button className="btn-flowbix inactive mobile-hidden" onClick={() => onNavigate("next")} title="Subsequent period">
          Next &rarr;
        </button>
        
        <input
          type="date"
          className="form-control custom-input toolbar-date-input"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
        />
      </div>

      {/* Selezione della vista per Desktop */}
      <div className="toolbar-view-group desktop-views">
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

      {/* Selezione della vista tramite Select nativa (Visibile solo su Mobile) */}
      <div className="toolbar-view-group mobile-select-view">
        <select
          className="form-control custom-input toolbar-select"
          value={currentView}
          onChange={(e) => onViewChange(e.target.value)}
        >
          <option value="day">Day View</option>
          <option value="week">Week View</option>
          <option value="month">Month View</option>
        </select>
      </div>
    </div>
  );
};

export default AgendaToolbar;