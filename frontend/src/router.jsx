import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

import CareseekerDashboard from "./pages/careseeker/CareseekerDashboard.jsx";
import CaregiverDashboard from "./pages/caregiver/CaregiverDashboard.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminRequests from "./pages/admin/AdminRequests.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx"; // 👈 NEW

import ProtectedRoute from "./components/ProtectedRoute.jsx";

const AppRouter = () => {
  const { user } = useAuth();

  const redirectByRole = () => {
    if (!user) return "/";
    if (user.role === "careseeker") return "/careseeker/dashboard";
    if (user.role === "caregiver") return "/caregiver/dashboard";
    if (user.role === "admin") return "/admin/dashboard";
    return "/";
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />

        <Route
          path="/login"
          element={
            user ? <Navigate to={redirectByRole()} replace /> : <LoginPage />
          }
        />

        <Route
          path="/register"
          element={
            user ? (
              <Navigate to={redirectByRole()} replace />
            ) : (
              <RegisterPage />
            )
          }
        />

        {/* Careseeker routes */}
        <Route
          path="/careseeker/dashboard"
          element={
            <ProtectedRoute roles={["careseeker"]}>
              <CareseekerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Caregiver routes */}
        <Route
          path="/caregiver/dashboard"
          element={
            <ProtectedRoute roles={["caregiver"]}>
              <CaregiverDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/requests"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminRequests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
