import React from 'react';
import BalanceTrendChart from './BalanceTrendChart';
import ExpenseDonutChart from './ExpenseDonutChart';
import './FinanceChartsContainer.css';

const FinanceChartsContainer = ({ trendData, categoryData }) => {
  return (
    <div className="finance-charts-grid">
      <div className="chart-wrapper trend-chart-wrapper">
        <BalanceTrendChart data={trendData} />
      </div>
      <div className="chart-wrapper donut-chart-wrapper">
        <ExpenseDonutChart data={categoryData} />
      </div>
    </div>
  );
};

export default FinanceChartsContainer;