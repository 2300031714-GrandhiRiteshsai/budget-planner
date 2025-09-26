import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function Savings({ user, onAdd }) {
  const [goals, setGoals] = useState([]);
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [amountToChange, setAmountToChange] = useState({}); // For each goal input

  const loadGoals = async () => {
    if (!user) return;
    try {
      const res = await api.get(`/savings/${user.id}`);
      setGoals(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadGoals();
  }, [user]);

  const addGoal = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/savings/add", {
        userId: user.id,
        goalName: name,
        targetAmount: Number(target),
        currentAmount: 0
      });
      setName("");
      setTarget("");
      setGoals(prev => [res.data, ...prev]);
      if (onAdd) onAdd();
      alert("Goal added");
    } catch (err) {
      console.error(err);
      alert("Failed to add goal");
    }
  };

  const updateAmount = async (goalId) => {
    const change = Number(amountToChange[goalId]);
    if (isNaN(change)) {
      alert("Enter a valid number");
      return;
    }

    try {
      // Use PUT with query param "amount" (can be negative to reduce)
      const res = await api.put(`/savings/addToCurrent/${goalId}?amount=${change}`);

      // Ensure currentAmount stays between 0 and targetAmount
      const updatedGoal = { ...res.data };
      if (updatedGoal.currentAmount > updatedGoal.targetAmount) {
        updatedGoal.currentAmount = updatedGoal.targetAmount;
      }
      if (updatedGoal.currentAmount < 0) {
        updatedGoal.currentAmount = 0;
      }

      setGoals(prev => prev.map(g => (g.id === goalId ? updatedGoal : g)));
      setAmountToChange(prev => ({ ...prev, [goalId]: "" }));
    } catch (err) {
      console.error(err);
      alert("Failed to update amount");
    }
  };

  return (
    <div>
      <div className="card form-card">
        <h2>Create Savings Goal</h2>
        <form onSubmit={addGoal}>
          <label>Goal Name</label>
          <input value={name} onChange={e => setName(e.target.value)} required />

          <label>Target Amount</label>
          <input type="number" value={target} onChange={e => setTarget(e.target.value)} required />

          <button className="btn" type="submit">Create Goal</button>
        </form>
      </div>

      <div className="card">
        <h3>Your Goals</h3>
        {goals.length === 0 && <p className="muted">No savings goals yet.</p>}
        <ul className="goal-list">
          {goals.map(g => {
            const progress = g.targetAmount
              ? Math.min(Math.max((g.currentAmount / g.targetAmount) * 100, 0), 100)
              : 0;

            return (
              <li key={g.id}>
                <strong>{g.goalName}</strong>
                <div>Target: ₹{Number(g.targetAmount).toFixed(2)}</div>
                <div>Saved: ₹{Number(g.currentAmount).toFixed(2)}</div>

                {/* Progress bar */}
                <div className="progress-bar" style={{ background: "#eee", width: "100%", height: "10px", borderRadius: "5px", margin: "5px 0" }}>
                  <div
                    style={{
                      width: `${progress}%`,
                      height: "100%",
                      background: "#4caf50",
                      borderRadius: "5px"
                    }}
                  />
                </div>

                <div style={{ marginTop: "5px" }}>
                  <input
                    type="number"
                    placeholder="Add / Reduce amount"
                    value={amountToChange[g.id] || ""}
                    onChange={e =>
                      setAmountToChange(prev => ({ ...prev, [g.id]: e.target.value }))
                    }
                  />
                  <button type="button" onClick={() => updateAmount(g.id)}>Update</button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
