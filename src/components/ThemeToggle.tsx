import type { JSX } from "react";
import * as Switch from "@radix-ui/react-switch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../lib/ThemeContext";
import styles from "./ThemeToggle.module.css";

export default function ThemeToggle(): JSX.Element {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={styles.themeToggle}>
      <FontAwesomeIcon icon={faSun} className={styles.icon} aria-hidden />
      <Switch.Root
        className={styles.switchRoot}
        checked={theme === "dark"}
        onCheckedChange={toggleTheme}
        aria-label="Toggle dark mode"
      >
        <Switch.Thumb className={styles.switchThumb} />
      </Switch.Root>
      <FontAwesomeIcon icon={faMoon} className={styles.icon} aria-hidden />
    </div>
  );
}
