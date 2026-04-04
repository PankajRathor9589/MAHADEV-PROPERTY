import { Navigate, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer.jsx";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import WhatsAppFloat from "./components/WhatsAppFloat.jsx";
import { useAuth } from "./context/AuthContext.jsx";
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
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-gold-300 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-950"
      >
        Skip to content
      </a>
      <h1 className="sr-only">SAGAR INFRA LIVE</h1>
      <Navbar />

      <main id="main-content" className="relative pb-16 pt-3 sm:pt-4">
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

      <Footer />

      <WhatsAppFloat />
    </div>
  );
};

export default App;
