"use client";

// ============================================================
// AuthForm, login / register against /api/auth/* (PostgreSQL).
// Falls back gracefully with a friendly DB-offline message.
// ============================================================
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/UserContext";
import CalphyMascot from "@/components/CalphyMascot";

export default function AuthForm({ mode }) {
  const router = useRouter();
  const { login, register, isLoggedIn } = useUser();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const isLogin = mode === "login";

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (isLogin) {
        await login(identifier, password);
      } else {
        await register(username, email, password);
      }
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (isLoggedIn) {
    return (
      <div className="card-soft flat p-4 text-center auth-card">
        <div className="d-flex justify-content-center mb-2">
          <CalphyMascot size={70} mood="happy" />
        </div>
        <h2 className="fw-bold h5">You&apos;re already logged in!</h2>
        <p className="small text-muted mb-3">
          Your progress is syncing with the database.
        </p>
        <Link href="/dashboard" className="btn btn-flame">
          Go to dashboard <i className="bi bi-arrow-right ms-1" />
        </Link>
      </div>
    );
  }

  return (
    <div className="card-soft flat p-4 p-md-5 auth-card">
      <div className="text-center mb-4">
        <div className="d-flex justify-content-center mb-2">
          <CalphyMascot size={64} mood="wave" />
        </div>
        <h1 className="fw-bold h4 mb-1">
          {isLogin ? "Welcome back!" : "Join CalphyLearn"}
        </h1>
        <p className="small text-muted mb-0">
          {isLogin
            ? "Log in to sync your lesson progress & quiz scores."
            : "Create an account, your guest progress carries over automatically."}
        </p>
      </div>

      <div className="auth-tabs">
        <Link
          href="/login"
          className={isLogin ? "active" : ""}
          style={{
            flex: 1,
            borderRadius: 999,
            textAlign: "center",
            fontWeight: 700,
            padding: "0.5rem",
            color: isLogin ? "var(--ink)" : "var(--muted)",
            background: isLogin ? "var(--surface)" : "transparent",
            boxShadow: "none",
          }}
        >
          Log in
        </Link>
        <Link
          href="/register"
          className={!isLogin ? "active" : ""}
          style={{
            flex: 1,
            borderRadius: 999,
            textAlign: "center",
            fontWeight: 700,
            padding: "0.5rem",
            color: !isLogin ? "var(--ink)" : "var(--muted)",
            background: !isLogin ? "var(--surface)" : "transparent",
            boxShadow: "none",
          }}
        >
          Register
        </Link>
      </div>

      <form onSubmit={submit} className="d-grid gap-3">
        {isLogin ? (
          <div>
            <label
              className="form-label small fw-semibold"
              htmlFor="identifier"
            >
              Username or email
            </label>
            <input
              id="identifier"
              className="form-control-calphy"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. AJ POSADAS"
              required
            />
          </div>
        ) : (
          <>
            <div>
              <label
                className="form-label small fw-semibold"
                htmlFor="username"
              >
                Username
              </label>
              <input
                id="username"
                className="form-control-calphy"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="at least 3 characters"
                minLength={3}
                required
              />
            </div>
            <div>
              <label className="form-label small fw-semibold" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="form-control-calphy"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@school.edu"
                required
              />
            </div>
          </>
        )}
        <div>
          <label className="form-label small fw-semibold" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="form-control-calphy"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isLogin ? "your password" : "at least 4 characters"}
            minLength={4}
            required
          />
        </div>

        {error && (
          <div className="quiz-feedback bad mb-0">
            <i className="bi bi-exclamation-triangle-fill me-2" />
            {error}
          </div>
        )}

        <button type="submit" className="btn btn-flame w-100" disabled={busy}>
          {busy ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Please wait…
            </>
          ) : (
            <>
              <i
                className={`bi ${isLogin ? "bi-box-arrow-in-right" : "bi-person-plus"} me-2`}
              />
              {isLogin ? "Log in" : "Create account"}
            </>
          )}
        </button>
      </form>

      <div className="small text-muted text-center mt-3 mb-0">
        <i className="bi bi-shield-lock me-1" />
        Your sign-in is used only to keep progress attached to your account.
        Prefer to explore first?{" "}
        <Link href="/lessons" className="fw-bold">
          Continue as guest
        </Link>
        .
      </div>
    </div>
  );
}
