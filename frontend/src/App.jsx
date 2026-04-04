import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import CompareTray from "./components/layout/CompareTray";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import { useAuth } from "./context/AuthContext";

const AdminPage = lazy(() => import("./pages/AdminPage"));
const AdminLoginPage = lazy(() => import("./pages/AdminLoginPage"));
const AgentDashboardPage = lazy(() => import("./pages/AgentDashboardPage"));
const CollectionsPage = lazy(() => import("./pages/CollectionsPage"));
const ComparePage = lazy(() => import("./pages/ComparePage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const PropertiesPage = lazy(() => import("./pages/PropertiesPage"));
const PropertyDetailPage = lazy(() => import("./pages/PropertyDetailPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));

const RouteFallback = () => (
  <div className="grid min-h-[50vh] place-items-center">
    <div className="panel-card flex items-center gap-3 px-5 py-4 text-sm text-slate-600">
      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-brand-500" />
      Loading page...
    </div>
  </div>
);

const App = () => {
  const { isAdminSession } = useAuth();

  return (
    <div className="min-h-screen bg-app text-slate-900">
      <Navbar />
      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/properties/:id" element={<PropertyDetailPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/admin/login"
              element={isAdminSession ? <Navigate to="/admin" replace /> : <AdminLoginPage />}
            />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <CollectionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/agent"
              element={
                <ProtectedRoute roles={["agent", "admin"]}>
                  <AgentDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={["admin"]} redirectTo="/admin/login" requireAdminSession>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <CompareTray />
      <Footer />
    </div>
  );
};

export default App;
