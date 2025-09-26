import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import api from "../services/api";

export default function FinanceChart({ user }) {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    if (!user) return;

    try {
      const [expensesRes, incomesRes, savingsRes] = await Promise.all([
        api.get(`/expenses/${user.id}`),
        api.get(`/incomes/${user.id}`),
        api.get(`/savings/${user.id}`)
      ]);

      // Combine data by date (or any grouping you prefer)
      const combined = {};
      
      expensesRes.data.forEach(e => {
        const key = e.createdAt || "unknown";
        combined[key] = { date: key, expense: (combined[key]?.expense || 0) + e.amount };
      });

      incomesRes.data.forEach(i => {
        const key = i.createdAt || "unknown";
        combined[key] = { ...combined[key], date: key, income: (combined[key]?.income || 0) + i.amount };
      });

      savingsRes.data.forEach(s => {
        const key = s.createdAt || "unknown";
        combined[key] = { ...combined[key], date: key, savings: (combined[key]?.savings || 0) + (s.currentAmount || 0) };
      });

      // Convert to array and sort by date
      const chartData = Object.values(combined).sort((a, b) => new Date(a.date) - new Date(b.date));

      setData(chartData);
    } catch (err) {
      console.error("Failed to fetch chart data:", err);
    }
  };

  useEffect(() => {
    fetchData();

    // Optional: refresh every 5 seconds for real-time updates
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <div className="chart-card">
      <h3>Financial Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="expense" stroke="#ff4d4f" activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="income" stroke="#2a7ae2" />
          <Line type="monotone" dataKey="savings" stroke="#16a34a" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
