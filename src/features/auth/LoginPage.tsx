import { useState } from "react";
import type { SubmitEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "./useAuth";
import { getApiErrorMessage } from "../../services/apiError";

interface LoginForm {
  email: string;
  password: string;
}

interface RedirectState {
  from?: {
    pathname?: string;
  };
  message?: string;
}


export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const locationState = location.state as RedirectState | null;

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(form);
      navigate(locationState?.from?.pathname ?? "/");
    } catch (submitError) {
      setError(getApiErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-81px)] bg-slate-50 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-200">
          <div className="mb-8 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">
              Welcome back
            </p>
            <h1 className="text-3xl font-bold text-slate-900">Sign in</h1>
            <p className="mt-2 text-slate-600">
              Access your bookings and saved resources.
            </p>
          </div>

          {error && (
            <p
              className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
              role="alert"
            >
              {error}
            </p>
          )}

          {locationState?.message && (
            <p
              className="mb-6 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700"
              role="status"
            >
              {locationState.message}
            </p>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </span>
              <input
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
                autoComplete="email"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </span>
              <input
                type="password"
                value={form.password}
                onChange={(event) =>
                  setForm({ ...form, password: event.target.value })
                }
                autoComplete="current-password"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
