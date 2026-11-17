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
    <main className="min-h-[calc(100vh-81px)] bg-[#eaf3f7] px-6 py-14 text-[#173148] sm:px-8 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl border border-[#c8dce5] bg-[#f7fbfc] p-7 sm:p-10">
          <div className="mb-9 border-b border-[#c8dce5] pb-7">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#55798d]">
              Student account&nbsp; / &nbsp;registration
            </p>
            <h1 className="font-serif text-5xl tracking-[-0.04em] text-[#142d43]">
              Create your account.
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

          <form className="grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit}>
            <label className="block sm:col-span-2">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#55798d]">
                Full name
              </span>
              <input
                type="text"
                value={form.fullName}
                onChange={(event) => updateField("fullName", event.target.value)}
                autoComplete="name"
                required
                className="w-full border border-[#c8dce5] bg-white px-4 py-3 text-[#173148] outline-none transition focus:border-[#285571] focus:ring-1 focus:ring-[#285571]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#55798d]">
                Email
              </span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                autoComplete="email"
                required
                className="w-full border border-[#c8dce5] bg-white px-4 py-3 text-[#173148] outline-none transition focus:border-[#285571] focus:ring-1 focus:ring-[#285571]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#55798d]">
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
                className="w-full border border-[#c8dce5] bg-white px-4 py-3 text-[#173148] outline-none transition focus:border-[#285571] focus:ring-1 focus:ring-[#285571]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#55798d]">
                Student ID
              </span>
              <input
                type="text"
                value={form.studentId}
                onChange={(event) => updateField("studentId", event.target.value)}
                required
                className="w-full border border-[#c8dce5] bg-white px-4 py-3 text-[#173148] outline-none transition focus:border-[#285571] focus:ring-1 focus:ring-[#285571]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#55798d]">
                Password
              </span>
              <input
                type="password"
                value={form.password}
                onChange={(event) => updateField("password", event.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
                className="w-full border border-[#c8dce5] bg-white px-4 py-3 text-[#173148] outline-none transition focus:border-[#285571] focus:ring-1 focus:ring-[#285571]"
              />
            </label>

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full cursor-pointer bg-[#285571] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#173f59] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Creating account..." : "Create account"}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-[#55798d]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="cursor-pointer font-semibold text-[#285571] hover:text-[#4d879d]"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
