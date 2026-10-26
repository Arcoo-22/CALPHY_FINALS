"use client";

// ============================================================
// UserProvider, session (cookie via /api/auth/*) + progress
// (localStorage mirror of tbl_users.user_progress, synced to
//  PostgreSQL whenever the user is logged in; reset on logout).
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
  fetchServerProgress,
  replaceLocal,
  resetLocalProgress,
  hasProgress,
  getLocalOwner,
  setLocalOwner,
  clearLocalOwner,
} from "@/lib/progress";

const UserCtx = createContext(null);

export function useUser() {
  const ctx = useContext(UserCtx);
  if (!ctx) throw new Error("useUser must be used inside <UserProvider>");
  return ctx;
}

// Point the local copy at this account. Only unowned (guest) progress is
// carried over; a copy left by another account is dropped, never pushed.
async function adoptAccount(user, serverProgress) {
  let progress = serverProgress;
  const local = readLocal();
  if (getLocalOwner() === null && hasProgress(local)) {
    try {
      const res = await fetch("/api/progress", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress: local }),
      });
      const data = await res.json();
      if (res.ok && data.progress) progress = data.progress;
    } catch {
      /* DB down, account still shows its saved progress */
    }
  }
  setLocalOwner(user.id);
  return replaceLocal(progress);
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
        if (!res.ok) return; // server/DB trouble, keep the local copy
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          setProgress(
            getLocalOwner() === data.user.id
              ? replaceLocal(data.progress)
              : await adoptAccount(data.user, data.progress),
          );
        } else if (getLocalOwner() !== null) {
          // session expired: the local copy belongs to an account, not a guest
          resetLocalProgress();
          clearLocalOwner();
        }
      } catch {
        /* offline → guest mode on the local copy */
      } finally {
        setAuthLoading(false);
      }
    })();
  }, []);

  const finishAuth = useCallback(async (data) => {
    setProgress(await adoptAccount(data.user, data.progress));
    setUser(data.user);
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
      /* ignore, the local copy is cleared either way */
    }
    resetLocalProgress();
    clearLocalOwner();
    setUser(null);
    setProgress(makeDefaultProgress());
  }, []);

  const refreshProgress = useCallback(async () => {
    if (user) {
      const server = await fetchServerProgress().catch(() => null);
      if (server) setProgress(replaceLocal(server));
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
