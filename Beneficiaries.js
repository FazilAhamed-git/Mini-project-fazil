import React from "react";
import Layout from "./Layout";
import "../styles/main.css";

function Beneficiaries() {
  return (
    <Layout>
      <div className="page-wrapper">
        <div className="page-header">
          <h1>Beneficiaries</h1>
          <p>Manage your saved beneficiaries</p>
        </div>
        <div className="beneficiaries-content">
          <div className="empty-state-card">
            <div className="empty-icon">👥</div>
            <h2>No Beneficiaries Added</h2>
            <p>Add beneficiaries to make quick transfers.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Beneficiaries;
