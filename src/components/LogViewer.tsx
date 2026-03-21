import { useState, useEffect, type JSX } from "react";
import styles from "./LogViewer.module.css";

interface LogData {
  lines: string[];
}

interface LogFile {
  name: string;
  size: number;
}

function authHeaders(): Record<string, string> {
  try {
    const t = globalThis.sessionStorage?.getItem("authToken");
    if (t) return { Authorization: `Bearer ${t}` };
  } catch {
    /* ignore */
  }
  return {};
}

function fmtSize(b: number) {
  if (b < 1024) return `${b}B`;
  return b < 1048576 ? `${(b / 1024).toFixed(1)}KB` : `${(b / 1048576).toFixed(1)}MB`;
}

function fmtTime(iso: string) {
  const m = iso.match(/T(\d{2}:\d{2}:\d{2})/);
  return m ? m[1] : iso;
}

function actionClass(action: string) {
  if (action.startsWith("admin_")) return styles.actionAdmin;
  if (action === "auth_login") return styles.actionAuth;
  if (action === "play_video") return styles.actionPlay;
  if (action === "stop_video_stream") return styles.actionStop;
  if (action === "search") return styles.actionSearch;
  return styles.actionView;
}

export default function LogViewer(): JSX.Element {
  const [files, setFiles] = useState<LogFile[]>([]);
  const [file, setFile] = useState("");
  const [data, setData] = useState<LogData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/logs/list", { headers: authHeaders() })
      .then((r) => r.json() as Promise<{ files: LogFile[] }>)
      .then(({ files: f }) => {
        setFiles(f);
        if (f[0]) setFile(f[0].name);
      })
      .catch(() => setError("Failed to load log files"));
  }, []);

  useEffect(() => {
    if (!file) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/logs?file=${encodeURIComponent(file)}`, {
          headers: authHeaders(),
        });
        const d = (await res.json()) as LogData;
        if (!cancelled) setData(d);
      } catch {
        if (!cancelled) setError("Failed to load logs");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [file]);

  return (
    <div className={styles.logViewer}>
      <div className={styles.toolbar}>
        <select
          className={styles.select}
          value={file}
          onChange={(e) => setFile(e.target.value)}
          disabled={files.length === 0}
          aria-label="Log file"
        >
          {files.map((f) => (
            <option key={f.name} value={f.name}>
              {f.name} ({fmtSize(f.size)})
            </option>
          ))}
        </select>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Time (UTC)</th>
              <th>User</th>
              <th>Action</th>
              <th>ID</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {data && data.lines.length > 0 ? (
              data.lines.map((line, i) => {
                const [ts = "", action = "", user = "", id = "", ...rest] = line.split("\t");
                return (
                  <tr key={i}>
                    <td className={styles.tdTime}>{fmtTime(ts)}</td>
                    <td className={styles.tdUser}>{user}</td>
                    <td>
                      <span className={`${styles.action} ${actionClass(action)}`}>{action}</span>
                    </td>
                    <td className={styles.tdId}>{id === "-" ? "" : id}</td>
                    <td className={styles.tdDetails}>{rest.join("\t")}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className={styles.empty}>
                  {loading ? "Loading\u2026" : data ? "No entries" : ""}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {loading && <p className={styles.loadingMsg}>Loading…</p>}
    </div>
  );
}
