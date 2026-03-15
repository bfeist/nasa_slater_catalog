import { useState, type JSX } from "react";
import { Link, Outlet } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import LoginModal from "./LoginModal";
import { useAuth } from "../lib/AuthContext";
import styles from "./Layout.module.css";

export default function Layout(): JSX.Element {
  const { isAuthenticated, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Link to="/" className={styles.title}>
          NASA Slater Film Catalog
        </Link>
        <nav className={styles.nav}>
          <Link to="/" className={styles.navLink}>
            Search
          </Link>
          <Link to="/stats" className={styles.navLink}>
            Stats
          </Link>
        </nav>
        <div className={styles.headerActions}>
          {isAuthenticated ? (
            <button type="button" className={styles.authBtn} onClick={logout}>
              Logout
            </button>
          ) : (
            <button type="button" className={styles.authBtn} onClick={() => setShowLogin(true)}>
              Login
            </button>
          )}
          <ThemeToggle />
        </div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
}
