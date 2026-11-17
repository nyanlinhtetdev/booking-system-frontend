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
    <nav
      className="border-b border-slate-200 bg-white shadow-sm"
      aria-busy={isLoading}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div
            className="flex w-full flex-wrap items-center justify-between gap-4"
            aria-label="Loading navigation"
          >
            <span className="h-7 w-40 animate-pulse rounded-md bg-slate-200" />
            <div className="flex flex-wrap items-center justify-end gap-2">
              <span className="h-9 w-36 animate-pulse rounded-md bg-slate-200" />
              <span className="h-9 w-16 animate-pulse rounded-md bg-slate-200" />
              <span className="h-9 w-20 animate-pulse rounded-md bg-slate-200" />
            </div>
          </div>
        ) : (
          <>
            <Link
              to="/"
              className="cursor-pointer font-serif text-xl text-[#142d43] transition-colors hover:text-[#4d879d]"
            >
              Booking System
            </Link>

            <div className="flex flex-wrap items-center justify-end gap-2 text-sm font-medium">
              <Link
                to="/resources"
                className="cursor-pointer px-3 py-2 text-[#55798d] transition-colors hover:bg-[#eaf3f7] hover:text-[#285571]"
              >
                Browse Resources
              </Link>

              {user == null && (
                <>
                  <Link
                    to="/login"
                    className="cursor-pointer px-3 py-2 text-[#55798d] transition-colors hover:bg-[#eaf3f7] hover:text-[#285571]"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="cursor-pointer bg-[#285571] px-3 py-2 text-white transition-colors hover:bg-[#173f59]"
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
                      className="cursor-pointer px-3 py-2 text-[#55798d] transition-colors hover:bg-[#eaf3f7] hover:text-[#285571]"
                    >
                      My Bookings
                    </Link>
                  )}
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="cursor-pointer px-3 py-2 text-[#55798d] transition-colors hover:bg-[#eaf3f7] hover:text-[#285571]"
                    >
                      Admin
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="cursor-pointer px-3 py-2 text-[#55798d] transition-colors hover:bg-[#eaf3f7] hover:text-[#285571]"
                  >
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="cursor-pointer border border-[#c8dce5] px-3 py-2 text-[#55798d] transition-colors hover:bg-[#eaf3f7]"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
