import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/main.css";

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/new-transaction", label: "New Transaction", icon: "✈️" },
    { path: "/transaction-history", label: "Transactions", icon: "🕐" },
    { path: "/batch-upload", label: "Batch Upload", icon: "📦" },
    { path: "/settings", label: "Settings", icon: "⚙️" },
    { path: "/help", label: "Help & Support", icon: "❓" },
  ];

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon">💳</div>
            <span className="logo-text">PaySafeAI</span>
          </div>
          <div className="sidebar-search">
            <input type="text" placeholder="Q Quick search..." className="sidebar-search-input" />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <div
              key={item.path}
              className={`nav-item ${isActive(item.path) ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          {/* Logout moved to Sign Out button in header */}
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content-wrapper">
        {/* Top Header */}
        <header className="top-header">
          <div className="header-search">
            <input type="text" placeholder="Q Quick search..." className="header-search-input" />
          </div>
          <div className="header-actions">
            <div className="notification-icon">🔔</div>
            <button
              className="user-avatar-header"
              onClick={() => navigate("/user-profile")}
              title="View Profile"
            >
              👤
            </button>
            <button className="sign-out-btn" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
