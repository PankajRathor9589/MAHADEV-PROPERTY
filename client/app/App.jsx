import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
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

const ScrollManager = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      requestAnimationFrame(() => {
        const target = document.querySelector(location.hash);

        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
      return;
    }

    window.scrollTo({ top: 0, left: 0 });
  }, [location.pathname, location.hash]);

  return null;
};

const App = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const authenticatedHome = isAdmin ? "/admin" : "/properties";

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <ScrollManager />
      <Navbar />

      <main className="relative z-10 pb-20">
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
