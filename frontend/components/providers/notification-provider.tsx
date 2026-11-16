"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { FiBell } from "react-icons/fi";

export type NotificationType = "info" | "success" | "error";

type Notification = {
  message: string;
  type: NotificationType;
};

const NotificationContext = createContext<
  ((message: string, type?: NotificationType) => void) | null
>(null);

export function useNotify() {
  const notify = useContext(NotificationContext);
  if (!notify) {
    throw new Error("useNotify must be used within NotificationProvider.");
  }
  return notify;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<Notification | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setNotification(null);
  }, []);

  const notify = useCallback(
    (message: string, type: NotificationType = "info") => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      setNotification({ message, type });
      if (type === "error") {
        timeoutRef.current = null;
        return;
      }

      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        setNotification(null);
      }, 5000);
    },
    [],
  );

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  return (
    <NotificationContext.Provider value={notify}>
      {children}
      {notification && (
        <div
          role={notification.type === "error" ? "alert" : "status"}
          className={`fixed bottom-5 left-1/2 z-[2000] flex max-w-[calc(100%-32px)] -translate-x-1/2 items-center gap-3 rounded-xl border px-5 py-3 text-sm shadow-2xl ${
            notification.type === "error"
              ? "border-red-500/30 bg-[#241018] text-red-100"
              : notification.type === "success"
                ? "border-emerald-500/30 bg-[#0b211a] text-emerald-100"
                : "border-[#29476b] bg-[#0b1930] text-blue-100"
          }`}
        >
          <span
            className={
              notification.type === "error"
                ? "text-red-400"
                : notification.type === "success"
                  ? "text-emerald-400"
                  : "text-cyan-400"
            }
          >
            <FiBell />
          </span>
          <span>{notification.message}</span>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss notification"
            className="ml-2 text-slate-400 hover:text-white"
          >
            ×
          </button>
        </div>
      )}
    </NotificationContext.Provider>
  );
}
