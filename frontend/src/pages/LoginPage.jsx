import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(form.email, form.password);
      const stored = JSON.parse(localStorage.getItem("careconnect_user"));
      if (stored?.role === "careseeker") navigate("/careseeker/dashboard");
      else if (stored?.role === "caregiver") navigate("/caregiver/dashboard");
      else if (stored?.role === "admin") navigate("/admin/dashboard");
      else navigate("/");
    } catch (err) {
      console.error(err);
      setError("Login failed. Please check your email and password.");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">
          Login to continue as a careseeker, caregiver or admin.
        </p>

        <form onSubmit={onSubmit}>
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
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "0.5rem" }}>
            Login
          </button>

          {error && <p className="auth-error">{error}</p>}
        </form>

        <p className="small-text" style={{ marginTop: "1rem" }}>
          Don&apos;t have an account?{" "}
          <Link to="/register" style={{ textDecoration: "underline" }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
