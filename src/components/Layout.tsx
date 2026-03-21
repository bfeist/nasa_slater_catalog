import { type JSX } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../lib/AuthContext";
import styles from "./Layout.module.css";

export default function Layout(): JSX.Element {
  const { logout, username, role } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Link to="/" className={styles.title}>
          Slater Film Catalog
        </Link>
        <nav className={styles.nav}>
          <Link to="/" className={styles.navLink}>
            Search
          </Link>
          <Link to="/stats" className={styles.navLink}>
            Stats
          </Link>
          {role === "super" && (
            <Link to="/admin" className={styles.navLink}>
              Admin
            </Link>
          )}
        </nav>
        <div className={styles.headerActions}>
          {username && <span className={styles.navLink}> Welcome, {username}</span>}
          <button type="button" className={styles.authBtn} onClick={handleLogout}>
            Logout
          </button>
          <ThemeToggle />
        </div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
