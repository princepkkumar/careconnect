import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import api from "../../services/api.js";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/stats");
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="auth-wrapper">
      <div className="card" style={{ maxWidth: "900px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <div>
            <h2 className="auth-title" style={{ marginBottom: "0.3rem" }}>
              Admin Dashboard
            </h2>
            <p className="auth-subtitle" style={{ marginBottom: 0 }}>
              Welcome, <b>{user?.name}</b>
            </p>
          </div>

          <button className="btn btn-secondary" onClick={logout}>
            Logout
          </button>
        </div>

        <hr
          style={{
            borderColor: "rgba(148,163,184,0.3)",
            marginBottom: "1rem",
          }}
        />

        {/* Stats Section */}
        {loading ? (
          <p>Loading stats...</p>
        ) : stats ? (
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              fontSize: "1rem",
              lineHeight: "1.7",
            }}
          >
            <li>
              <b>Total users:</b> {stats.totalUsers}
            </li>
            <li>
              <b>Caregivers:</b> {stats.caregivers}
            </li>
            <li>
              <b>Careseekers:</b> {stats.careseekers}
            </li>
            <li>
              <b>Open requests:</b> {stats.openRequests}
            </li>
          </ul>
        ) : (
          <p>Could not load stats.</p>
        )}

        {/* Buttons Section */}
        <div
          style={{
            marginTop: "1.5rem",
            display: "flex",
            gap: "0.75rem",
            flexWrap: "wrap",
          }}
        >
          <Link to="/admin/requests" className="btn btn-secondary">
            View all requests
          </Link>

          <Link to="/admin/users" className="btn btn-secondary">
            View users
          </Link>

          <button className="btn btn-primary" onClick={load}>
            Refresh Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
