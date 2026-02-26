import React from "react";
import Layout from "./Layout";
import NewTransaction from "./NewTransaction";
import "../styles/main.css";

function SendMoney() {
  return (
    <Layout>
      <div className="page-wrapper">
        <NewTransaction />
      </div>
    </Layout>
  );
}

export default SendMoney;
