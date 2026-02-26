import React from "react";
import Layout from "./Layout";
import "../styles/main.css";

function HelpSupport() {
  return (
    <Layout>
      <div className="page-wrapper">
        <div className="page-header">
          <h1>Help & Support</h1>
          <p>Get help with your account and transactions</p>
        </div>
        <div className="help-content">
          <div className="help-section">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-item">
              <h3>How do I add a new transaction?</h3>
              <p>Navigate to "Send Money" from the sidebar and fill in the transaction details.</p>
            </div>
            <div className="faq-item">
              <h3>How does fraud detection work?</h3>
              <p>Our system uses machine learning to analyze transaction patterns and detect suspicious activity.</p>
            </div>
            <div className="faq-item">
              <h3>How can I verify my account?</h3>
              <p>Go to Settings and complete your profile information including bank and UPI details.</p>
            </div>
          </div>
          <div className="help-section">
            <h2>Contact Support</h2>
            <p>Email: support@paysafeai.com</p>
            <p>Phone: +1 (555) 123-4567</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default HelpSupport;
