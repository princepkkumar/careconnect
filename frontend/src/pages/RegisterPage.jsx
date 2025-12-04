import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "careseeker",
  });
  const [error, setError] = useState("");

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(form);
      const stored = JSON.parse(localStorage.getItem("careconnect_user"));
      if (stored?.role === "careseeker") navigate("/careseeker/dashboard");
      else if (stored?.role === "caregiver") navigate("/caregiver/dashboard");
      else if (stored?.role === "admin") navigate("/admin/dashboard");
      else navigate("/");
    } catch (err) {
      console.error(err);
      setError("Registration failed. Try a different email.");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Create your account</h2>
        <p className="auth-subtitle">
          Choose your role and start connecting with the CareConnect community.
        </p>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Your full name"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              placeholder="Create a password"
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select name="role" value={form.role} onChange={onChange}>
              <option value="careseeker">CareSeeker</option>
              <option value="caregiver">CareGiver</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "0.5rem" }}>
            Register
          </button>

          {error && <p className="auth-error">{error}</p>}
        </form>

        <p className="small-text" style={{ marginTop: "1rem" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ textDecoration: "underline" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
