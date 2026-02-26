import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createTransaction } from "../services/transactionService";
import MLAnalysisDisplay from "./MLAnalysisDisplay";
import "../styles/main.css";
import TimeOfDaySelect from "./TimeOfDaySelect";

function NewTransaction() {
  const [amount, setAmount] = useState("");
  const [location, setLocation] = useState("");
  const [device, setDevice] = useState("Known");
  const [time, setTime] = useState(() => {
    // Auto-detect day/night based on current time
    const hours = new Date().getHours();
    return hours >= 6 && hours < 18 ? "Day" : "Night";
  });
  const [failedLogins, setFailedLogins] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [analysisStatus, setAnalysisStatus] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAmountChange = (e) => {
    // Allow max 6 digits
    let value = e.target.value;
    if (value && value.replace(/[^0-9.]/g, '').split('.')[0].length > 6) {
      return; // Prevent more than 6 digits
    }
    setAmount(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!amount || !location || !device || !time) {
      setError("❌ Please fill in all required fields.");
      return;
    }

    if (parseFloat(amount) <= 0) {
      setError("❌ Amount must be greater than 0.");
      return;
    }

    if (amount.replace(/[^0-9]/g, '').length > 6) {
      setError("❌ Amount cannot exceed 999999 (6 digits max).");
      return;
    }

    if (location.trim().length < 2) {
      setError("❌ Location must be at least 2 characters.");
      return;
    }

    setLoading(true);

    try {
      const transactionData = {
        amount: parseFloat(amount),
        location: location.trim(),
        device,
        time,
        failedLogins: failedLogins ? parseInt(failedLogins) : 0,
      };

      const result = await createTransaction(transactionData);

      // Store analysis data for display
      setAnalysisData(result);
      setAnalysisStatus(result.status);
      setSuccess(`✓ Transaction Analyzed! Status: ${result.status}`);

      // Show analysis for 5 seconds before redirecting
      setTimeout(() => {
        setAmount("");
        setLocation("");
        setDevice("Known");
        setTime("Day");
        setFailedLogins("");
        setSuccess("");
        setAnalysisData(null);
        setAnalysisStatus(null);
        navigate("/dashboard");
      }, 5000);
    } catch (err) {
      setError("❌ " + (err.message || "Failed to submit transaction. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="transaction-card">
        <div className="card-header">
          <h1>📝 New Transaction</h1>
          <p className="card-subtitle">Submit a transaction for fraud detection analysis</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* Display ML Analysis Results */}
        {analysisData && analysisStatus && (
          <MLAnalysisDisplay analysisData={analysisData} status={analysisStatus} />
        )}

        <form onSubmit={handleSubmit} className="transaction-form">
          {/* Amount */}
          <div className="form-group">
            <label htmlFor="amount">Amount * ($) - Max 999999</label>
            <input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={handleAmountChange}
              step="0.01"
              min="0"
              max="999999"
              required
              disabled={loading}
            />
            <p className="field-hint">Enter the transaction amount (max 6 digits)</p>
          </div>

          {/* Location */}
          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              id="location"
              type="text"
              placeholder="e.g., India, USA, UK"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              disabled={loading}
            />
            <p className="field-hint">Where the transaction occurred</p>
          </div>

          {/* Device */}
          <div className="form-group">
            <label htmlFor="device">Device *</label>
            <TimeOfDaySelect
              value={device}
              onChange={(v) => setDevice(v)}
              disabled={loading}
              options={[
                { value: "Known", label: "Known Device", emoji: "✓" },
                { value: "Unknown", label: "Unknown Device", emoji: "❓" },
              ]}
            />
            <p className="field-hint">Is this device recognized?</p>
          </div>

          {/* Time */}
          <div className="form-group">
            <label htmlFor="time">Time of Day *</label>
            <TimeOfDaySelect value={time} onChange={(v) => setTime(v)} disabled={loading} />
            <p className="field-hint">When did the transaction occur?</p>
          </div>

          {/* Failed Logins */}
          <div className="form-group">
            <label htmlFor="failedLogins">Failed Login Attempts ⚠️</label>
            <input
              id="failedLogins"
              type="number"
              placeholder="0"
              value={failedLogins}
              onChange={(e) => setFailedLogins(e.target.value)}
              min="0"
              disabled={loading}
            />
            <p className="field-hint">Higher values significantly increase fraud risk score</p>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="submit-btn"
          >
            {loading ? "🔄 Analyzing..." : "✓ Analyze Transaction"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewTransaction;
