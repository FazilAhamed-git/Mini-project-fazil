import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API_BASE_URL from "../config/api";
import Layout from "./Layout";
import "../styles/main.css";

function Settings() {
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
  const [loadedProfile, setLoadedProfile] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingBank, setEditingBank] = useState(false);
  const [editingUpi, setEditingUpi] = useState(false);
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
      const fetched = {
        name: data.name || "",
        phone: data.phone || "",
        company: data.company || "",
        timezone: data.timezone || "UTC",
        accountNumber: data.accountNumber || "",
        ifscCode: data.ifscCode || "",
        bankName: data.bankName || "",
        upiId: data.upiId || "",
      };
      setLoadedProfile(fetched);
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
      // update stored loaded profile and exit any edit mode
      setLoadedProfile(profileData);
      setEditingProfile(false);
      setEditingBank(false);
      setEditingUpi(false);
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
    return <div className="settings-loading">Loading settings...</div>;
  }

  return (
    <Layout>
      <div className="settings-page">
        <h1 className="settings-title">Settings</h1>

      {message && <div className="settings-message success">{message}</div>}
      {error && <div className="settings-message error">{error}</div>}

      <div className="settings-tabs">
        <button
          className={`settings-tab ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          Personal Info
        </button>
        <button
          className={`settings-tab ${activeTab === "bank" ? "active" : ""}`}
          onClick={() => setActiveTab("bank")}
        >
          Bank Account
        </button>
        <button
          className={`settings-tab ${activeTab === "upi" ? "active" : ""}`}
          onClick={() => setActiveTab("upi")}
        >
          UPI Setup
        </button>
        <button
          className={`settings-tab ${activeTab === "password" ? "active" : ""}`}
          onClick={() => setActiveTab("password")}
        >
          Security
        </button>
      </div>

      <div className="settings-content">
        {activeTab === "profile" && (
          <div>
            {!editingProfile ? (
              <div className="profile-summary">
                <p><strong>Full Name:</strong> {loadedProfile?.name || "(not set)"}</p>
                <p><strong>Phone:</strong> {loadedProfile?.phone || "(not set)"}</p>
                <p><strong>Company:</strong> {loadedProfile?.company || "(not set)"}</p>
                <p><strong>Timezone:</strong> {loadedProfile?.timezone || "UTC"}</p>
                <button className="settings-edit-btn" onClick={() => { setProfileData(loadedProfile || {}); setEditingProfile(true); }}>Edit</button>
              </div>
            ) : (
              <form onSubmit={handleProfileSubmit} className="settings-form" autoComplete="off">
                <input type="text" name="__no_autofill" autoComplete="off" style={{display:'none'}} />
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                  />
                </div>

                <div className="form-group">
                  <label>Company</label>
                  <input
                    type="text"
                    name="company"
                    value={profileData.company}
                    onChange={handleProfileChange}
                  />
                </div>

                <div className="form-group">
                  <label>Timezone</label>
                  <select name="timezone" value={profileData.timezone} onChange={handleProfileChange}>
                    <option value="UTC">UTC</option>
                    <option value="EST">EST (UTC-5)</option>
                    <option value="CST">CST (UTC-6)</option>
                    <option value="MST">MST (UTC-7)</option>
                    <option value="PST">PST (UTC-8)</option>
                    <option value="IST">IST (UTC+5:30)</option>
                    <option value="CET">CET (UTC+1)</option>
                    <option value="JST">JST (UTC+9)</option>
                  </select>
                </div>

                <div className="settings-form-actions">
                  <button type="submit" className="settings-submit-btn">Save</button>
                  <button type="button" className="settings-cancel-btn" onClick={() => { setEditingProfile(false); setProfileData({ name: "", phone: "", company: "", timezone: "UTC", accountNumber: "", ifscCode: "", bankName: "", upiId: "" }); }}>Cancel</button>
                </div>
              </form>
            )}
          </div>
        )}

        {activeTab === "bank" && (
          <div>
            {!editingBank ? (
              <div className="profile-summary">
                <p><strong>Account Number:</strong> {loadedProfile?.accountNumber ? loadedProfile.accountNumber.replace(/.(?=.{4})/g, '*') : '(not set)'}</p>
                <p><strong>IFSC Code:</strong> {loadedProfile?.ifscCode || '(not set)'}</p>
                <p><strong>Bank Name:</strong> {loadedProfile?.bankName || '(not set)'}</p>
                <button className="settings-edit-btn" onClick={() => { setProfileData(loadedProfile || {}); setEditingBank(true); }}>Edit</button>
              </div>
            ) : (
              <form onSubmit={handleProfileSubmit} className="settings-form" autoComplete="off">
                <input type="text" name="__no_autofill_bank" autoComplete="off" style={{display:'none'}} />
                <div className="form-group">
                  <label>Account Number</label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={profileData.accountNumber}
                    onChange={handleProfileChange}
                    className="masked-input"
                  />
                </div>

                <div className="form-group">
                  <label>IFSC Code</label>
                  <input
                    type="text"
                    name="ifscCode"
                    value={profileData.ifscCode}
                    onChange={handleProfileChange}
                    pattern="[A-Za-z]{4}[0-9]{7}"
                    title="Format: 4 letters + 7 digits (e.g., SBIN0002499)"
                  />
                </div>

                <div className="form-group">
                  <label>Bank Name</label>
                  <input
                    type="text"
                    name="bankName"
                    value={profileData.bankName}
                    onChange={handleProfileChange}
                  />
                </div>

                <div className="settings-form-actions">
                  <button type="submit" className="settings-submit-btn">Save</button>
                  <button type="button" className="settings-cancel-btn" onClick={() => { setEditingBank(false); setProfileData(loadedProfile || {}); }}>Cancel</button>
                </div>
              </form>
            )}
          </div>
        )}

        {activeTab === "upi" && (
          <div>
            {!editingUpi ? (
              <div className="profile-summary">
                <p><strong>UPI ID:</strong> {loadedProfile?.upiId || '(not set)'}</p>
                <button className="settings-edit-btn" onClick={() => { setProfileData(loadedProfile || {}); setEditingUpi(true); }}>Edit</button>
              </div>
            ) : (
              <form onSubmit={handleProfileSubmit} className="settings-form" autoComplete="off">
                <input type="text" name="__no_autofill_upi" autoComplete="off" style={{display:'none'}} />
                <div className="form-group">
                  <label>UPI ID</label>
                  <input
                    type="text"
                    name="upiId"
                    value={profileData.upiId}
                    onChange={handleProfileChange}
                    placeholder="user@bank"
                    pattern="[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+"
                    title="Format: username@bankname"
                  />
                </div>

                <div className="settings-form-actions">
                  <button type="submit" className="settings-submit-btn">Save</button>
                  <button type="button" className="settings-cancel-btn" onClick={() => { setEditingUpi(false); setProfileData(loadedProfile || {}); }}>Cancel</button>
                </div>
              </form>
            )}
          </div>
        )}

        {activeTab === "password" && (
          <form onSubmit={handlePasswordSubmit} className="settings-form" autoComplete="off">
            <input type="password" name="__no_autofill_pass" autoComplete="new-password" style={{display:'none'}} />
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
                minLength="6"
              />
            </div>

            <button type="submit" className="settings-submit-btn">Change Password</button>
          </form>
        )}
      </div>
      </div>
    </Layout>
  );
}

export default Settings;
