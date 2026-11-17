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
    <main className="min-h-[calc(100vh-81px)] bg-[#eaf3f7] px-6 py-14 text-[#173148] sm:px-8 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-xl border border-[#c8dce5] bg-[#f7fbfc] p-7 sm:p-10">
          <div className="mb-9 border-b border-[#c8dce5] pb-7">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#55798d]">
              Student account&nbsp; / &nbsp;welcome back
            </p>
            <h1 className="font-serif text-5xl tracking-[-0.04em] text-[#142d43]">
              Sign in to continue.
            </h1>
          </div>

          {error && (
            <p
              className="mb-6 border border-[#e7c9c4] bg-[#fff8f6] px-4 py-3 text-sm text-[#9b4d43]"
              role="alert"
            >
              {error}
            </p>
          )}

          {locationState?.message && (
            <p
              className="mb-6 border border-[#c7ded3] bg-[#f4fbf7] px-4 py-3 text-sm text-[#39705a]"
              role="status"
            >
              {locationState.message}
            </p>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#55798d]">
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
                className="w-full border border-[#c8dce5] bg-white px-4 py-3 text-[#173148] outline-none transition placeholder:text-[#7793a2] focus:border-[#285571] focus:ring-1 focus:ring-[#285571]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#55798d]">
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
                className="w-full border border-[#c8dce5] bg-white px-4 py-3 text-[#173148] outline-none transition placeholder:text-[#7793a2] focus:border-[#285571] focus:ring-1 focus:ring-[#285571]"
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full cursor-pointer bg-[#285571] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#173f59] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#55798d]">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="cursor-pointer font-semibold text-[#285571] hover:text-[#4d879d]"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
