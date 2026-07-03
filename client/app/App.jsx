import { Suspense, lazy, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer.jsx";
import MobileStickyActions from "./components/MobileStickyActions.jsx";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import WhatsAppFloat from "./components/WhatsAppFloat.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import { allEnterprisePages } from "./data/enterprisePages.js";

const HomePage = lazy(() => import("./pages/HomePage.jsx"));
const PropertiesPage = lazy(() => import("./pages/PropertiesPage.jsx"));
const PropertyDetailsPage = lazy(() => import("./pages/PropertyDetailsPage.jsx"));
const FavoritesPage = lazy(() => import("./pages/FavoritesPage.jsx"));
const AdminLoginPage = lazy(() => import("./pages/AdminLoginPage.jsx"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage.jsx"));
const LoginPage = lazy(() => import("./pages/LoginPage.jsx"));
const RegisterPage = lazy(() => import("./pages/RegisterPage.jsx"));
const BlogPage = lazy(() => import("./pages/BlogPage.jsx"));
const BlogDetailPage = lazy(() => import("./pages/BlogDetailPage.jsx"));
const CalculatorPage = lazy(() => import("./pages/CalculatorPage.jsx"));
const EnterprisePage = lazy(() => import("./pages/EnterprisePage.jsx"));
const RoleDashboardPage = lazy(() => import("./pages/RoleDashboardPage.jsx"));
const UtilityPage = lazy(() => import("./pages/UtilityPage.jsx"));

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
            {allEnterprisePages.map((page) => (
              <Route key={page.slug} path={`/${page.slug}`} element={<EnterprisePage pageSlug={page.slug} />} />
            ))}
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogDetailPage />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/property-listing" element={<PropertiesPage />} />
            <Route path="/properties/:id" element={<PropertyDetailsPage />} />
            <Route path="/emi-calculator" element={<CalculatorPage type="emi" />} />
            <Route path="/mortgage-calculator" element={<CalculatorPage type="mortgage" />} />
            <Route path="/stamp-duty-calculator" element={<CalculatorPage type="stamp-duty" />} />
            <Route path="/compare-property" element={<UtilityPage type="compare-property" />} />
            <Route path="/saved-property" element={<UtilityPage type="saved-property" />} />
            <Route path="/recently-viewed" element={<UtilityPage type="recently-viewed" />} />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <FavoritesPage />
                </ProtectedRoute>
              }
            />
            <Route path="/user-dashboard" element={<RoleDashboardPage role="user" />} />
            <Route path="/buyer-dashboard" element={<RoleDashboardPage role="buyer" />} />
            <Route path="/owner-dashboard" element={<RoleDashboardPage role="owner" />} />
            <Route path="/dealer-dashboard" element={<RoleDashboardPage role="dealer" />} />
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
            <Route path="/forgot-password" element={<UtilityPage type="forgot-password" />} />
            <Route path="*" element={<UtilityPage type="404" />} />
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
