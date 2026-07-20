import React, { useState, useEffect } from "react";
import AgendaToolbar from "../components/appointments/AgendaToolbar";
import DayView from "../components/appointments/DayView";
import WeekView from "../components/appointments/WeekView";
import MonthView from "../components/appointments/MonthView";
import AppointmentModal from "../components/modals/AppointmentModal";
import { sendRequest } from "../utils/api";
import "./AppointmentsView.css";

const AppointmentsView = () => {
  const [currentView, setCurrentView] = useState("day");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [appointments, setAppointments] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [appointmentToEdit, setAppointmentToEdit] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [appData, clientData] = await Promise.all([
          sendRequest("/appointments"),
          sendRequest("/clients").catch(() => []), 
        ]);
        
        if (isMounted) {
          setAppointments(appData || []);
          setClients(clientData || []);
        }
      } catch (err) {
        console.error("Error retrieving appointment data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [currentView, selectedDate]);

  const getFilteredAppointmentsForDay = () => {
    return appointments.filter((app) => {
      const appDate = app.date ? app.date.split("T")[0] : "";
      return appDate === selectedDate;
    });
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      const updatedApp = await sendRequest(`/appointments/${appointmentId}`, {
        method: "PUT", 
        body: JSON.stringify({ status: newStatus }),
      });
      // Sincronizzazione dello stato locale
      setAppointments((prev) =>
        prev.map((app) => (app._id === appointmentId ? updatedApp : app))
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // Eliminazione appuntamento 
  const handleDeleteAppointment = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    try {
      await sendRequest(`/appointments/${appointmentId}`, {
        method: "DELETE",
      });
      setAppointments((prev) => prev.filter((app) => app._id !== appointmentId));
    } catch (err) {
      console.error("Error deleting appointment:", err);
    }
  };

  // Modale di modifica
  const handleEditClick = (appointment) => {
    setAppointmentToEdit(appointment);
    setIsModalOpen(true);
  };

  const handleNavigate = (direction) => {
    const dateObj = new Date(selectedDate);

    if (direction === "today") {
      setSelectedDate(new Date().toISOString().split("T")[0]);
      return;
    }

    if (currentView === "day") {
      const daysToAdd = direction === "next" ? 1 : -1;
      dateObj.setDate(dateObj.getDate() + daysToAdd);
    } else if (currentView === "week") {
      const daysToAdd = direction === "next" ? 7 : -7;
      dateObj.setDate(dateObj.getDate() + daysToAdd);
    } else if (currentView === "month") {
      const monthsToAdd = direction === "next" ? 1 : -1;
      dateObj.setMonth(dateObj.getMonth() + monthsToAdd);
    }

    setSelectedDate(dateObj.toISOString().split("T")[0]);
  };

  // Sincronizzazione salvataggio Creazione / Modifica 
  const handleSaveAppointment = (savedAppointment, isEditing) => {
    setAppointments((prev) => {
      if (isEditing) {
        return prev.map((app) => (app._id === savedAppointment._id ? savedAppointment : app));
      } else {
        return [...prev, savedAppointment];
      }
    });
  };

  return (
    <div className="appointments-container container-fluid">
      <div className="section-header">
        <button 
          className="btn-flowbix active" 
          onClick={() => { 
            setAppointmentToEdit(null);
            setIsModalOpen(true); 
          }}
        >
          + New Appointment
        </button>
      </div>

      <div className="appointments-content">
        <AgendaToolbar
          currentView={currentView}
          onViewChange={handleViewChange}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onNavigate={handleNavigate}
        />

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" style={{ color: "var(--brand-purple)" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted mt-2">Updating agenda...</p>
          </div>
        ) : (
          <>
            {currentView === "day" && (
              <DayView
                appointments={getFilteredAppointmentsForDay()}
                selectedDate={selectedDate}
                onStatusChange={handleStatusChange}
                onEdit={handleEditClick}
                onDelete={handleDeleteAppointment}
              />
            )}
            {currentView === "week" && (
              <WeekView
                appointments={appointments}
                selectedDate={selectedDate}
                onSelectDay={(dateStr) => {
                  setSelectedDate(dateStr);
                  setCurrentView("day");
                }}
              />
            )}
            {currentView === "month" && (
              <MonthView
                appointments={appointments}
                selectedDate={selectedDate}
                onSelectDay={(dateStr) => {
                  setSelectedDate(dateStr);
                  setCurrentView("day");
                }}
              />
            )}
          </>
        )}
      </div>

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => { 
          setIsModalOpen(false); 
          setAppointmentToEdit(null); 
        }}
        onSave={handleSaveAppointment}
        selectedDate={selectedDate}
        clients={clients}
        appointmentToEdit={appointmentToEdit}
      />
    </div>
  );
};

export default AppointmentsView;