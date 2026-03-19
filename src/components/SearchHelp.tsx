import { useState, type JSX } from "react";
import styles from "./SearchHelp.module.css";

export default function SearchHelp(): JSX.Element {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={styles.helpToggle}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Search help"
        title="Search tips"
      >
        ?
      </button>

      {open && (
        <div className={styles.helpPanel}>
          <div className={styles.helpTitle}>Search Tips</div>
          <table className={styles.helpTable}>
            <tbody>
              <tr>
                <td>apollo 11</td>
                <td>Both words must appear (AND)</td>
              </tr>
              <tr>
                <td>&quot;lunar module&quot;</td>
                <td>Exact phrase match</td>
              </tr>
              <tr>
                <td>apollo OR gemini</td>
                <td>Either term matches</td>
              </tr>
              <tr>
                <td>astro*</td>
                <td>Prefix — matches astronaut, astronomy, etc.</td>
              </tr>
              <tr>
                <td>&quot;press conference&quot; apollo</td>
                <td>Phrase + keyword combined</td>
              </tr>
              <tr>
                <td>SFR-XXXXXX</td>
                <td>Look up by Catalog ID</td>
              </tr>
            </tbody>
          </table>
          <div className={styles.helpNote}>
            Search covers titles, descriptions, missions, and shotlist text from scanned PDF
            indices.
          </div>
        </div>
      )}
    </>
  );
}
