import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import NewTransaction from "./components/NewTransaction";
import TransactionHistory from "./components/TransactionHistory";
import UserProfile from "./components/UserProfile";
import TransactionSearch from "./components/TransactionSearch";
import AccountVerification from "./components/AccountVerification";
import BatchTransactionUpload from "./components/BatchTransactionUpload";
import QRScanner from "./components/QRScanner";
import Settings from "./components/Settings";
import Statements from "./components/Statements";
import Beneficiaries from "./components/Beneficiaries";
import HelpSupport from "./components/HelpSupport";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

function AppRoutes() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  return (
    <Routes>
      {/* Redirect authenticated users away from login/register */}
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
      
      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/new-transaction"
        element={
          <ProtectedRoute>
            <Layout>
              <NewTransaction />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/transaction-history"
        element={
          <ProtectedRoute>
            <Layout>
              <TransactionHistory />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-profile"
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/search-transactions"
        element={
          <ProtectedRoute>
            <Layout>
              <TransactionSearch />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/account-verification"
        element={
          <ProtectedRoute>
            <Layout>
              <AccountVerification />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/batch-upload"
        element={
          <ProtectedRoute>
            <Layout>
              <BatchTransactionUpload />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/qr-scanner"
        element={
          <ProtectedRoute>
            <Layout>
              <QRScanner />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/statements"
        element={
          <ProtectedRoute>
            <Statements />
          </ProtectedRoute>
        }
      />
      <Route
        path="/beneficiaries"
        element={
          <ProtectedRoute>
            <Beneficiaries />
          </ProtectedRoute>
        }
      />
      <Route
        path="/help"
        element={
          <ProtectedRoute>
            <HelpSupport />
          </ProtectedRoute>
        }
      />
      
      {/* Default route */}
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
