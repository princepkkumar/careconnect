import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // load saved user on refresh
  useEffect(() => {
    const saved = localStorage.getItem("careconnect_user");
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("careconnect_token", res.data.token);
    localStorage.setItem("careconnect_user", JSON.stringify(res.data.user));
    setUser(res.data.user);
  };

  const register = async (payload) => {
    const res = await api.post("/auth/register", payload);
    localStorage.setItem("careconnect_token", res.data.token);
    localStorage.setItem("careconnect_user", JSON.stringify(res.data.user));
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem("careconnect_token");
    localStorage.removeItem("careconnect_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
