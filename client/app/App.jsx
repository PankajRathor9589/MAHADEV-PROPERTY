import { Suspense, lazy, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer.jsx";
import MobileStickyActions from "./components/MobileStickyActions.jsx";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import WhatsAppFloat from "./components/WhatsAppFloat.jsx";
import { useAuth } from "./context/AuthContext.jsx";

const HomePage = lazy(() => import("./pages/HomePage.jsx"));
const PropertiesPage = lazy(() => import("./pages/PropertiesPage.jsx"));
const PropertyDetailsPage = lazy(() => import("./pages/PropertyDetailsPage.jsx"));
const FavoritesPage = lazy(() => import("./pages/FavoritesPage.jsx"));
const AdminLoginPage = lazy(() => import("./pages/AdminLoginPage.jsx"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage.jsx"));
const LoginPage = lazy(() => import("./pages/LoginPage.jsx"));
const RegisterPage = lazy(() => import("./pages/RegisterPage.jsx"));

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

const PageShellFallback = () => (
  <section className="section-shell">
    <div className="glass-panel overflow-hidden p-6 sm:p-8">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="skeleton-shimmer h-14 rounded-full" />
        <div className="skeleton-shimmer h-14 rounded-full" />
      </div>
      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <div className="skeleton-shimmer aspect-[4/3] rounded-[30px]" />
        <div className="skeleton-shimmer aspect-[4/3] rounded-[30px]" />
        <div className="skeleton-shimmer aspect-[4/3] rounded-[30px]" />
      </div>
    </div>
  </section>
);

const App = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
  const authenticatedHome = isAdmin ? "/admin" : "/properties";
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <ScrollManager />
      <Navbar />

      <main className={`relative z-10 ${isAdminRoute ? "pb-10" : "pb-28 md:pb-16"}`}>
        <Suspense fallback={<PageShellFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/properties/:id" element={<PropertyDetailsPage />} />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <FavoritesPage />
                </ProtectedRoute>
              }
            />
            <Route path="/admin/login" element={isAdmin ? <Navigate to="/admin" replace /> : <AdminLoginPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]} redirectTo="/admin/login">
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
        </Suspense>
      </main>

      {!isAdminRoute ? <Footer /> : null}
      {!isAdminRoute ? <WhatsAppFloat /> : null}
      {!isAdminRoute ? <MobileStickyActions /> : null}
    </div>
  );
};

export default App;
