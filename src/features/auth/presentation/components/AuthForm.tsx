import { useState } from "react";

interface Props {
  onSubmit: (email: string, password: string) => Promise<void>;
}

export function AuthForm({ onSubmit }: Props) {
  const [email, setEmail] = useState(import.meta.env.VITE_DEMO_EMAIL ?? "");
  const [password, setPassword] = useState(
    import.meta.env.VITE_DEMO_PASSWORD ?? "",
  );

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSubmit(email, password);
      localStorage.setItem("demo-auth", "true");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center
                    bg-gradient-to-br from-slate-100 to-slate-200
                    dark:from-slate-900 dark:to-slate-800"
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl
                      dark:bg-slate-900"
      >
        <h2 className="mb-1 text-center text-xl font-semibold text-slate-800 dark:text-slate-100">
          Welcome 👋
        </h2>
        <p className="mb-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Sign in to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">
              Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                ✉️
              </span>
              <input
                autoFocus
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2
                           text-sm text-slate-800
                           focus:border-blue-500 focus:outline-none
                           focus:ring-4 focus:ring-blue-500/20
                           dark:border-slate-700 dark:bg-slate-800
                           dark:text-slate-100"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                🔒
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-300 pl-10 pr-10 py-2
                           text-sm text-slate-800
                           focus:border-blue-500 focus:outline-none
                           focus:ring-4 focus:ring-blue-500/20
                           dark:border-slate-700 dark:bg-slate-800
                           dark:text-slate-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-3 text-sm text-slate-400
                           hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {error && (
            <p
              className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600
                          dark:bg-red-900/30 dark:text-red-400"
            >
              {error}
            </p>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading || !email || !password}
            className="mt-2 w-full rounded-lg bg-blue-600 py-2.5
                       text-sm font-semibold text-white
                       transition-all
                       hover:bg-blue-700 hover:shadow-lg
                       active:scale-[0.98]
                       disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
