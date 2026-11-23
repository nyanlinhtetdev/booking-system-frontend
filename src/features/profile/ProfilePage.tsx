import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../auth/useAuth";
import { updateProfile } from "./profileApi";
import type { UserUpdateProfileDto } from "./types/profile.types";
import type { User } from "../auth/types/auth.types";
import { getApiErrorMessage } from "../../services/apiError";

interface ProfileFormProps {
  user: User;
  onProfileUpdated: (updatedUser: { fullName: string; contactNumber: string | null }) => void;
  onShowSuccessToast: (message: string) => void;
}

function ProfileContent({ user, onProfileUpdated, onShowSuccessToast }: ProfileFormProps) {
  const [fullName, setFullName] = useState<string>(user.fullName ?? "");
  const [contactNumber, setContactNumber] = useState<string>(user.contactNumber ?? "");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const initialFullName = user.fullName ?? "";
  const initialContactNumber = user.contactNumber ?? "";

  const isDirty =
    fullName.trim() !== initialFullName.trim() ||
    contactNumber.trim() !== initialContactNumber.trim();

  const updateProfileMutation = useMutation({
    mutationFn: (request: UserUpdateProfileDto) => updateProfile(request),
    onSuccess: (_, variables) => {
      onProfileUpdated({
        fullName: variables.fullName,
        contactNumber: variables.contactNumber,
      });
      onShowSuccessToast("Profile updated successfully.");
      setErrorMessage(null);
    },
    onError: (error) => {
      setErrorMessage(getApiErrorMessage(error));
    },
  });

  function handleReset() {
    setFullName(user.fullName ?? "");
    setContactNumber(user.contactNumber ?? "");
    setErrorMessage(null);
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedFullName = fullName.trim();
    const trimmedContactNumber = contactNumber.trim();

    if (!trimmedFullName) {
      setErrorMessage("Full name is required.");
      return;
    }

    setErrorMessage(null);

    const payload: UserUpdateProfileDto = {
      fullName: trimmedFullName,
      contactNumber: trimmedContactNumber ? trimmedContactNumber : null,
    };

    updateProfileMutation.mutate(payload);
  }

  return (
    <section className="py-8">
      {/* Error alert */}
      {errorMessage && (
        <div
          role="alert"
          className="mb-6 border border-[#d7b7b0] bg-[#fff8f6] p-4 text-sm text-[#8a4d3e]"
        >
          <p className="font-semibold">Unable to update profile</p>
          <p className="mt-1">{errorMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Account Information (non-form presentation) */}
        <div className="border border-[#c8dce5] bg-[#f7fbfc] p-6 shadow-xs sm:p-8 lg:col-span-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#55798d]">
            Credentials
          </p>
          <h2 className="font-serif text-2xl text-[#142d43]">
            Account Information
          </h2>
          <p className="mt-1 text-xs text-[#55798d]">
            Your university-registered credentials and status.
          </p>

          <dl className="mt-6 divide-y divide-[#c8dce5] border-t border-[#c8dce5] text-sm">
            <div className="py-4">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#55798d]">
                Email Address
              </dt>
              <dd className="mt-1 font-serif text-lg text-[#142d43]">
                {user.email}
              </dd>
            </div>

            <div className="py-4">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#55798d]">
                Student ID
              </dt>
              <dd className="mt-1 font-serif text-lg text-[#142d43]">
                {user.studentId || "—"}
              </dd>
            </div>

            <div className="py-4">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#55798d]">
                Role
              </dt>
              <dd className="mt-1 font-serif text-lg text-[#142d43]">
                {user.role}
              </dd>
            </div>

            <div className="pt-4">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#55798d]">
                Status
              </dt>
              <dd className="mt-1 flex items-center gap-2 font-serif text-lg text-[#142d43]">
                <span
                  className={`size-2.5 rounded-full ${
                    user.isActive ? "bg-emerald-600" : "bg-slate-400"
                  }`}
                  aria-hidden="true"
                />
                <span>{user.isActive ? "Active" : "Inactive"}</span>
              </dd>
            </div>
          </dl>
        </div>

        {/* Edit Profile Form */}
        <div className="border border-[#c8dce5] bg-[#f7fbfc] p-6 shadow-xs sm:p-8 lg:col-span-7">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#55798d]">
            Personal details
          </p>
          <h2 className="font-serif text-2xl text-[#142d43]">
            Edit Profile
          </h2>
          <p className="mt-1 text-xs text-[#55798d]">
            Update your full name and contact phone number.
          </p>

          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block">
                <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#55798d]">
                  Full Name <span className="text-[#8a4d3e]">*</span>
                </span>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoComplete="name"
                  required
                  disabled={updateProfileMutation.isPending}
                  className="w-full border border-[#c8dce5] bg-white px-4 py-3 text-sm text-[#173148] outline-none transition placeholder:text-[#7793a2] focus:border-[#285571] focus:ring-1 focus:ring-[#285571] disabled:bg-slate-100"
                  placeholder="Enter full name"
                />
              </label>
            </div>

            <div>
              <label className="block">
                <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#55798d]">
                  Contact Number
                </span>
                <input
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  autoComplete="tel"
                  disabled={updateProfileMutation.isPending}
                  className="w-full border border-[#c8dce5] bg-white px-4 py-3 text-sm text-[#173148] outline-none transition placeholder:text-[#7793a2] focus:border-[#285571] focus:ring-1 focus:ring-[#285571] disabled:bg-slate-100"
                  placeholder="e.g. +60 12-345 6789"
                />
                <span className="mt-2 block text-xs text-[#7190a2]">
                  Used for reservation updates and facility inquiries.
                </span>
              </label>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 border-t border-[#c8dce5] pt-6">
              {isDirty && (
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={updateProfileMutation.isPending}
                  className="cursor-pointer border border-[#c8dce5] bg-transparent px-5 py-2.5 text-xs font-semibold text-[#55798d] transition hover:border-[#285571] hover:text-[#285571] disabled:opacity-50"
                >
                  Discard
                </button>
              )}
              <button
                type="submit"
                disabled={!isDirty || updateProfileMutation.isPending}
                className="cursor-pointer border border-[#285571] bg-[#285571] px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-[#173f59] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updateProfileMutation.isPending ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export function ProfilePage() {
  const { user, isLoading, updateUser } = useAuth();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-dismiss success toast after 4 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  if (isLoading) {
    return (
      <main className="min-h-[calc(100vh-81px)] bg-[#eaf3f7] text-[#173148]">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12 lg:py-16">
          <header className="border-b border-[#c8dce5] pb-8">
            <div className="h-4 w-36 animate-pulse bg-[#c8dce5]" />
            <div className="mt-3 h-10 w-64 animate-pulse bg-[#c8dce5]" />
          </header>
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="h-64 animate-pulse border border-[#c8dce5] bg-[#f7fbfc] lg:col-span-5" />
            <div className="h-80 animate-pulse border border-[#c8dce5] bg-[#f7fbfc] lg:col-span-7" />
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-[calc(100vh-81px)] bg-[#eaf3f7] text-[#173148]">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12 lg:py-16">
        {/* Success pop-up toast */}
        {toastMessage && (
          <div
            role="status"
            className="fixed top-6 right-6 z-50 flex items-center gap-3 border border-[#8ab3c9] bg-[#142d43] px-5 py-3.5 text-sm font-medium text-white shadow-xl transition-all"
          >
            <svg
              className="size-5 shrink-0 text-[#7ec29d]"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
            <span>{toastMessage}</span>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="ml-3 cursor-pointer text-white/70 hover:text-white"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        )}

        {/* Page Header */}
        <header className="border-b border-[#c8dce5] pb-8">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#55798d]">
            Student life / Account
          </p>
          <h1 className="font-serif text-4xl tracking-[-0.03em] text-[#142d43] sm:text-5xl">
            My Profile
          </h1>
          <p className="mt-2 text-sm text-[#55798d]">
            Manage your personal contact details and view registered account information.
          </p>
        </header>

        {/* Main Content */}
        <ProfileContent
          key={`${user.userId}-${user.fullName}-${user.contactNumber}`}
          user={user}
          onProfileUpdated={updateUser}
          onShowSuccessToast={setToastMessage}
        />
      </div>
    </main>
  );
}

export default ProfilePage;
