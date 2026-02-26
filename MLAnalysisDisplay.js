import React from "react";

/**
 * MLAnalysisDisplay Component
 * Shows detailed breakdown of ML models and fraud detection layers
 */
function MLAnalysisDisplay({ analysisData, status }) {
  if (!analysisData) {
    return null;
  }

  return (
    <div className="ml-analysis-container">
      {/* Status Explanation Card */}
      <div className={`status-card status-${status.toLowerCase()}`}>
        <div className="status-header">
          <h3>
            {status === "SAFE" && "✅ Transaction is SAFE"}
            {status === "REVIEW" && "⚠️ Transaction Requires REVIEW"}
            {status === "FAKE" && "🚨 Transaction is FRAUDULENT"}
          </h3>
          <p className="status-explanation">
            {status === "SAFE" && "This transaction appears legitimate and has low fraud risk."}
            {status === "REVIEW" && 
              "This transaction shows suspicious indicators and needs manual verification. " +
              "Multiple factors suggest potential fraud, but may also be a legitimate high-value transaction."}
            {status === "FAKE" && "This transaction shows strong fraud indicators and should be blocked immediately."}
          </p>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="analysis-section">
        <h4>📊 Fraud Score Details</h4>
        <div className="score-info">
          <div className="score-item">
            <span className="label">Final Score:</span>
            <span className={`score-value score-${status.toLowerCase()}`}>
              {analysisData.finalScore ? analysisData.finalScore.toFixed(1) : "N/A"} / 100
            </span>
          </div>
          <div className="score-item">
            <span className="label">Risk Level:</span>
            <span className="risk-badge">{analysisData.riskLevel || "Unknown"}</span>
          </div>
          <div className="score-item">
            <span className="label">Confidence:</span>
            <span className="confidence-value">{analysisData.confidence || 0}%</span>
          </div>
        </div>
      </div>

      {/* Layer Analysis */}
      {analysisData.layerAnalysis && (
        <div className="analysis-section">
          <h4>🔍 Multi-Layer Detection Analysis</h4>

          {/* Layer 1: Rule-Based */}
          {analysisData.layerAnalysis.layer1 && (
            <div className="layer-card layer-1">
              <div className="layer-header">
                <h5>⚡ Layer 1: Rule-Based Filter (Fast Screening)</h5>
                <span className="layer-score">{analysisData.layerAnalysis.layer1Score?.toFixed(1) || 0} / 100</span>
              </div>
              <div className="layer-content">
                <p className="layer-desc">
                  Fast screening using threshold rules - catches obvious fraud patterns
                </p>
                <div className="detection-items">
                  {analysisData.layerAnalysis.layer1.reasons && (
                    <div className="reasons-box">
                      <strong>Detection Factors:</strong>
                      <p>{analysisData.layerAnalysis.layer1.reasons}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Layer 2: ML Models */}
          {analysisData.layerAnalysis.mlModels && (
            <div className="layer-card layer-2">
              <div className="layer-header">
                <h5>🤖 Layer 2: ML Model Ensemble (Advanced Detection)</h5>
                <span className="layer-score">{analysisData.layerAnalysis.layer2Score?.toFixed(1) || 0} / 100</span>
              </div>
              <div className="layer-content">
                <p className="layer-desc">
                  Three independent ML models vote together for complex fraud pattern detection
                </p>

                {/* Random Forest */}
                {analysisData.layerAnalysis.mlModels.randomForest && (
                  <div className="model-card">
                    <div className="model-header">
                      <h6>🌲 Random Forest Model (88-92% accuracy)</h6>
                      <span className="model-score">
                        {analysisData.layerAnalysis.mlModels.randomForest.score?.toFixed(1) || 0}
                      </span>
                    </div>
                    <p className="model-desc">{analysisData.layerAnalysis.mlModels.randomForest.explanation}</p>
                  </div>
                )}

                {/* Logistic Regression */}
                {analysisData.layerAnalysis.mlModels.logisticRegression && (
                  <div className="model-card">
                    <div className="model-header">
                      <h6>📈 Logistic Regression (80-85% accuracy)</h6>
                      <span className="model-score">
                        {analysisData.layerAnalysis.mlModels.logisticRegression.score?.toFixed(1) || 0}
                      </span>
                    </div>
                    <p className="model-desc">
                      {analysisData.layerAnalysis.mlModels.logisticRegression.explanation}
                    </p>
                  </div>
                )}

                {/* Neural Network */}
                {analysisData.layerAnalysis.mlModels.neuralNetwork && (
                  <div className="model-card">
                    <div className="model-header">
                      <h6>🧠 Neural Network (85-90% accuracy)</h6>
                      <span className="model-score">
                        {analysisData.layerAnalysis.mlModels.neuralNetwork.score?.toFixed(1) || 0}
                      </span>
                    </div>
                    <p className="model-desc">
                      {analysisData.layerAnalysis.mlModels.neuralNetwork.explanation}
                    </p>
                  </div>
                )}

                <div className="ensemble-info">
                  <strong>Ensemble Voting:</strong>
                  <p>
                    All three models vote together. Their average score is weighted 60% in the final decision
                    (Layer 1 Rule-Based: 40%, Layer 2 ML Ensemble: 60%)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Final Decision Logic */}
          <div className="decision-logic">
            <h6>📋 Decision Logic</h6>
            <p>
              <strong>Final Score</strong> = (Layer1 × 40%) + (Layer2 × 60%)
              <br />
              <strong>Score Ranges:</strong>
              <br />
              • 0-50: <span className="label-safe">SAFE ✅</span> - Approve transaction
              <br />
              • 50-75: <span className="label-review">REVIEW ⚠️</span> - Manual verification needed
              <br />
              • 75-100: <span className="label-fake">FAKE 🚨</span> - Block transaction
            </p>
          </div>
        </div>
      )}

      {/* What is REVIEW Status */}
      {status === "REVIEW" && (
        <div className="info-card review-explanation">
          <h5>❓ What does "REVIEW" mean?</h5>
          <ul>
            <li>
              <strong>Borderline Score (50-75):</strong> The transaction has some suspicious indicators but is not
              definitively fraudulent
            </li>
            <li>
              <strong>Examples:</strong>
              <ul>
                <li>High transaction amount with unusual location</li>
                <li>Multiple failed login attempts (especially 5+)</li>
                <li>Transaction at unusual hours (night time)</li>
                <li>Unknown device or VPN usage</li>
              </ul>
            </li>
            <li>
              <strong>Action Required:</strong> A human operator should manually verify this transaction before
              approving it
            </li>
            <li>
              <strong>Common Causes:</strong> Legitimate large purchases from new locations, business travel,
              account access issues, but also potential fraud attempts
            </li>
          </ul>
        </div>
      )}

      <style jsx>{`
        .ml-analysis-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-top: 20px;
        }

        .status-card {
          border-radius: 10px;
          padding: 20px;
          border-left: 5px solid;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
        }

        .status-card.status-safe {
          border-color: #10b981;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05));
        }

        .status-card.status-review {
          border-color: #f59e0b;
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05));
        }

        .status-card.status-fake {
          border-color: #ef4444;
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05));
        }

        .status-header h3 {
          margin: 0 0 8px 0;
          font-size: 1.3em;
        }

        .status-explanation {
          margin: 0;
          font-size: 0.95em;
          color: #555;
        }

        .analysis-section {
          background: white;
          border-radius: 10px;
          padding: 20px;
          border: 1px solid #e5e7eb;
        }

        .analysis-section h4 {
          margin-top: 0;
          margin-bottom: 15px;
          color: #1f2937;
          font-size: 1.1em;
        }

        .score-info {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .score-item {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
          min-width: 200px;
        }

        .score-item .label {
          font-weight: 600;
          color: #555;
        }

        .score-value {
          font-size: 1.3em;
          font-weight: bold;
          padding: 5px 10px;
          border-radius: 5px;
        }

        .score-value.score-safe {
          color: #10b981;
          background: rgba(16, 185, 129, 0.1);
        }

        .score-value.score-review {
          color: #f59e0b;
          background: rgba(245, 158, 11, 0.1);
        }

        .score-value.score-fake {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }

        .risk-badge {
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 0.9em;
          font-weight: 600;
          background: #e5e7eb;
          color: #374151;
        }

        .confidence-value {
          font-size: 1.1em;
          font-weight: bold;
          color: #1f2937;
        }

        .layer-card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          margin-bottom: 15px;
          overflow: hidden;
        }

        .layer-card.layer-1 {
          border-left: 4px solid #3b82f6;
        }

        .layer-card.layer-2 {
          border-left: 4px solid #8b5cf6;
        }

        .layer-header {
          background: linear-gradient(90deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05));
          padding: 12px 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e5e7eb;
        }

        .layer-header h5 {
          margin: 0;
          font-size: 1em;
          color: #1f2937;
        }

        .layer-score {
          font-weight: bold;
          color: #3b82f6;
          font-size: 1.1em;
        }

        .layer-card.layer-2 .layer-score {
          color: #8b5cf6;
        }

        .layer-content {
          padding: 15px;
        }

        .layer-desc {
          margin: 0 0 12px 0;
          font-size: 0.95em;
          color: #666;
        }

        .reasons-box {
          background: white;
          padding: 12px;
          border-radius: 6px;
          border-left: 3px solid #3b82f6;
        }

        .reasons-box strong {
          display: block;
          margin-bottom: 8px;
          color: #1f2937;
        }

        .reasons-box p {
          margin: 0;
          font-size: 0.9em;
          color: #555;
          line-height: 1.5;
        }

        .model-card {
          background: white;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          padding: 12px;
          margin-bottom: 10px;
        }

        .model-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .model-header h6 {
          margin: 0;
          font-size: 0.95em;
          color: #1f2937;
        }

        .model-score {
          font-weight: bold;
          color: #8b5cf6;
          background: rgba(139, 92, 246, 0.1);
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 0.9em;
        }

        .model-desc {
          margin: 0;
          font-size: 0.85em;
          color: #666;
          line-height: 1.4;
        }

        .ensemble-info {
          background: #f3f4f6;
          padding: 12px;
          border-radius: 6px;
          margin-top: 10px;
          font-size: 0.9em;
        }

        .ensemble-info strong {
          display: block;
          margin-bottom: 6px;
          color: #1f2937;
        }

        .ensemble-info p {
          margin: 0;
          color: #555;
          line-height: 1.5;
        }

        .decision-logic {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05));
          padding: 15px;
          border-radius: 6px;
          border-left: 3px solid #3b82f6;
          margin-top: 10px;
        }

        .decision-logic h6 {
          margin: 0 0 10px 0;
          color: #1f2937;
        }

        .decision-logic p {
          margin: 0;
          font-size: 0.9em;
          color: #555;
          line-height: 1.6;
        }

        .label-safe {
          color: #10b981;
          font-weight: 600;
        }

        .label-review {
          color: #f59e0b;
          font-weight: 600;
        }

        .label-fake {
          color: #ef4444;
          font-weight: 600;
        }

        .info-card {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.05), rgba(245, 158, 11, 0.02));
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: 8px;
          padding: 15px;
        }

        .info-card h5 {
          margin: 0 0 12px 0;
          color: #f59e0b;
          font-size: 1em;
        }

        .info-card ul {
          margin: 0;
          padding-left: 20px;
        }

        .info-card li {
          margin-bottom: 8px;
          color: #555;
          line-height: 1.5;
        }

        .info-card strong {
          color: #1f2937;
        }

        .info-card ul ul {
          margin-top: 6px;
          margin-bottom: 6px;
        }

        .info-card ul ul li {
          margin-bottom: 4px;
        }
      `}</style>
    </div>
  );
}

export default MLAnalysisDisplay;
