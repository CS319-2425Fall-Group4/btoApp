import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import CorporatePage from "./components/CorporatePage";
import IndividualPage from "./components/IndividualPage";
import EmployeePage from "./components/EmployeePage";
import FormPage from "./components/FormPage";
import { useAuth } from './context/AuthContext';
import TestAuth from "./components/TestAuth";
import RegisterPage from "./components/auth/RegisterPage";

// Protected Route Component
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/corporate" element={<CorporatePage />} />
          <Route path="/individual" element={<IndividualPage />} />
          <Route 
            path="/employee" 
            element={
              <ProtectedRoute roles={['GUIDE', 'COORDINATOR', 'ADMINISTRATOR']}>
                <EmployeePage />
              </ProtectedRoute>
            } 
          />
          <Route path="/form" element={<FormPage />} />
          <Route 
            path="/test-auth" 
            element={
              <ProtectedRoute roles={['GUIDE', 'COORDINATOR', 'ADMINISTRATOR']}>
                <TestAuth />
              </ProtectedRoute>
            } 
          />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
