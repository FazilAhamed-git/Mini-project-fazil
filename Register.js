import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import "../styles/main.css";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    upiId: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeStep, setActiveStep] = useState(1);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateStep1 = () => {
    const missing = [];
    if (!form.name) missing.push('Name');
    if (!form.email) missing.push('Email');
    if (!form.password) missing.push('Password');
    if (!form.confirmPassword) missing.push('Confirm Password');
    if (!form.phone) missing.push('Phone');
    
    if (missing.length > 0) {
      return `Please fill out required fields: ${missing.join(', ')}`;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) return "Enter a valid email address.";

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(form.phone)) return "Enter a valid 10-digit phone number.";

    if (form.password.length < 6)
      return "Password must be at least 6 characters.";

    if (form.password !== form.confirmPassword)
      return "Passwords do not match.";

    return "";
  };

  const validateStep2 = () => {
    const missing = [];
    if (!form.accountNumber) missing.push('Account Number');
    if (!form.bankName) missing.push('Bank Name');
    
    if (missing.length > 0) {
      return `Please fill out required fields: ${missing.join(', ')}`;
    }

    // Basic account number validation (10-16 digits)
    const accountRegex = /^\d{10,16}$/;
    if (!accountRegex.test(form.accountNumber)) return "Enter a valid account number (10-16 digits).";

    return "";
  };

  const validateStep3 = () => {
    if (!form.upiId) return "UPI ID is required.";
    
    // Basic UPI ID validation (format: user@bank)
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
    if (!upiRegex.test(form.upiId)) return "Enter a valid UPI ID (e.g., user@bank).";

    return "";
  };

  const handleNext = () => {
    // Clear prior error
    setError("");
    
    let err = "";
    if (activeStep === 1) err = validateStep1();
    else if (activeStep === 2) err = validateStep2();
    else if (activeStep === 3) err = validateStep3();

    if (err) {
      setError(err);
      console.warn("Validation error:", err);
      return;
    }

    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const err = validateStep3();
    if (err) {
      setError(err);
      return;
    }

    try {
      await registerUser(form);
      setSuccess("Account created successfully! Your bank account and UPI will be verified shortly.");
      setForm({
        name: "", email: "", password: "", confirmPassword: "", phone: "",
        accountNumber: "", ifscCode: "", bankName: "", upiId: ""
      });
      setActiveStep(1);
    } catch (e) {
      setError(e.message || e || "Registration failed. Please try again.");
    }
  };

  const renderStep1 = () => (
    <>
      <div className="step-indicator">
        <div className="step active">
          <span className="step-number">1</span>
          <p>Personal Details</p>
        </div>
        <div className="step-line"></div>
        <div className="step">
          <span className="step-number">2</span>
          <p>Bank Account</p>
        </div>
        <div className="step-line"></div>
        <div className="step">
          <span className="step-number">3</span>
          <p>UPI Setup</p>
        </div>
      </div>

      <input
        type="text"
        name="name"
        placeholder="Full name"
        value={form.name}
        onChange={handleChange}
      />

      <input
        type="email"
        name="email"
        placeholder="Work email"
        value={form.email}
        onChange={handleChange}
      />

      <input
        type="tel"
        name="phone"
        placeholder="Phone number (10 digits)"
        value={form.phone}
        onChange={handleChange}
      />

      <input
        type="password"
        name="password"
        placeholder="Password (min. 6 characters)"
        value={form.password}
        onChange={handleChange}
      />

      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm password"
        value={form.confirmPassword}
        onChange={handleChange}
      />
    </>
  );

  const renderStep2 = () => (
    <>
      <div className="step-indicator">
        <div className="step completed">
          <span className="step-number">1</span>
          <p>Personal Details</p>
        </div>
        <div className="step-line"></div>
        <div className="step active">
          <span className="step-number">2</span>
          <p>Bank Account</p>
        </div>
        <div className="step-line"></div>
        <div className="step">
          <span className="step-number">3</span>
          <p>UPI Setup</p>
        </div>
      </div>

      <div className="bank-info">
        <h3>🏦 Bank Account Details</h3>
        <p className="bank-subtitle">Link your bank account for seamless transactions</p>
      </div>

      <input
        type="text"
        name="accountNumber"
        placeholder="Account number (10-16 digits)"
        value={form.accountNumber}
        onChange={handleChange}
      />

      <input
        type="text"
        name="ifscCode"
        placeholder="IFSC code (optional)"
        value={form.ifscCode}
        onChange={handleChange}
      />

      <input
        type="text"
        name="bankName"
        placeholder="Bank name"
        value={form.bankName}
        onChange={handleChange}
      />
    </>
  );

  const renderStep3 = () => (
    <>
      <div className="step-indicator">
        <div className="step completed">
          <span className="step-number">1</span>
          <p>Personal Details</p>
        </div>
        <div className="step-line"></div>
        <div className="step completed">
          <span className="step-number">2</span>
          <p>Bank Account</p>
        </div>
        <div className="step-line"></div>
        <div className="step active">
          <span className="step-number">3</span>
          <p>UPI Setup</p>
        </div>
      </div>

      <div className="upi-info">
        <h3>💳 UPI Setup</h3>
        <p className="upi-subtitle">Set up UPI for instant payments</p>
      </div>

      <input
        type="text"
        name="upiId"
        placeholder="UPI ID (e.g., user@bank)"
        value={form.upiId}
        onChange={handleChange}
      />

      <div className="upi-tips">
        <h4>💡 UPI Tips:</h4>
        <ul>
          <li>Format: username@bankname (e.g., john@ybl)</li>
          <li>Common UPI handles: @ybl, @sbi, @okicici, @okhdfcbank</li>
          <li>Will be used for instant peer-to-peer transfers</li>
        </ul>
      </div>
    </>
  );

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Create your account</h2>
        <p className="subtitle">
          Set up access to the fake transaction detection dashboard.
        </p>

        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}

        {activeStep === 1 && renderStep1()}
        {activeStep === 2 && renderStep2()}
        {activeStep === 3 && renderStep3()}

        <div className="form-actions">
          {activeStep > 1 && (
            <button type="button" onClick={handleBack} className="btn-secondary">
              ← Back
            </button>
          )}

          {activeStep < 3 ? (
            <button type="button" onClick={handleNext} className="btn-primary">
              Next →
            </button>
          ) : (
            <button type="submit" className="btn-primary">
              Create Account
            </button>
          )}
        </div>

        <p className="auth-link">
          Already have an account?{" "}
          <span className="link-like" onClick={() => navigate("/login")}>
            Sign in
          </span>
        </p>
      </form>
    </div>
  );
}

export default Register;

