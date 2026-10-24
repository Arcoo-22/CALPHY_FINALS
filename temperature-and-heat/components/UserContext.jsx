"use client";

// ============================================================
// UserProvider, session (cookie via /api/auth/*) + progress
// (localStorage mirror of tbl_users.user_progress, synced to
//  PostgreSQL whenever the user is logged in).
// ============================================================
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  readLocal,
  makeDefaultProgress,
  syncFromServer,
  PARENTS,
} from "@/lib/progress";

const UserCtx = createContext(null);

export function useUser() {
  const ctx = useContext(UserCtx);
  if (!ctx) throw new Error("useUser must be used inside <UserProvider>");
  return ctx;
}

// Push every non-default local value to the DB (guest → account carry-over).
async function pushLocalToServer() {
  const local = readLocal();
  const calls = [];
  PARENTS.forEach((parent) => {
    Object.entries(local[parent] || {}).forEach(([child, value]) => {
      const isDefault =
        parent === "QuizScores" ? Number(value) === 0 : value === "NotStarted";
      if (!isDefault) {
        calls.push(
          fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              parent,
              child,
              value,
              numeric: parent === "QuizScores",
            }),
          }),
        );
      }
    });
  });
  if (calls.length) await Promise.allSettled(calls);
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [progress, setProgress] = useState(null);

  // initial: local progress + keep in sync with calphy:progress events
  useEffect(() => {
    // localStorage only exists after hydration; reading it during render would
    // make the server and client HTML differ, so the first read lives here
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(readLocal());
    const handler = (e) => setProgress(e.detail || readLocal());
    window.addEventListener("calphy:progress", handler);
    return () => window.removeEventListener("calphy:progress", handler);
  }, []);

  // restore session cookie
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          const merged = await syncFromServer();
          if (merged) setProgress(merged);
        }
      } catch {
        /* DB or server unavailable → guest mode */
      } finally {
        setAuthLoading(false);
      }
    })();
  }, []);

  const finishAuth = useCallback(async (data) => {
    setUser(data.user);
    await pushLocalToServer(); // carry guest progress into the account
    const merged = await syncFromServer();
    if (merged) setProgress(merged);
  }, []);

  const login = useCallback(
    async (identifier, password) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed.");
      await finishAuth(data);
      return data.user;
    },
    [finishAuth],
  );

  const register = useCallback(
    async (username, email, password) => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed.");
      await finishAuth(data);
      return data.user;
    },
    [finishAuth],
  );

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      /* ignore */
    }
    setUser(null);
  }, []);

  const refreshProgress = useCallback(async () => {
    if (user) {
      const merged = await syncFromServer();
      if (merged) setProgress(merged);
    } else {
      setProgress(readLocal());
    }
  }, [user]);

  return (
    <UserCtx.Provider
      value={{
        user,
        authLoading,
        isLoggedIn: !!user,
        progress: progress || makeDefaultProgress(),
        login,
        register,
        logout,
        refreshProgress,
      }}
    >
      {children}
    </UserCtx.Provider>
  );
}
