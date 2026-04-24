import { useEffect, useMemo } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import {
  getToken,
  isTokenExpired,
  logout,
  startTokenMonitor,
} from "./utils/auth";

/* Internal wrapper to use navigate() hook for logout event listener */
function AppWrapper() {
  const navigate = useNavigate();
   
  // Validate token immediately on mount
  useEffect(() => {
    const token = getToken();
    if (token && isTokenExpired()) {
      logout();
    }
  }, []);
  
  const token = useMemo(() => getToken(), []);

  useEffect(() => {
    // Start background token expiry checks
    startTokenMonitor();

    // Listen for logout events triggered by auth.js
    const handleLogout = () => navigate("/login", { replace: true });
    window.addEventListener("tokenExpired", handleLogout);
    return () => window.removeEventListener("tokenExpired", handleLogout);
  }, [navigate]);

  const isAuthenticated = token && !isTokenExpired();

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

/* Root component with Router */
export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
