import React, { useState } from "react";
import api from "../services/api";

export default function AddIncome({ user, onAdd }) {
  const [source, setSource] = useState("Salary");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));

  const submit = async (e) => {
    e.preventDefault();
    if (!user) return alert("User not logged in");

    try {
      await api.post("/incomes/add", {
        userId: user.id,
        source,
        amount: Number(amount),
        date
      });
      setSource("Salary"); setAmount(""); setDate(new Date().toISOString().slice(0,10));
      if (onAdd) onAdd(); // refresh dashboard
      alert("Income added");
    } catch (err) {
      console.error(err);
      alert("Failed to add income");
    }
  };

  return (
    <div className="card form-card">
      <h2>Add Income</h2>
      <form onSubmit={submit}>
        <label>Source</label>
        <input value={source} onChange={e => setSource(e.target.value)} required />

        <label>Amount</label>
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required />

        <label>Date</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} required />

        <button type="submit" className="btn">Add Income</button>
      </form>
    </div>
  );
}
