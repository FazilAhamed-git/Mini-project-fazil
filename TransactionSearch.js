import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/main.css";

function TransactionSearch() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: "",
    status: "",
    riskLevel: "",
  });
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);

    try {
      let query = `http://localhost:8080/api/transactions?`;
      
      if (filters.startDate) query += `startDate=${filters.startDate}&`;
      if (filters.endDate) query += `endDate=${filters.endDate}&`;
      if (filters.minAmount) query += `minAmount=${filters.minAmount}&`;
      if (filters.maxAmount) query += `maxAmount=${filters.maxAmount}&`;
      if (filters.status) query += `status=${filters.status}&`;
      if (filters.riskLevel) query += `riskLevel=${filters.riskLevel}&`;

      const response = await fetch(query);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Search failed");
      }

      setResults(Array.isArray(data) ? data : data.transactions || []);
      setSearched(true);
    } catch (err) {
      setError(err.message || "Error searching transactions");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFilters({
      startDate: "",
      endDate: "",
      minAmount: "",
      maxAmount: "",
      status: "",
      riskLevel: "",
    });
    setResults([]);
    setSearched(false);
    setError("");
  };

  return (
    <div className="page-wrapper">
      <div className="search-container">
        <h2>Search & Filter Transactions</h2>

      <div className="search-form-container">
        <form onSubmit={handleSearch} className="search-form">
          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
              />
            </div>

            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Min Amount ($)</label>
              <input
                type="number"
                name="minAmount"
                placeholder="0"
                value={filters.minAmount}
                onChange={handleFilterChange}
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>Max Amount ($)</label>
              <input
                type="number"
                name="maxAmount"
                placeholder="999999"
                value={filters.maxAmount}
                onChange={handleFilterChange}
                step="0.01"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={filters.status} onChange={handleFilterChange}>
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="disputed">Disputed</option>
              </select>
            </div>

            <div className="form-group">
              <label>Risk Level</label>
              <select name="riskLevel" value={filters.riskLevel} onChange={handleFilterChange}>
                <option value="">All Risk Levels</option>
                <option value="low">Low Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="high">High Risk</option>
                <option value="critical">Critical Risk</option>
              </select>
            </div>
          </div>

          <div className="form-buttons">
            <button type="submit" className="search-btn">
              Search Transactions
            </button>
            <button type="button" className="reset-btn" onClick={handleReset}>
              Reset Filters
            </button>
          </div>
        </form>
      </div>

      {error && <p className="error-text">{error}</p>}

      {loading && <p className="loading-text">Searching...</p>}

      {searched && results.length === 0 && !loading && (
        <p className="info-text">No transactions found matching your criteria.</p>
      )}

      {results.length > 0 && (
        <div className="results-container">
          <h3>Search Results ({results.length} transactions)</h3>
          <table className="transactions-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Risk Level</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {results.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.id}</td>
                  <td>{new Date(transaction.date).toLocaleDateString()}</td>
                  <td>${transaction.amount?.toFixed(2)}</td>
                  <td>
                    <span className={`status ${transaction.status?.toLowerCase()}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td>
                    <span className={`risk ${transaction.riskLevel?.toLowerCase()}`}>
                      {transaction.riskLevel}
                    </span>
                  </td>
                  <td>{transaction.description || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </div>
    </div>
  );
}

export default TransactionSearch;
