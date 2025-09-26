import React, { useState } from "react";
import api from "../services/api";

export default function AddExpense({ user, onAdd }) {
  const [category, setCategory] = useState("Food");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [note, setNote] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!user) return alert("User not logged in");

    try {
      const res = await api.post("/expenses/add", {
        userId: user.id,
        category,
        amount: Number(amount),
        date,
        note
      });
      setCategory("Food"); setAmount(""); setDate(new Date().toISOString().slice(0,10)); setNote("");
      if (onAdd) onAdd(); // refresh dashboard
      alert("Expense added");
    } catch (err) {
      console.error(err);
      alert("Failed to add expense");
    }
  };

  return (
    <div className="card form-card">
      <h2>Add Expense</h2>
      <form onSubmit={submit}>
        <label>Category</label>
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option>Food</option>
          <option>Rent</option>
          <option>Transport</option>
          <option>Shopping</option>
          <option>Entertainment</option>
          <option>Utilities</option>
          <option>Other</option>
        </select>

        <label>Amount</label>
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required />

        <label>Date</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} required />

        <label>Note (optional)</label>
        <input value={note} onChange={e => setNote(e.target.value)} />

        <button type="submit" className="btn">Add Expense</button>
      </form>
    </div>
  );
}
