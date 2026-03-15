import { useEffect, useRef, useState, type FormEvent, type JSX } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { useAuth } from "../lib/AuthContext";
import styles from "./LoginModal.module.css";

interface LoginModalProps {
  onClose: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps): JSX.Element {
  const { login } = useAuth();
  const [password, setPassword] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = password.trim();
    if (trimmed) {
      login(trimmed);
      onClose();
    }
  }

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content} aria-describedby={undefined}>
          <VisuallyHidden.Root>
            <Dialog.Description>
              Enter the access key to unlock full catalog details
            </Dialog.Description>
          </VisuallyHidden.Root>
          <Dialog.Title className={styles.title}>Login</Dialog.Title>
          <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.label} htmlFor="login-password">
              Access key
            </label>
            <input
              id="login-password"
              ref={inputRef}
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="Enter access key…"
            />
            <div className={styles.actions}>
              <button type="button" className={styles.cancelBtn} onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className={styles.submitBtn} disabled={!password.trim()}>
                Login
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
