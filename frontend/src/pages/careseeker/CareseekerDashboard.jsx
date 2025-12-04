import React from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import CareseekerProfileForm from "./CareseekerProfileForm.jsx";
import CareRequestForm from "./CareRequestForm.jsx";

const CareseekerDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="auth-wrapper">
      <div className="card" style={{ maxWidth: "980px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <div>
            <h2 className="auth-title" style={{ marginBottom: "0.2rem" }}>
              CareSeeker Dashboard
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

        <CareseekerProfileForm />

        <CareRequestForm />
      </div>
    </div>
  );
};

export default CareseekerDashboard;
