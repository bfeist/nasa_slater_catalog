import { useState, useEffect, useCallback, type FormEvent, type JSX } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import clsx from "clsx";
import LogViewer from "../components/LogViewer.js";
import styles from "./AdminPage.module.css";

type Role = "super" | "full" | "guest";

interface UserInfo {
  username: string;
  role: Role;
  suspended: boolean;
}

function authHeaders(): Record<string, string> {
  try {
    const token = globalThis.sessionStorage?.getItem("authToken");
    if (token) return { Authorization: `Bearer ${token}` };
  } catch {
    /* ignore */
  }
  return {};
}

// ---------------------------------------------------------------------------
// Add / Edit User Dialog
// ---------------------------------------------------------------------------

interface UserFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  /** If set, we're editing; otherwise creating. */
  editUser?: UserInfo;
}

function UserFormDialog({ open, onClose, onSaved, editUser }: UserFormDialogProps): JSX.Element {
  const isEdit = !!editUser;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("guest");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setUsername(editUser?.username ?? "");
      setPassword("");
      setRole(editUser?.role ?? "guest");
      setError(null);
    }
  }, [open, editUser]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const url = isEdit
        ? `/api/admin/users/${encodeURIComponent(editUser!.username)}`
        : "/api/admin/users";
      const method = isEdit ? "PUT" : "POST";
      const body: Record<string, string> = { role };
      if (!isEdit) body.username = username.trim();
      if (password) body.password = password;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Request failed" }));
        setError((data as { error?: string }).error ?? "Request failed");
        return;
      }

      onSaved();
      onClose();
    } catch {
      setError("Unable to connect to server");
    } finally {
      setSubmitting(false);
    }
  }

  const canSubmit = isEdit
    ? (password.length >= 4 || password.length === 0) && !submitting
    : username.trim().length > 0 && password.length >= 4 && !submitting;

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.dialogContent}>
          <Dialog.Title className={styles.dialogTitle}>
            {isEdit ? "Edit User" : "Add User"}
          </Dialog.Title>
          <VisuallyHidden.Root>
            <Dialog.Description>
              {isEdit ? `Edit user ${editUser?.username}` : "Create a new user account"}
            </Dialog.Description>
          </VisuallyHidden.Root>
          <form onSubmit={handleSubmit} className={styles.form}>
            {!isEdit && (
              <>
                <label className={styles.label} htmlFor="admin-username">
                  Username
                </label>
                <input
                  id="admin-username"
                  type="text"
                  className={styles.input}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="off"
                  placeholder="Enter username…"
                />
              </>
            )}
            <label className={styles.label} htmlFor="admin-password">
              {isEdit ? "New Password (leave blank to keep current)" : "Password"}
            </label>
            <input
              id="admin-password"
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              placeholder={isEdit ? "Leave blank to keep…" : "Min 4 characters…"}
            />
            <label className={styles.label} htmlFor="admin-role">
              Role
            </label>
            <select
              id="admin-role"
              className={styles.select}
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
            >
              <option value="super">Super (admin access)</option>
              <option value="full">Full (real data access)</option>
              <option value="guest">Guest (obfuscated data)</option>
            </select>
            {error && <p className={styles.errorMsg}>{error}</p>}
            <div className={styles.dialogActions}>
              <button type="button" className={styles.cancelBtn} onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className={styles.saveBtn} disabled={!canSubmit}>
                {submitting ? "Saving…" : isEdit ? "Save Changes" : "Create User"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ---------------------------------------------------------------------------
// Confirm Delete Dialog
// ---------------------------------------------------------------------------

interface ConfirmDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  username: string;
  deleting: boolean;
}

function ConfirmDeleteDialog({
  open,
  onClose,
  onConfirm,
  username,
  deleting,
}: ConfirmDeleteDialogProps): JSX.Element {
  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.dialogContent}>
          <Dialog.Title className={styles.dialogTitle}>Delete User</Dialog.Title>
          <VisuallyHidden.Root>
            <Dialog.Description>Confirm deletion of user {username}</Dialog.Description>
          </VisuallyHidden.Root>
          <p className={styles.confirmText}>
            Are you sure you want to delete <span className={styles.confirmUser}>{username}</span>?
            This action cannot be undone.
          </p>
          <div className={styles.dialogActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className={styles.dangerBtn}
              onClick={onConfirm}
              disabled={deleting}
            >
              {deleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ---------------------------------------------------------------------------
// Admin Page
// ---------------------------------------------------------------------------

export default function AdminPage(): JSX.Element {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"users" | "logs">("users");

  // Dialog state
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState<UserInfo | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserInfo | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/users", { headers: authHeaders() });
      if (!res.ok) throw new Error(`${res.status}`);
      const data = (await res.json()) as { users: UserInfo[] };
      setUsers(data.users);
      setError(null);
    } catch {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(deleteTarget.username)}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Delete failed" }));
        setError((data as { error?: string }).error ?? "Delete failed");
      } else {
        setDeleteTarget(null);
        fetchUsers();
      }
    } catch {
      setError("Unable to connect to server");
    } finally {
      setDeleting(false);
    }
  }

  async function handleToggleSuspend(user: UserInfo) {
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(user.username)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ suspended: !user.suspended }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Request failed" }));
        setError((data as { error?: string }).error ?? "Request failed");
      } else {
        fetchUsers();
      }
    } catch {
      setError("Unable to connect to server");
    }
  }

  function roleBadgeClass(role: Role): string {
    return clsx(styles.roleBadge, {
      [styles.roleSuper]: role === "super",
      [styles.roleFull]: role === "full",
      [styles.roleGuest]: role === "guest",
    });
  }

  return (
    <div className={styles.adminPage}>
      <h1 className={styles.heading}>User Administration</h1>
      <p className={styles.subtitle}>Manage application users and their access roles</p>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          type="button"
          className={clsx(styles.tab, { [styles.activeTab]: activeTab === "users" })}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
        <button
          type="button"
          className={clsx(styles.tab, { [styles.activeTab]: activeTab === "logs" })}
          onClick={() => setActiveTab("logs")}
        >
          Activity Logs
        </button>
      </div>

      {/* Users Tab */}
      {activeTab === "users" && (
        <>
          <div className={styles.rolesReference}>
            <table className={styles.rolesTable}>
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Admin panel</th>
                  <th>Real identifiers &amp; filenames</th>
                  <th>Catalog access</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <span className={clsx(styles.roleBadge, styles.roleSuper)}>super</span>
                  </td>
                  <td>✓</td>
                  <td>✓</td>
                  <td>✓</td>
                </tr>
                <tr>
                  <td>
                    <span className={clsx(styles.roleBadge, styles.roleFull)}>full</span>
                  </td>
                  <td>—</td>
                  <td>✓</td>
                  <td>✓</td>
                </tr>
                <tr>
                  <td>
                    <span className={clsx(styles.roleBadge, styles.roleGuest)}>guest</span>
                  </td>
                  <td>—</td>
                  <td>—</td>
                  <td>✓ (obfuscated)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <button type="button" className={styles.addBtn} onClick={() => setShowAdd(true)}>
            + Add User
          </button>

          {error && <p className={styles.errorMsg}>{error}</p>}

          {loading ? (
            <p className={styles.emptyState}>Loading…</p>
          ) : users.length === 0 ? (
            <p className={styles.emptyState}>No users configured</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.username} className={u.suspended ? styles.suspendedRow : undefined}>
                      <td>{u.username}</td>
                      <td>
                        <span className={roleBadgeClass(u.role)}>{u.role}</span>
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <button
                            type="button"
                            className={styles.editBtn}
                            onClick={() => setEditTarget(u)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className={styles.deleteBtn}
                            onClick={() => setDeleteTarget(u)}
                          >
                            Delete
                          </button>
                          <button
                            type="button"
                            className={u.suspended ? styles.enableBtn : styles.suspendBtn}
                            onClick={() => handleToggleSuspend(u)}
                          >
                            {u.suspended ? "Enable" : "Suspend"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Logs Tab */}
      {activeTab === "logs" && <LogViewer />}

      {/* Add User Dialog */}
      <UserFormDialog open={showAdd} onClose={() => setShowAdd(false)} onSaved={fetchUsers} />

      {/* Edit User Dialog */}
      <UserFormDialog
        open={editTarget !== null}
        onClose={() => setEditTarget(null)}
        onSaved={fetchUsers}
        editUser={editTarget ?? undefined}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        username={deleteTarget?.username ?? ""}
        deleting={deleting}
      />
    </div>
  );
}
