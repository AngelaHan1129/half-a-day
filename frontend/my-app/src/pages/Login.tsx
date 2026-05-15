import { useState } from "react";
import type { FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginApi } from "../services/api/auth";
import { PATHS } from "../app/router/paths";

type LocationState = {
  from?: {
    pathname?: string;
  };
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const redirectTo = state?.from?.pathname || PATHS.admin;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginApi(username, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "登入失敗");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    borderColor: "var(--app-border)",
    background: "var(--app-surface)",
    color: "var(--app-text)",
    boxShadow: "var(--app-shadow)",
  } as const;

  return (
    <main
      className="grid min-h-[calc(100vh-4rem)] place-items-center px-4 py-16 transition-colors duration-300"
      style={{
        background:
          "radial-gradient(circle at top, color-mix(in srgb, var(--app-accent) 10%, transparent), transparent 38%), var(--app-bg)",
        color: "var(--app-text)",
      }}
    >
      <div
        className="w-full max-w-md rounded-3xl border p-8 backdrop-blur-xl transition-colors duration-300"
        style={{
          borderColor: "var(--app-border)",
          background: "color-mix(in srgb, var(--app-card) 88%, transparent)",
          boxShadow: "var(--app-shadow)",
        }}
      >
        <p
          className="mb-3 text-sm uppercase tracking-[0.24em]"
          style={{ color: "var(--app-accent)" }}
        >
          Login
        </p>

        <h1
          className="text-3xl font-black tracking-tight"
          style={{ color: "var(--app-text)" }}
        >
          管理者登入
        </h1>

        <p
          className="mt-3 text-sm leading-6"
          style={{ color: "var(--app-text-muted)" }}
        >
          請使用管理者帳號登入後台，管理景點、路線、知識庫與聲音花資料。
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              className="mb-2 block text-sm"
              style={{ color: "var(--app-text-muted)" }}
            >
              帳號
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-2xl border px-4 py-3 outline-none transition-colors duration-200 placeholder:opacity-60"
              style={inputStyle}
              placeholder="請輸入帳號"
              autoComplete="username"
            />
          </div>

          <div>
            <label
              className="mb-2 block text-sm"
              style={{ color: "var(--app-text-muted)" }}
            >
              密碼
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border px-4 py-3 outline-none transition-colors duration-200 placeholder:opacity-60"
              style={inputStyle}
              placeholder="請輸入密碼"
              autoComplete="current-password"
            />
          </div>

          {error ? (
            <p
              className="rounded-2xl border px-4 py-3 text-sm"
              style={{
                borderColor: "rgba(244, 63, 94, 0.24)",
                background: "rgba(244, 63, 94, 0.08)",
                color: "var(--app-text)",
              }}
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl px-4 py-3 font-bold text-white transition duration-200 disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              background: "var(--app-accent)",
              boxShadow: "var(--app-shadow)",
            }}
          >
            {loading ? "登入中..." : "登入"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default Login;