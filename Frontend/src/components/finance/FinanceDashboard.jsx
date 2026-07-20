import React from "react";
import "./FinanceDashboard.css";

const FinanceDashboard = ({ stats }) => {
    const { income, expense, net } = stats || { income: 0, expense: 0, net: 0 };

    return (
        <div className="dashboard-stats-grid">
            <div className="stat-card">
                <span>Total Income</span>
                <h3 className="text-success">+ € {income.toFixed(2)}</h3>
            </div>
            <div className="stat-card">
                <span>Total Expenses</span>
                <h3 className="text-danger">- € {expense.toFixed(2)}</h3>
            </div>
            <div className="stat-card">
                <span>Net Balance</span>
                <h3 className={net >= 0 ? "text-primary" : "text-danger"}>
                    € {net.toFixed(2)}
                </h3>
            </div>
        </div>
    );
};

export default FinanceDashboard;