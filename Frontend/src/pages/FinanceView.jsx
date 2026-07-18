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

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [expRes, appRes] = await Promise.all([
          sendRequest("/finance"),
          sendRequest("/appointments")
        ]);

        if (isMounted) {
          // Estrazione dell'array "data"
          setExpenses(expRes && Array.isArray(expRes.data) ? expRes.data : []);
          setAppointments(Array.isArray(appRes) ? appRes : []);
        }
      } catch (err) {
        if (isMounted) setError(err.message || "Failed to load data");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, []);

  // Array unificato
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

  // Calcolo statistiche basato sull'array unificato
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
        <div className="section-header-titles">
          <h2 className="d-none d-md-block">Finance Management</h2>
          <p className="d-none d-md-block">Monitor your expenses, categories, and financial flow in real time.</p>
        </div>
        <button className="btn-flowbix" onClick={() => { setExpenseToEdit(null); setIsModalOpen(true); }}>
          <span className="d-none d-md-inline">+ New Expense</span>
          <span className="d-inline d-md-none">+</span>
        </button>
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
                            <button className="btn-action-edit" onClick={() => { setExpenseToEdit(expenses.find(e => e._id === item.id)); setIsModalOpen(true); }}>Edit</button>
                            <button className="btn-action-delete" onClick={() => handleDeleteExpense(item.id)}>Delete</button>
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