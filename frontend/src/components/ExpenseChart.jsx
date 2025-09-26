import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function ExpenseChart({ expenses = [] }) {
  // aggregate by category
  const grouped = expenses.reduce((acc, e) => {
    const cat = e.category || "Uncategorized";
    acc[cat] = (acc[cat] || 0) + Number(e.amount || 0);
    return acc;
  }, {});

  const labels = Object.keys(grouped);
  const data = Object.values(grouped);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Spending by Category",
        data,
      },
    ],
  };

  return (
    <div className="chart-card">
      <h3>Spending by Category</h3>
      <Pie data={chartData} />
    </div>
  );
}
