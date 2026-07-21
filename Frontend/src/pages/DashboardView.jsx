import { useState, useEffect, useCallback } from "react";
import { sendRequest } from "../utils/api";
import { BsPeopleFill, BsCalendarEventFill, BsWallet2 } from "react-icons/bs";
import "./DashboardView.css";

const DashboardView= () => {
  const [stats, setStats] = useState({
    totalClients: 0,
    todayAppointments: 0,
    netBalance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Chiamata asincrona per recuperare i dati
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await sendRequest("/dashboard/stats");
      if (data) {
        setStats(data);
      }
    } catch (err) {
      console.error("Errore durante il recupero delle statistiche:", err);
      setError("Impossibile caricare i dati della dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-Refresh
  useEffect(() => {
    fetchStats();

    const handleRefresh = () => fetchStats();
    window.addEventListener("refreshDashboard", handleRefresh);

    return () => {
      window.removeEventListener("refreshDashboard", handleRefresh);
    };
  }, [fetchStats]);

  // Formattatore valuta EURO
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  return (
    <div className="dashboard-container">
      <div className="section-header">
        <div className="section-header-titles">
          <h2>Your business dashboard.</h2>
        </div>
      </div>

      {error && <div className="dashboard-error">{error}</div>}

      <div className="stats-grid">
        {/*Clienti Totali */}
        <div className="stats-card">
          <div className="stats-card-header">
            <h5 className="stats-card-title">Total Customers</h5>
            <div className="stats-card-icon">
              <BsPeopleFill />
            </div>
          </div>
          <h3 className="stats-card-value">
            {loading ? "..." : stats.totalClients}
          </h3>
        </div>

        {/*Appuntamenti di Oggi */}
        <div className="stats-card">
          <div className="stats-card-header">
            <h5 className="stats-card-title">Today's Appointments</h5>
            <div className="stats-card-icon">
              <BsCalendarEventFill />
            </div>
          </div>
          <h3 className="stats-card-value">
            {loading ? "..." : stats.todayAppointments}
          </h3>
        </div>

        {/*Saldo Netto */}
        <div className="stats-card">
          <div className="stats-card-header">
            <h5 className="stats-card-title">Net Balance</h5>
            <div className="stats-card-icon">
              <BsWallet2 />
            </div>
          </div>
          <h3
            className={`stats-card-value ${
              stats.netBalance < 0 ? "negative" : "positive"
            }`}
          >
            {loading ? "..." : formatCurrency(stats.netBalance)}
          </h3>
        </div>
      </div>
    </div>
  );
}

export default DashboardView;