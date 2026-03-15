import { type JSX } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/AuthContext";
import Layout from "./components/Layout";
import SearchPage from "./pages/SearchPage";
import StatsPage from "./pages/StatsPage";
import ReelPage from "./pages/ReelPage";

export default function App(): JSX.Element {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<SearchPage />} />
          <Route path="stats" element={<StatsPage />} />
          <Route path="reel/:identifier" element={<ReelPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
