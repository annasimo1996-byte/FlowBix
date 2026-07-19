import React, { useState, useEffect } from "react";
import { sendRequest } from "../utils/api";
import "./FinanceView.css";
import FinanceModal from "../components/modals/FinanceModal";
import FinanceDashboard from "../components/finance/FinanceDashboard";

const FinanceView = () => {
  const [expenses, setExpenses] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);

  // Stati per il filtro Mese/Anno
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      // Calcolo date per il backend
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);

      try {
        const [expRes, appRes] = await Promise.all([
          sendRequest(`/finance?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`),
          sendRequest("/appointments")
        ]);

        if (isMounted) {
          setExpenses(expRes && Array.isArray(expRes.data) ? expRes.data : []);

          // Filtraggio appuntamenti
          const filteredApps = Array.isArray(appRes) ? appRes.filter(app => {
            const d = new Date(app.date);
            return d.getMonth() + 1 === parseInt(month) && d.getFullYear() === parseInt(year);
          }) : [];
          setAppointments(filteredApps);
        }
      } catch (err) {
        if (isMounted) setError(err.message || "Failed to load data");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [month, year]);

  const combinedData = [
    ...expenses.map(exp => ({
      id: exp._id,
      date: new Date(exp.date),
      amount: Number(exp.amount),
      type: exp.type,
      category: exp.category,
      description: exp.description || "-",
      isAppointment: false
    })),
    ...appointments
      .filter(app => app.status === 'completed')
      .map(app => ({
        id: app._id,
        date: new Date(app.date),
        amount: Number(app.price),
        type: 'income',
        category: 'Entrate',
        description: `${app.service} - ${app.clientId?.name || 'Cliente'}`,
        isAppointment: true
      }))
  ].sort((a, b) => b.date - a.date);

  const stats = combinedData.reduce((acc, curr) => {
    if (curr.type === 'income') acc.income += curr.amount;
    else acc.expense += curr.amount;
    return acc;
  }, { income: 0, expense: 0 });

  const netBalance = stats.income - stats.expense;

  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await sendRequest(`/finance/${expenseId}`, { method: "DELETE" });
      setExpenses((prev) => prev.filter((exp) => exp._id !== expenseId));
    } catch (err) { alert("Failed to delete"); }
  };

  const handleSaveExpense = (savedExpense, isEditing) => {
    setExpenses((prev) => isEditing ? prev.map((exp) => exp._id === savedExpense._id ? savedExpense : exp) : [savedExpense, ...prev]);
  };

  return (
    <div className="finance-container container-fluid">
      <div className="section-header">
        <div className="header-controls">
          <div className="filters-group">
            <select className="custom-select" value={month} onChange={(e) => setMonth(e.target.value)}>
              {[...Array(12).keys()].map(m => <option key={m + 1} value={m + 1}>{new Date(0, m).toLocaleString('default', { month: 'long' })}</option>)}
            </select>
            <select className="custom-select" value={year} onChange={(e) => setYear(e.target.value)}>
              {[new Date().getFullYear(), new Date().getFullYear() - 1].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <button className="btn-flowbix" onClick={() => { setExpenseToEdit(null); setIsModalOpen(true); }}>
            <span className="btn-icon">+</span>
            <span className="btn-text-responsive"> New Expense</span>
          </button>
        </div>
      </div>

      <div className="finance-dashboard-wrapper">
        <FinanceDashboard stats={{ ...stats, net: netBalance }} />
      </div>

      <div className="finance-content">
        {loading ? <p>Loading...</p> : error ? <p>{error}</p> : combinedData.length === 0 ? <p>No transactions found.</p> : (
          <>
            <div className="table-responsive d-none d-md-block">
              <table className="finance-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Description</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {combinedData.map((item) => (
                    <tr key={item.id}>
                      <td><span className="expense-category-badge">{item.category}</span></td>
                      <td className={`expense-amount ${item.type === 'income' ? 'text-income' : 'text-expense'}`}>
                        {item.type === 'income' ? '+' : '-'} € {item.amount.toFixed(2)}
                      </td>
                      <td>{item.date.toLocaleDateString()}</td>
                      <td className="description-cell">
                        <div className="expense-description" title={item.description}>{item.description}</div>
                      </td>
                      <td className="text-end">
                        {!item.isAppointment && (
                          <div className="action-buttons-group">
                            <button className="btn-icon-custom btn-edit-icon" title="Edit" onClick={() => { setExpenseToEdit(expenses.find(e => e._id === item.id)); setIsModalOpen(true); }}>
                              <i className="bi bi-pencil-square" />
                            </button>
                            <button className="btn-icon-custom btn-delete-icon" title="Delete" onClick={() => handleDeleteExpense(item.id)}>
                              <i className="bi bi-trash-fill" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="finance-list-mobile d-md-none">
              {combinedData.map((item) => (
                <div key={item.id} className="expense-card-mobile">
                  <span className="expense-category-badge">{item.category}</span>
                  <span className={`expense-amount ${item.type === 'income' ? 'text-income' : 'text-expense'}`}>
                    {item.type === 'income' ? '+' : '-'} € {item.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <FinanceModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setExpenseToEdit(null); }} onSave={handleSaveExpense} expenseToEdit={expenseToEdit} />
    </div>
  );
};

export default FinanceView;