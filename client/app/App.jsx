import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import WhatsAppFloat from "./components/WhatsAppFloat.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import { COMPANY_INFO } from "./data/siteContent.js";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import PropertiesPage from "./pages/PropertiesPage.jsx";
import PropertyDetailsPage from "./pages/PropertyDetailsPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

const App = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const authenticatedHome = isAdmin ? "/admin" : "/properties";

  return (
    <div className="min-h-screen overflow-x-hidden">
      <h1 className="sr-only">SAGAR INFRA LIVE</h1>
      <Navbar />

      <main className="relative pb-16 pt-3 sm:pt-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/properties/:id" element={<PropertyDetailsPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to={authenticatedHome} replace /> : <LoginPage />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to={authenticatedHome} replace /> : <RegisterPage />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="section-shell pb-8">
        <div className="glass-panel flex flex-col gap-5 rounded-[32px] px-6 py-6 text-sm text-white/65 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold text-white">{COMPANY_INFO.name}</p>
            <p>{COMPANY_INFO.tagline}</p>
            <p className="mt-2 max-w-2xl text-white/55">
              Construction, government contracts, road building, material supply, land dealing, plotting, and civil
              works across Sagar, Madhya Pradesh.
            </p>
          </div>
          <div>
            <p>Owner: {COMPANY_INFO.owner}</p>
            <p>Phone: {COMPANY_INFO.phoneDisplay}</p>
            <p>{COMPANY_INFO.address}</p>
          </div>
        </div>
      </footer>

      <WhatsAppFloat />
    </div>
  );
};

export default App;
