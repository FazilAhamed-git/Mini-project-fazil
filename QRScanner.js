import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API_BASE_URL from "../config/api";
import "../styles/main.css";

function QRScanner() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Start camera and QR scanning
  const startScanning = async () => {
    try {
      setError("");
      setResult("");
      setAnalysisResult(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });

      streamRef.current = stream;
      videoRef.current.srcObject = stream;

      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play();
        setScanning(true);
        scanQRCode();
      };
    } catch (err) {
      setError("Camera access denied or not available. Please allow camera access and try again.");
      console.error("Error accessing camera:", err);
    }
  };

  // Stop camera
  const stopScanning = () => {
    setScanning(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // Scan QR code from video stream
  const scanQRCode = () => {
    if (!scanning || !videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    // Simple QR detection (this is a basic implementation)
    // In a real app, you'd use a proper QR library
    const qrData = detectQRFromImageData(imageData);

    if (qrData) {
      setResult(qrData);
      stopScanning();
      analyzeQRCode(qrData);
    } else {
      // Continue scanning
      requestAnimationFrame(scanQRCode);
    }
  };

  // Demo QR code detector (for college project - demonstrates fraud detection capability)
  // Note: In a production system, integrate with a proper QR code library like jsQR
  const detectQRFromImageData = (imageData) => {
    // This is a simplified placeholder that simulates QR code detection
    // Real QR code detection requires complex pattern recognition algorithms
    // For demo purposes, we analyze image brightness to simulate QR detection
    const data = imageData.data;
    let darkPixels = 0;
    let totalPixels = data.length / 4;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (r + g + b) / 3;
      if (brightness < 128) darkPixels++;
    }

    // Simulate QR detection based on pattern
    if (darkPixels > totalPixels * 0.3 && darkPixels < totalPixels * 0.7) {
      // For testing purposes: Generate demo QR code data to demonstrate fraud detection
      // In production, the library would decode actual QR codes
      const demoPaymentData = [
        { qr: "https://trusted-merchant.com/pay?amount=100", label: "Trusted Payment Link" },
        { qr: "upi://pay?pa=verified@bank&pn=RealMerchant&am=500", label: "Real UPI Payment" },
        { qr: "https://malicious-site.com/fake-payment", label: "Suspicious Payment Link" },
        { qr: "upi://pay?pa=hacker@fakebank&pn=FakeMerchant&am=1000", label: "Fake UPI Address" }
      ];
      const randomDemo = demoPaymentData[Math.floor(Math.random() * demoPaymentData.length)];
      return randomDemo.qr;
    }

    return null;
  };

  // Analyze QR code content
  const analyzeQRCode = async (qrData) => {
    setAnalyzing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/qr/analyze`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Email': user?.email || '',
        },
        body: JSON.stringify({ qrData }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze QR code');
      }

      const result = await response.json();
      setAnalysisResult(result);
    } catch (err) {
      setError("Failed to analyze QR code. Please try again.");
      console.error("Error analyzing QR:", err);
    } finally {
      setAnalyzing(false);
    }
  };

  // Manual QR input for testing
  const handleManualInput = () => {
    const manualData = prompt("Enter QR code data for testing:");
    if (manualData) {
      setResult(manualData);
      analyzeQRCode(manualData);
    }
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <div className="page-wrapper">
      <div className="qr-card">
        <div className="card-header">
          <h1>🔍 QR Code Scanner</h1>
          <p className="card-subtitle">Scan QR codes to check for fraud and security risks</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {!scanning && !result && (
          <div className="qr-instructions">
            <div className="qr-placeholder">
              <div className="qr-icon">📱</div>
              <p>Position QR code within the camera frame</p>
            </div>

            <div className="qr-actions">
              <button
                onClick={startScanning}
                className="scan-btn"
                disabled={!navigator.mediaDevices}
              >
                📷 Start Scanning
              </button>

              {!navigator.mediaDevices && (
                <p className="camera-warning">
                  ⚠️ Camera not available. Try manual input instead.
                </p>
              )}

              <button
                onClick={handleManualInput}
                className="manual-btn"
              >
                ✏️ Manual Input (Test)
              </button>
            </div>
          </div>
        )}

        {scanning && (
          <div className="scanner-container">
            <div className="video-container">
              <video ref={videoRef} className="qr-video" autoPlay muted playsInline />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              <div className="scan-overlay">
                <div className="scan-line"></div>
              </div>
            </div>

            <div className="scan-info">
              <p>🔄 Scanning for QR codes...</p>
              <button onClick={stopScanning} className="stop-btn">
                ⏹️ Stop Scanning
              </button>
            </div>
          </div>
        )}

        {result && (
          <div className="qr-result">
            <h3>📄 Scanned QR Code:</h3>
            <div className="qr-data">
              <code>{result}</code>
            </div>

            {analyzing && (
              <div className="analyzing">
                <div className="spinner"></div>
                <p>🔍 Analyzing QR code for security risks...</p>
              </div>
            )}

            {analysisResult && (
              <div className={`analysis-result ${analysisResult.safe ? 'safe' : 'unsafe'}`}>
                <h4>🛡️ Security Analysis:</h4>
                <div className="risk-level">
                  <span className={`risk-badge ${analysisResult.riskLevel.toLowerCase()}`}>
                    {analysisResult.riskLevel}
                  </span>
                  <span className="confidence">Confidence: {analysisResult.confidence}%</span>
                </div>

                <div className="analysis-details">
                  <p><strong>Status:</strong> {analysisResult.status}</p>
                  <p><strong>Score:</strong> {analysisResult.score}/100</p>
                  {analysisResult.reasons && analysisResult.reasons.length > 0 && (
                    <div className="reasons">
                      <strong>Detected Issues:</strong>
                      <ul>
                        {analysisResult.reasons.map((reason, index) => (
                          <li key={index}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="recommendations">
                  <h5>💡 Recommendations:</h5>
                  <ul>
                    {analysisResult.safe ? (
                      <>
                        <li>✅ This QR code appears safe to use</li>
                        <li>✅ Proceed with the transaction</li>
                      </>
                    ) : (
                      <>
                        <li>❌ Avoid using this QR code</li>
                        <li>⚠️ Potential security risk detected</li>
                        <li>🔍 Verify the source manually</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            )}

            <div className="result-actions">
              <button onClick={() => { setResult(""); setAnalysisResult(null); }} className="scan-again-btn">
                🔄 Scan Another
              </button>
              <button onClick={() => navigate("/dashboard")} className="dashboard-btn">
                🏠 Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QRScanner;
