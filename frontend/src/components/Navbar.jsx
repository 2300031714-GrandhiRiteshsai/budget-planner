import React from "react";
import { Link } from "react-router-dom";

const NavBar = ({ user, onLogout }) => {
  return (
    <header className="navbar">
      <div className="brand"><Link to="/">BudgetPlanner</Link></div>
      <nav className="nav-links">
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/add-expense">Add Expense</Link>
            <Link to="/add-income">Add Income</Link>
            <Link to="/savings">Savings</Link>
            <button className="btn-ghost" onClick={onLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default NavBar;
