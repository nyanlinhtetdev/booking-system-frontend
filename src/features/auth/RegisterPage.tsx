import { useState } from "react";
import type { SubmitEvent } from "react";
import { Link, useNavigate } from "react-router";
import type { RegisterRequest } from "./types/auth.types";
import { useAuth } from "./useAuth";
import { getApiErrorMessage } from "../../services/apiError";

const initialForm: RegisterRequest = {
  fullName: "",
  email: "",
  password: "",
  contactNumber: "",
  studentId: "",
};

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterRequest>(initialForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof RegisterRequest, value: string): void {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await register(form);
      navigate("/login", {
        state: { message: "Your account was created. Please sign in." },
      });
    } catch (submitError) {
      setError(getApiErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-81px)] bg-slate-50 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-200">
          <div className="mb-8 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">
              Get started
            </p>
            <h1 className="text-3xl font-bold text-slate-900">
              Create your account
            </h1>
            <p className="mt-2 text-slate-600">
              Join the campus resource booking system.
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

          <form className="grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit}>
            <label className="block sm:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Full name
              </span>
              <input
                type="text"
                value={form.fullName}
                onChange={(event) => updateField("fullName", event.target.value)}
                autoComplete="name"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                autoComplete="email"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Contact number
              </span>
              <input
                type="tel"
                value={form.contactNumber}
                onChange={(event) =>
                  updateField("contactNumber", event.target.value)
                }
                autoComplete="tel"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Student ID
              </span>
              <input
                type="text"
                value={form.studentId}
                onChange={(event) => updateField("studentId", event.target.value)}
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
                onChange={(event) => updateField("password", event.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </label>

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Creating account..." : "Create account"}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
