import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  sendEmailOtp,
  sendPhoneOtp,
  verifyEmailOtp,
  verifyPhoneOtp,
  enableTwoFactor,
  disableTwoFactor,
  getVerificationStatus,
} from "../services/verificationService";
import "../styles/main.css";

function AccountVerification() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("email");
  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [otpType, setOtpType] = useState(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    fetchVerificationStatus();
  }, [user]);

  useEffect(() => {
    let interval;
    if (countdown > 0) {
      interval = setInterval(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  const fetchVerificationStatus = async () => {
    try {
      const response = await getVerificationStatus(user);
      setTwoFactorEnabled(response.twoFactorEnabled);
      setLoading(false);
    } catch (err) {
      setError("Failed to load verification status");
      setLoading(false);
    }
  };

  const handleSendEmailOtp = async () => {
    setError("");
    setMessage("");
    try {
      await sendEmailOtp(user);
      setOtpSent(true);
      setOtpType("email");
      setCountdown(60);
      setMessage("OTP sent to your email. Check your inbox.");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSendPhoneOtp = async () => {
    setError("");
    setMessage("");
    try {
      await sendPhoneOtp(user);
      setOtpSent(true);
      setOtpType("phone");
      setCountdown(60);
      setMessage("OTP sent to your phone.");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVerifyEmailOtp = async () => {
    setError("");
    setMessage("");
    if (!emailOtp) {
      setError("Please enter the OTP");
      return;
    }
    try {
      await verifyEmailOtp(user, emailOtp);
      setEmailVerified(true);
      setEmailOtp("");
      setOtpSent(false);
      setMessage("Email verified successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVerifyPhoneOtp = async () => {
    setError("");
    setMessage("");
    if (!phoneOtp) {
      setError("Please enter the OTP");
      return;
    }
    try {
      await verifyPhoneOtp(user, phoneOtp);
      setPhoneVerified(true);
      setPhoneOtp("");
      setOtpSent(false);
      setMessage("Phone verified successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEnableTwoFactor = async () => {
    setError("");
    setMessage("");
    if (!emailVerified) {
      setError("Please verify your email first");
      return;
    }
    try {
      await enableTwoFactor(user);
      setTwoFactorEnabled(true);
      setMessage("Two-factor authentication enabled successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDisableTwoFactor = async () => {
    setError("");
    setMessage("");
    try {
      await disableTwoFactor(user);
      setTwoFactorEnabled(false);
      setMessage("Two-factor authentication disabled.");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="settings-loading">Loading verification status...</div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="user-profile-card-container">
        <h2>Account Verification & Security</h2>
        <p className="subtitle">Set up two-factor authentication to secure your account</p>

        {message && <p className="success-text">{message}</p>}
        {error && <p className="error-text">{error}</p>}

        <div className="tabs">
          <button
            className={`tab-button ${activeTab === "email" ? "active" : ""}`}
            onClick={() => setActiveTab("email")}
          >
            📧 Email Verification
          </button>
          <button
            className={`tab-button ${activeTab === "phone" ? "active" : ""}`}
            onClick={() => setActiveTab("phone")}
          >
            📱 Phone Verification
          </button>
          <button
            className={`tab-button ${activeTab === "2fa" ? "active" : ""}`}
            onClick={() => setActiveTab("2fa")}
          >
            🔐 2FA Settings
          </button>
        </div>

        {activeTab === "email" && (
          <div className="verification-section">
            <div className="verification-status">
              <span className={emailVerified ? "verified" : "not-verified"}>
                {emailVerified ? "✓ Email Verified" : "✗ Email Not Verified"}
              </span>
            </div>

            {!emailVerified && (
              <>
                {!otpSent || otpType !== "email" ? (
                  <button onClick={handleSendEmailOtp} className="send-otp-btn">
                    Send OTP to Email
                  </button>
                ) : (
                  <>
                    <div className="otp-input-group">
                      <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={emailOtp}
                        onChange={(e) => setEmailOtp(e.target.value)}
                        maxLength="6"
                        className="otp-input"
                      />
                    </div>
                    <button onClick={handleVerifyEmailOtp} className="verify-btn">
                      Verify OTP
                    </button>
                    <div className="otp-countdown">
                      {countdown > 0 ? (
                        <p>Resend OTP in {countdown}s</p>
                      ) : (
                        <button onClick={handleSendEmailOtp} className="resend-btn">
                          Resend OTP
                        </button>
                      )}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === "phone" && (
          <div className="verification-section">
            <div className="verification-status">
              <span className={phoneVerified ? "verified" : "not-verified"}>
                {phoneVerified ? "✓ Phone Verified" : "✗ Phone Not Verified"}
              </span>
            </div>

            {!phoneVerified && (
              <>
                {!otpSent || otpType !== "phone" ? (
                  <button onClick={handleSendPhoneOtp} className="send-otp-btn">
                    Send OTP to Phone
                  </button>
                ) : (
                  <>
                    <div className="otp-input-group">
                      <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={phoneOtp}
                        onChange={(e) => setPhoneOtp(e.target.value)}
                        maxLength="6"
                        className="otp-input"
                      />
                    </div>
                    <button onClick={handleVerifyPhoneOtp} className="verify-btn">
                      Verify OTP
                    </button>
                    <div className="otp-countdown">
                      {countdown > 0 ? (
                        <p>Resend OTP in {countdown}s</p>
                      ) : (
                        <button onClick={handleSendPhoneOtp} className="resend-btn">
                          Resend OTP
                        </button>
                      )}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === "2fa" && (
          <div className="verification-section">
            <div className="twofa-status">
              <div className="twofa-info">
                <h3>Two-Factor Authentication</h3>
                <p>
                  Enhance your account security by requiring verification when logging in from
                  new devices.
                </p>
              </div>

              <div className="twofa-requirement">
                <p>
                  <strong>Requirement:</strong> Email must be verified first
                </p>
                {!emailVerified && (
                  <span className="requirement-warning">⚠️ Complete email verification first</span>
                )}
              </div>

              {emailVerified && (
                <div className="twofa-buttons">
                  {!twoFactorEnabled ? (
                    <button onClick={handleEnableTwoFactor} className="enable-btn">
                      🔓 Enable 2FA
                    </button>
                  ) : (
                    <>
                      <div className="twofa-enabled-info">
                        <p>✓ Two-Factor Authentication is <strong>ENABLED</strong></p>
                        <p className="info-text">Your account is now protected with 2FA</p>
                      </div>
                      <button onClick={handleDisableTwoFactor} className="disable-btn">
                        🔐 Disable 2FA
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="security-tips">
              <h4>🛡️ Security Tips:</h4>
              <ul>
                <li>Keep your email and phone number up to date</li>
                <li>Never share your OTP with anyone</li>
                <li>OTPs expire after 10 minutes</li>
                <li>Enable 2FA for maximum account security</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AccountVerification;
