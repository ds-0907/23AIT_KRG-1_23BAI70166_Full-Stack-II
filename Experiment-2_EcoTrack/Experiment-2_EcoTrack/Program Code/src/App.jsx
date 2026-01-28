import DashboardAnalytics from "./pages/DashboardAnalytics";
import logs from "./data/logs";
import Logs from "./pages/Logs";
import DashboardLayout from "./pages/DashboardLayout";
import DashboardSummary from "./pages/DashboardSummary";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Header from "./components/Header";

function App() {
  return (
    <BrowserRouter>
      <Header title="EcoTrack" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="summary" element={<DashboardSummary />} />
          <Route path="analytics" element={<DashboardAnalytics />} />
        </Route>
        <Route path="/logs" element={<ProtectedRoute><Logs logs={logs} /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
