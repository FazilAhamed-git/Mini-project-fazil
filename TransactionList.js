import React from "react";

function TransactionList() {
  const transactions = [
    { id: 1, receiver: "ACC1001", amount: 5000, status: "Genuine" },
    { id: 2, receiver: "ACC1005", amount: 45000, status: "Fake" }
  ];

  return (
    <div>
      <h3>Transaction History</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Receiver</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.receiver}</td>
              <td>{t.amount}</td>
              <td className={t.status === "Fake" ? "fake" : "genuine"}>
                {t.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionList;
