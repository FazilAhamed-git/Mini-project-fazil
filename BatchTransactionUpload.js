import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config/api";
import "../styles/main.css";

function BatchTransactionUpload() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [failureCount, setFailureCount] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setUploadComplete(false);
    setMessage("");
    setError("");

    if (!selectedFile.name.endsWith(".csv")) {
      setError("❌ Please select a CSV file");
      setFile(null);
      setPreview([]);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csv = event.target.result;
        const lines = csv.split("\n");

        if (lines.length < 2) {
          setError("❌ CSV file must contain header and at least one transaction");
          return;
        }

        const headers = lines[0].toLowerCase().split(",").map((h) => h.trim());
        const expectedHeaders = ["amount", "location", "device", "time", "failedlogins"];

        const missingHeaders = expectedHeaders.filter((h) => !headers.includes(h));
        if (missingHeaders.length > 0) {
          setError(
            `❌ Missing required headers: ${missingHeaders.join(", ")}`
          );
          return;
        }

        const transactions = [];
        let parseErrors = [];

        for (let i = 1; i < lines.length && i <= 100; i++) {
          if (!lines[i].trim()) continue;

          const values = lines[i].split(",").map((v) => v.trim());
          const transaction = {};

          for (let j = 0; j < headers.length; j++) {
            transaction[headers[j]] = values[j];
          }

          const validation = validateTransaction(transaction, i);
          if (validation.valid) {
            transactions.push({
              amount: parseFloat(transaction.amount),
              location: transaction.location,
              device: transaction.device,
              time: transaction.time,
              failedLogins: parseInt(transaction.failedlogins),
            });
          } else {
            parseErrors.push(`Row ${i}: ${validation.error}`);
          }
        }

        if (transactions.length === 0) {
          setError(`No valid transactions found. ${parseErrors.join("; ")}`);
          return;
        }

        setFile(selectedFile);
        setPreview(transactions);
        setError("");
        setMessage(`${transactions.length} transactions ready to upload`);
      } catch (err) {
        setError("Error parsing CSV file: " + err.message);
      }
    };

    reader.readAsText(selectedFile);
  };

  const validateTransaction = (transaction, rowNum) => {
    const amount = parseFloat(transaction.amount);
    if (isNaN(amount) || amount <= 0) {
      return { valid: false, error: "Invalid amount" };
    }

    if (!transaction.location) {
      return { valid: false, error: "Location is required" };
    }

    if (!transaction.device || !["Known", "Unknown"].includes(transaction.device)) {
      return { valid: false, error: 'Device must be "Known" or "Unknown"' };
    }

    if (!transaction.time || !["Day", "Night"].includes(transaction.time)) {
      return { valid: false, error: 'Time must be "Day" or "Night"' };
    }

    const failedLogins = parseInt(transaction.failedlogins);
    if (isNaN(failedLogins) || failedLogins < 0) {
      return { valid: false, error: "Invalid failed logins count" };
    }

    return { valid: true };
  };

  const handleUpload = async () => {
    if (preview.length === 0) {
      setError("No transactions to upload");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");
    setUploadProgress(0);
    setSuccessCount(0);
    setFailureCount(0);

    try {
      // Simulate upload progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const formData = new FormData();
      formData.append("email", user);
      formData.append("transactionsJson", JSON.stringify(preview));

      const response = await fetch(`${API_BASE_URL}/transactions/batch-upload`, {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        let errorMessage = `Upload failed: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // If response is not JSON, use status text
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      setSuccessCount(result.successCount || 0);
      setFailureCount(result.failureCount || 0);
      setUploadProgress(100);
      setPreview([]);
      setFile(null);

      if (result.successCount > 0 && result.failureCount === 0) {
        setMessage(
          `✅ Upload successful! ${result.successCount} transactions created`
        );
      } else if (result.successCount > 0 && result.failureCount > 0) {
        setMessage(
          `⚠️ Upload completed with issues: ${result.successCount} successful, ${result.failureCount} failed`
        );
      } else {
        setMessage("❌ All transactions failed to upload");
      }

      // Reset form after 3 seconds
      setTimeout(() => {
        setUploadProgress(0);
        setMessage("");
        setUploadComplete(true);
      }, 3000);
    } catch (err) {
      setError("Upload failed: " + err.message);
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const template = `amount,location,device,time,failedLogins
500.00,India,Known,Day,0
1200.50,USA,Unknown,Night,2
350.75,UK,Known,Day,0
2500.00,India,Unknown,Night,5`;

    const blob = new Blob([template], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transaction-template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="page-wrapper">
      <div className="batch-upload-container">
        {/* Header */}
        <div className="batch-header">
          <h1>📊 Batch Transaction Upload</h1>
          <p className="batch-subtitle">Import multiple transactions via CSV file</p>
        </div>

        {/* Step Indicator */}
        <div className="step-indicator">
          <div className={`step ${file ? "completed" : "active"}`}>
            <span className="step-number">1</span>
            <p>Upload CSV</p>
          </div>
          <div className="step-line"></div>
          <div className={`step ${preview.length > 0 ? "completed" : file ? "active" : ""}`}>
            <span className="step-number">2</span>
            <p>Preview</p>
          </div>
          <div className="step-line"></div>
          <div className={`step ${uploadComplete ? "completed" : uploadProgress > 0 ? "active" : ""}`}>
            <span className="step-number">3</span>
            <p>Complete</p>
          </div>
        </div>

        {/* Messages */}
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        {/* Main Content */}
        <div className="batch-content">
          {!uploadComplete ? (
            <>
              {/* Section 1: Upload Area */}
              {preview.length === 0 && (
                <div className="upload-card">
                  <div className="file-upload-area">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      className="file-input"
                      id="csv-file"
                      disabled={loading}
                    />
                    <label htmlFor="csv-file" className="file-label">
                      <div className="upload-icon">📁</div>
                      <p className="upload-text">Click to upload or drag and drop</p>
                      <p className="upload-hint">CSV files only (max 100 transactions)</p>
                    </label>
                  </div>

                  {file && (
                    <div className="file-info">
                      <p className="file-name">✓ {file.name}</p>
                      <p className="file-size">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  )}

                  {/* CSV Format Guide */}
                  <div className="format-guide">
                    <h3>📋 CSV Format</h3>
                    <div className="format-row">
                      <code className="format-code">amount,location,device,time,failedLogins</code>
                      <button onClick={handleDownloadTemplate} className="template-btn">
                        ⬇️ Download Template
                      </button>
                    </div>
                    
                    <div className="format-fields">
                      <div className="field-item">
                        <span className="field-name">amount</span>
                        <span className="field-desc">Decimal number (e.g., 500.00)</span>
                      </div>
                      <div className="field-item">
                        <span className="field-name">location</span>
                        <span className="field-desc">Text (e.g., India, USA)</span>
                      </div>
                      <div className="field-item">
                        <span className="field-name">device</span>
                        <span className="field-desc">Known or Unknown</span>
                      </div>
                      <div className="field-item">
                        <span className="field-name">time</span>
                        <span className="field-desc">Day or Night</span>
                      </div>
                      <div className="field-item">
                        <span className="field-name">failedLogins</span>
                        <span className="field-desc">Integer (e.g., 0, 1, 2)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Section 2: Preview & Upload */}
              {preview.length > 0 && (
                <div className="preview-card">
                  <h3>📊 Preview ({preview.length} transactions ready to upload)</h3>
                  
                  <div className="preview-table-wrapper">
                    <table className="preview-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Amount</th>
                          <th>Location</th>
                          <th>Device</th>
                          <th>Time</th>
                          <th>Failed Logins</th>
                        </tr>
                      </thead>
                      <tbody>
                        {preview.map((tx, idx) => (
                          <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td className="amount">${tx.amount.toFixed(2)}</td>
                            <td>{tx.location}</td>
                            <td><span className="device-badge">{tx.device}</span></td>
                            <td><span className="time-badge">{tx.time}</span></td>
                            <td>{tx.failedLogins}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {loading && (
                    <div className="progress-container">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
                      </div>
                      <p className="progress-text">{uploadProgress}% Complete</p>
                    </div>
                  )}

                  <div className="action-buttons">
                    <button
                      onClick={handleUpload}
                      disabled={loading}
                      className="btn-primary"
                    >
                      {loading ? "🔄 Uploading..." : "✓ Upload Transactions"}
                    </button>
                    <button
                      onClick={() => {
                        setPreview([]);
                        setFile(null);
                        setMessage("");
                      }}
                      disabled={loading}
                      className="btn-secondary"
                    >
                      Change File
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Section 3: Success Summary */
            <div className="success-card">
              <div className="success-icon">✅</div>
              <h2>Upload Successful!</h2>
              <div className="success-stats">
                <div className="stat">
                  <p className="stat-number">{successCount}</p>
                  <p className="stat-label">Transactions Uploaded</p>
                </div>
                {failureCount > 0 && (
                  <div className="stat warning">
                    <p className="stat-number">{failureCount}</p>
                    <p className="stat-label">Failed</p>
                  </div>
                )}
              </div>
              <div className="success-actions">
                <button onClick={() => navigate("/transaction-history")} className="btn-primary">
                  📊 View All Transactions
                </button>
                <button onClick={() => navigate("/dashboard")} className="btn-secondary">
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="batch-footer">
          <div className="info-box">
            <p><strong>💡 Tip:</strong> Use batch upload for importing transactions from bank statements or payment processors.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BatchTransactionUpload;
