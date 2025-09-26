import React, { useEffect, useState } from "react";
import api from "../services/api";
import ExpenseChart from "../components/ExpenseChart";
import AddExpense from "./AddExpense";
import AddIncome from "./AddIncome";
import Savings from "./Savings";

export default function Dashboard({ user }) {
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [summary, setSummary] = useState({ totalExpense: 0, totalIncome: 0 });
  const [reload, setReload] = useState(false); // trigger data refresh

  // Fetch data from backend
  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const [eRes, iRes] = await Promise.all([
          api.get(`/expenses/${user.id}`),
          api.get(`/incomes/${user.id}`)
        ]);
        const exp = eRes.data || [];
        const inc = iRes.data || [];
        setExpenses(exp);
        setIncomes(inc);

        const totalExpense = exp.reduce((s, x) => s + Number(x.amount || 0), 0);
        const totalIncome = inc.reduce((s, x) => s + Number(x.amount || 0), 0);
        setSummary({ totalExpense, totalIncome });
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [user, reload]); // refresh when reload toggles

  const balance = (summary.totalIncome - summary.totalExpense).toFixed(2);

  // callback to refresh dashboard
  const handleAdd = () => setReload(prev => !prev);

  return (
    <div>
      <h2>Welcome, {user?.username}</h2>

      <div className="grid">
        <div className="card small">
          <h4>Total Income</h4>
          <p className="big">₹ {summary.totalIncome.toFixed(2)}</p>
        </div>
        <div className="card small">
          <h4>Total Expense</h4>
          <p className="big">₹ {summary.totalExpense.toFixed(2)}</p>
        </div>
        <div className="card small">
          <h4>Balance</h4>
          <p className="big">₹ {balance}</p>
        </div>
      </div>

      <ExpenseChart expenses={expenses} />

      <div className="card">
        <h3>Recent expenses</h3>
        <table className="table">
          <thead>
            <tr><th>Date</th><th>Category</th><th>Amount</th></tr>
          </thead>
          <tbody>
            {expenses.slice(0,8).map(e => (
              <tr key={e.id}>
                <td>{new Date(e.date).toLocaleDateString()}</td>
                <td>{e.category}</td>
                <td>₹ {Number(e.amount).toFixed(2)}</td>
              </tr>
            ))}
            {expenses.length === 0 && <tr><td colSpan="3" className="muted">No expenses yet</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Add forms directly in dashboard with refresh callback */}
      <div className="grid-forms">
        <AddExpense user={user} onAdd={handleAdd} />
        <AddIncome user={user} onAdd={handleAdd} />
        <Savings user={user} onAdd={handleAdd} />
      </div>
    </div>
  );
}
