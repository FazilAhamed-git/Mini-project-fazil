import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getAllTransactions } from "../services/transactionService";
import { useTransactionMetrics } from "../hooks/useTransactionMetrics";
import Layout from "./Layout";
import PieChart from "./PieChart";
import "../styles/main.css";

function Dashboard() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const userTransactions = await getAllTransactions();
        setTransactions(userTransactions);
      } catch (error) {
        console.error('Failed to load transactions:', error);
      }
    };

    if (user) {
      loadTransactions();
    }
  }, [user]);

  const { kpiMetrics, riskDistribution } = useTransactionMetrics(transactions);

  // Use KPI metrics from fraud detection analysis
  const totalTransactions = kpiMetrics.total;
  const fraudDetected = kpiMetrics.fakeCount;
  const underReview = kpiMetrics.reviewCount;
  const safeTransactions = kpiMetrics.safeCount;
  const fraudRate = kpiMetrics.fraudRate;

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  // Get UPI ID from user profile or default
  const getUpiId = () => {
    // This would ideally come from user profile
    return user?.email ? `${user.email.split('@')[0]}@yesbank` : 'user@yesbank';
  };

  // Prepare chart data for transaction history (last 6 months)
  const getTransactionHistoryData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const data = months.map((month, index) => {
      const monthTransactions = transactions.filter(t => {
        const date = new Date(t.timestamp);
        return date.getMonth() === index;
      });
      return monthTransactions.reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
    });
    return { months, data };
  };

  const { months, data: historyData } = getTransactionHistoryData();
  const maxValue = Math.max(...historyData, 1800);

  // Risk level distribution for pie chart
  const riskLevelData = [
    { name: 'Safe', value: safeTransactions, color: '#4caf50' },
    { name: 'Under Review', value: underReview, color: '#ff9800' },
    { name: 'Fraudulent', value: fraudDetected, color: '#f44336' },
  ];

  return (
    <Layout>
      <div className="dashboard-container">
        {/* User Profile Card */}
        <div className="user-profile-card">
          <div className="user-avatar-large">
            {getUserInitials()}
          </div>
          <div className="user-info">
            <h2 className="user-name">{user?.name || user?.email || 'User'}</h2>
            <p className="user-upi">UPI ID: {getUpiId()}</p>
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="metric-cards-grid">
          <div className="metric-card">
            <div className="metric-icon">�</div>
            <div className="metric-content">
              <div className="metric-value">{totalTransactions}</div>
              <div className="metric-label">Transactions Analyzed</div>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">✅</div>
            <div className="metric-content">
              <div className="metric-value green">{safeTransactions}</div>
              <div className="metric-label">Safe Transactions</div>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">⚠️</div>
            <div className="metric-content">
              <div className="metric-value orange">{underReview}</div>
              <div className="metric-label">Under Review</div>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">🚨</div>
            <div className="metric-content">
              <div className="metric-value red">{fraudDetected}</div>
              <div className="metric-label">Fraud Detected</div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-grid">
          {/* Transaction History Chart */}
          <div className="chart-card">
            <h3 className="chart-title">Transaction History</h3>
            <div className="line-chart-container">
              <svg className="line-chart-svg" viewBox="0 0 600 200">
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#4A90E2" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#4A90E2" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Y-axis labels */}
                {[1200, 1400, 1600, 1800].map((val, i) => (
                  <text
                    key={val}
                    x="10"
                    y={180 - (i * 50)}
                    fill="#8B9DC3"
                    fontSize="10"
                    textAnchor="start"
                  >
                    {val}
                  </text>
                ))}
                {/* Grid lines */}
                {[1200, 1400, 1600, 1800].map((val, i) => (
                  <line
                    key={val}
                    x1="40"
                    y1={180 - (i * 50)}
                    x2="580"
                    y2={180 - (i * 50)}
                    stroke="#2A3A52"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                  />
                ))}
                {/* Area under line */}
                <path
                  d={`M 40 ${180 - ((historyData[0] / maxValue) * 150)} ${historyData.map((val, i) => 
                    `L ${40 + (i * 100)} ${180 - ((val / maxValue) * 150)}`
                  ).join(' ')} L ${40 + ((historyData.length - 1) * 100)} 180 L 40 180 Z`}
                  fill="url(#lineGradient)"
                />
                {/* Line */}
                <polyline
                  points={historyData.map((val, i) => 
                    `${40 + (i * 100)},${180 - ((val / maxValue) * 150)}`
                  ).join(' ')}
                  fill="none"
                  stroke="#4A90E2"
                  strokeWidth="2"
                />
                {/* Data points */}
                {historyData.map((val, i) => (
                  <circle
                    key={i}
                    cx={40 + (i * 100)}
                    cy={180 - ((val / maxValue) * 150)}
                    r="4"
                    fill="#4A90E2"
                  />
                ))}
                {/* X-axis labels */}
                {months.map((month, i) => (
                  <text
                    key={month}
                    x={40 + (i * 100)}
                    y="195"
                    fill="#8B9DC3"
                    fontSize="10"
                    textAnchor="middle"
                  >
                    {month}
                  </text>
                ))}
              </svg>
            </div>
          </div>

          {/* Risk Level Distribution Chart */}
          <div className="chart-card">
            <h3 className="chart-title">Risk Level Distribution</h3>
            <div className="pie-chart-container">
              {/* Use reusable PieChart component */}
              <PieChart data={riskLevelData} size={240} innerRadius={68} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
