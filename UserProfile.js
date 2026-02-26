import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API_BASE_URL from "../config/api";
import Layout from "./Layout";
import "../styles/main.css";

function UserProfile() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
    company: "",
    timezone: "UTC",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    upiId: "",
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    fetchUserProfile();
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile/${user?.email}`);
      const data = await response.json();
      setProfileData({
        name: data.name || "",
        phone: data.phone || "",
        company: data.company || "",
        timezone: data.timezone || "UTC",
        accountNumber: data.accountNumber || "",
        ifscCode: data.ifscCode || "",
        bankName: data.bankName || "",
        upiId: data.upiId || "",
      });
      setLoading(false);
    } catch (err) {
      setError("Failed to load profile");
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/users/profile/${user?.email}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to update profile");
      }

      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err.message || "Error updating profile");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/change-password/${user?.email}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to change password");
      }

      setMessage("Password changed successfully!");
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err.message || "Error changing password");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="settings-loading">Loading profile...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="user-profile-page">
        <div className="user-profile-card-container">
        <h2>User Profile</h2>

        {message && <p className="success-text">{message}</p>}
        {error && <p className="error-text">{error}</p>}

        <div className="tabs">
          <button
            className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            📱 Personal Info
          </button>
          <button
            className={`tab-button ${activeTab === "bank" ? "active" : ""}`}
            onClick={() => setActiveTab("bank")}
          >
            🏦 Bank Account
          </button>
          <button
            className={`tab-button ${activeTab === "upi" ? "active" : ""}`}
            onClick={() => setActiveTab("upi")}
          >
            💳 UPI Setup
          </button>
          <button
            className={`tab-button ${activeTab === "password" ? "active" : ""}`}
            onClick={() => setActiveTab("password")}
          >
            🔒 Change Password
          </button>
        </div>

        {activeTab === "profile" && (
          <form onSubmit={handleProfileSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              name="name"
              value={profileData.name}
              onChange={handleProfileChange}
              required
            />

            <input
              type="tel"
              placeholder="Phone Number"
              name="phone"
              value={profileData.phone}
              onChange={handleProfileChange}
            />

            <input
              type="text"
              placeholder="Company"
              name="company"
              value={profileData.company}
              onChange={handleProfileChange}
            />

            <select
              name="timezone"
              value={profileData.timezone}
              onChange={handleProfileChange}
            >
              <option value="UTC">UTC</option>
              <option value="EST">EST (UTC-5)</option>
              <option value="CST">CST (UTC-6)</option>
              <option value="MST">MST (UTC-7)</option>
              <option value="PST">PST (UTC-8)</option>
              <option value="IST">IST (UTC+5:30)</option>
              <option value="CET">CET (UTC+1)</option>
              <option value="JST">JST (UTC+9)</option>
            </select>

            <button type="submit">Update Profile</button>
          </form>
        )}

        {activeTab === "bank" && (
          <form onSubmit={handleProfileSubmit}>
            <div className="bank-section">
              <h3>🏦 Bank Account Details</h3>
              <p className="section-subtitle">Manage your linked bank account</p>
            </div>

            <input
              type="text"
              placeholder="Account Number (masked for security)"
              name="accountNumber"
              value={profileData.accountNumber ? profileData.accountNumber.replace(/.(?=.{4})/g, '*') : ""}
              onChange={handleProfileChange}
              disabled
              className="masked-input"
            />

            <input
              type="text"
              placeholder="IFSC Code"
              name="ifscCode"
              value={profileData.ifscCode}
              onChange={handleProfileChange}
              pattern="[A-Za-z]{4}[0-9]{7}"
              title="Format: 4 letters + 7 digits (e.g., SBIN0002499)"
            />

            <input
              type="text"
              placeholder="Bank Name"
              name="bankName"
              value={profileData.bankName}
              onChange={handleProfileChange}
            />

            <div className="account-status">
              <span className={`status-badge ${profileData.accountVerified ? 'verified' : 'pending'}`}>
                {profileData.accountVerified ? '✓ Account Verified' : '⏳ Account Pending Verification'}
              </span>
            </div>

            <div className="bank-tips">
              <h4>💡 Bank Account Tips:</h4>
              <ul>
                <li>Account verification may take 1-2 business days</li>
                <li>Ensure IFSC code matches your bank branch</li>
                <li>Contact support if verification fails</li>
              </ul>
            </div>

            <button type="submit" className="btn-primary">Update Bank Details</button>
          </form>
        )}

        {activeTab === "upi" && (
          <form onSubmit={handleProfileSubmit}>
            <div className="upi-section">
              <h3>💳 UPI Setup</h3>
              <p className="section-subtitle">Manage your UPI payment methods</p>
            </div>

            <input
              type="text"
              placeholder="UPI ID (e.g., user@bank)"
              name="upiId"
              value={profileData.upiId}
              onChange={handleProfileChange}
              pattern="[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+"
              title="Format: username@bankname"
            />

            <div className="upi-status">
              <span className={`status-badge ${profileData.upiVerified ? 'verified' : 'pending'}`}>
                {profileData.upiVerified ? '✓ UPI Verified' : '⏳ UPI Pending Verification'}
              </span>
            </div>

            <div className="upi-tips">
              <h4>💡 UPI Tips:</h4>
              <ul>
                <li>Common UPI handles: @ybl, @sbi, @okicici, @okhdfcbank</li>
                <li>UPI enables instant peer-to-peer transfers</li>
                <li>Link multiple UPI IDs for different banks</li>
              </ul>
            </div>

            <button type="submit" className="btn-primary">Update UPI Details</button>
          </form>
        )}

        {activeTab === "password" && (
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              placeholder="Current Password"
              name="oldPassword"
              value={passwordData.oldPassword}
              onChange={handlePasswordChange}
              required
            />

            <input
              type="password"
              placeholder="New Password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
              minLength="6"
            />

            <input
              type="password"
              placeholder="Confirm New Password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
              minLength="6"
            />

            <button type="submit" className="btn-primary">Change Password</button>
          </form>
        )}
        </div>
      </div>
    </Layout>
  );
}

export default UserProfile;
