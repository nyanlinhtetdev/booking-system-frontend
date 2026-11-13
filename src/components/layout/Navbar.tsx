import { Link, useNavigate } from "react-router";
import { useAuth }  from "../../features/auth/useAuth";

export default function Navbar() {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout(): Promise<void> {
    await logout();
    navigate("/");
  }

  const isStudent = user?.role === "Student";
  const isAdmin = user?.role === "Admin" || user?.role === "SuperAdmin";

  return (
    <nav className="border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="text-xl font-bold text-slate-900 transition-colors hover:text-blue-600"
        >
          Booking System
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-2 text-sm font-medium">
          <Link
            to="/resources"
            className="rounded-md px-3 py-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            Browse Resources
          </Link>

          {isLoading ? (
            <span className="px-3 py-2 text-slate-500" aria-live="polite">
              Loading...
            </span>
          ) : (
            <>
              {user == null && (
                <>
                  <Link
                    to="/login"
                    className="rounded-md px-3 py-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-md bg-blue-600 px-3 py-2 text-white transition-colors hover:bg-blue-700"
                  >
                    Register
                  </Link>
                </>
              )}

              {(isStudent || isAdmin) && (
                <>
                  {isStudent && (
                    <Link
                      to="/bookings"
                      className="rounded-md px-3 py-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                    >
                      My Bookings
                    </Link>
                  )}
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="rounded-md px-3 py-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                    >
                      Admin
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="rounded-md px-3 py-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                  >
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-md border border-slate-300 px-3 py-2 text-slate-700 transition-colors hover:bg-slate-100"
                  >
                    Logout
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
