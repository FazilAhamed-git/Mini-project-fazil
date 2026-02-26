import React from "react";
import Layout from "./Layout";
import "../styles/main.css";

function Statements() {
  return (
    <Layout>
      <div className="page-wrapper">
        <div className="page-header">
          <h1>Statements</h1>
          <p>View and download your account statements</p>
        </div>
        <div className="statements-content">
          <div className="empty-state-card">
            <div className="empty-icon">📄</div>
            <h2>No Statements Available</h2>
            <p>Your account statements will appear here once transactions are processed.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Statements;
