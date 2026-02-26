import React, { useState } from "react";

function TransactionForm() {
  const [amount, setAmount] = useState("");
  const [receiver, setReceiver] = useState("");

  return (
    <div className="form-box">
      <h3>New Transaction</h3>

      <div className="form-group">
        <label htmlFor="receiver">Receiver Account</label>
        <input
          id="receiver"
          type="text"
          placeholder="Enter receiver account"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <button type="submit" className="submit-btn">Submit</button>
    </div>
  );
}

export default TransactionForm;
