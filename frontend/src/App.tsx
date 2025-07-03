import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import CandidateForm from "./components/CandidateForm";
import AdminPanel from "./components/AdminPanel";
import StatusPage from "./components/StatusPage";
import LoginPage from "./components/LoginPage";

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAdminLoggedIn") === "true";
  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CandidateForm />} />
        <Route path="/status/:id" element={<StatusPage />} />
        <Route path="/admin/" element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          } />
        <Route path="/admin/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;