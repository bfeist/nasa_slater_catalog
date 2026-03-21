import { type JSX } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import Layout from "./components/Layout";
import SearchPage from "./pages/SearchPage";
import StatsPage from "./pages/StatsPage";
import ReelPage from "./pages/ReelPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";

function RequireAuth({ children }: { children: JSX.Element }): JSX.Element {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function RequireSuper({ children }: { children: JSX.Element }): JSX.Element {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role !== "super") return <Navigate to="/" replace />;
  return children;
}

export default function App(): JSX.Element {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route index element={<SearchPage />} />
          <Route path="stats" element={<StatsPage />} />
          <Route path="reel/:identifier" element={<ReelPage />} />
          <Route
            path="admin"
            element={
              <RequireSuper>
                <AdminPage />
              </RequireSuper>
            }
          />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
