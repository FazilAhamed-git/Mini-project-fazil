import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAllTransactions } from "../services/transactionService";
import "../styles/main.css";

function TransactionHistory() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("recent");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Load all transactions when component mounts
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true);
        const userTransactions = await getAllTransactions();
        setTransactions(userTransactions);
      } catch (error) {
        console.error('Failed to load transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadTransactions();
    }
  }, [user]);

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter((t) => {
      const matchesStatus = filterStatus === "all" || t.status === filterStatus;
      const matchesSearch = 
        t.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.amount.toString().includes(searchTerm);
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "amount-high":
          return b.amount - a.amount;
        case "amount-low":
          return a.amount - b.amount;
        case "score-high":
          return b.score - a.score;
        case "score-low":
          return a.score - b.score;
        default:
          return 0;
      }
    });

  const getStatusColor = (status) => {
    switch (status) {
      case "SAFE":
        return "#4caf50";
      case "REVIEW":
        return "#ff9800";
      case "FAKE":
        return "#f44336";
      default:
        return "#999";
    }
  };

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel) {
      case "Low":
        return "#4caf50";
      case "Medium":
        return "#ff9800";
      case "High":
        return "#f44336";
      default:
        return "#999";
    }
  };

  return (
    <div className="transaction-history-container">
      <div className="transaction-history-header">
        <div className="header-top">
          <div>
            <h1>Transaction History</h1>
            <p className="header-subtitle">View and manage all your transactions</p>
          </div>
          <button 
            className="back-btn"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Filters and Search */}
        <div className="filters-section">
          <div className="filter-row">
            <div className="filter-group">
              <label>Search</label>
              <input
                type="text"
                placeholder="Search by location, device, or amount..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-group">
              <label>Filter by Status</label>
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Transactions</option>
                <option value="SAFE">Safe</option>
                <option value="REVIEW">Review</option>
                <option value="FAKE">Fake</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Sort by</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest First</option>
                <option value="amount-high">Amount (High to Low)</option>
                <option value="amount-low">Amount (Low to High)</option>
                <option value="score-high">Risk Score (High to Low)</option>
                <option value="score-low">Risk Score (Low to High)</option>
              </select>
            </div>
          </div>

          <div className="transaction-stats">
            <div className="stat-item">
              <span className="stat-label">Total Transactions:</span>
              <span className="stat-value">{transactions.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Showing:</span>
              <span className="stat-value">{filteredTransactions.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Display */}
      <div className="transaction-history-content">
        {loading ? (
          <div className="loading-state">Loading transactions...</div>
        ) : filteredTransactions.length === 0 ? (
          <div className="empty-state-large">
            <div className="empty-icon">📋</div>
            <h2>No transactions found</h2>
            <p>
              {transactions.length === 0
                ? "You haven't analyzed any transactions yet. Start by analyzing a transaction on the Dashboard!"
                : "No transactions match your search criteria."}
            </p>
            <button 
              className="primary-btn"
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <div className="transactions-view">
            {/* Table View */}
            <div className="table-view">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Amount (₹)</th>
                    <th>Location</th>
                    <th>Device</th>
                    <th>Failed Logins</th>
                    <th>Status</th>
                    <th>Risk Level</th>
                    <th>Score</th>
                    <th>Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((t) => (
                    <tr key={t.id} className={`row-${t.status?.toLowerCase()}`}>
                      <td className="cell-datetime">
                        {new Date(t.timestamp || t.createdAt).toLocaleString()}
                      </td>
                      <td className="cell-amount">₹{t.amount.toLocaleString()}</td>
                      <td className="cell-location">{t.location}</td>
                      <td className="cell-device">{t.device}</td>
                      <td className="cell-failed-logins">{t.failedLogins}</td>
                      <td className="cell-status">
                        <span 
                          className={`status-badge status-${t.status?.toLowerCase()}`}
                          style={{ borderColor: getStatusColor(t.status) }}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="cell-risk-level">
                        <span 
                          className={`risk-badge risk-${t.riskLevel?.toLowerCase()}`}
                          style={{ color: getRiskLevelColor(t.riskLevel) }}
                        >
                          {t.riskLevel}
                        </span>
                      </td>
                      <td className="cell-score">
                        <span className="score-badge">{t.score}</span>
                      </td>
                      <td className="cell-confidence">{t.confidence}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Card View for Mobile */}
            <div className="card-view">
              {filteredTransactions.map((t) => (
                <div 
                  key={t.id} 
                  className={`transaction-card card-${t.status?.toLowerCase()}`}
                >
                  <div className="card-header">
                    <div className="card-date">
                      {new Date(t.timestamp || t.createdAt).toLocaleString()}
                    </div>
                    <span 
                      className={`status-badge status-${t.status?.toLowerCase()}`}
                      style={{ borderColor: getStatusColor(t.status) }}
                    >
                      {t.status}
                    </span>
                  </div>

                  <div className="card-body">
                    <div className="card-row">
                      <span className="card-label">Amount:</span>
                      <span className="card-value">₹{t.amount.toLocaleString()}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">Location:</span>
                      <span className="card-value">{t.location}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">Device:</span>
                      <span className="card-value">{t.device}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">Failed Logins:</span>
                      <span className="card-value">{t.failedLogins}</span>
                    </div>
                  </div>

                  <div className="card-footer">
                    <div className="card-risk">
                      <span className="card-label">Risk:</span>
                      <span 
                        className={`risk-badge risk-${t.riskLevel?.toLowerCase()}`}
                        style={{ color: getRiskLevelColor(t.riskLevel) }}
                      >
                        {t.riskLevel}
                      </span>
                    </div>
                    <div className="card-score">
                      <span className="card-label">Score:</span>
                      <span className="score-badge">{t.score}/100</span>
                    </div>
                    <div className="card-confidence">
                      <span className="card-label">Confidence:</span>
                      <span className="confidence-badge">{t.confidence}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TransactionHistory;
