import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../../features/auth/useAuth";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

function ProtectedRoute({ allowedRoles } : ProtectedRouteProps) {
    const { user, accessToken, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <main className="grid min-h-[calc(100vh-81px)] place-items-center bg-slate-50">
            <div className="flex items-center gap-3 text-slate-600">
                <span className="size-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
                <span>Checking your session...</span>
            </div>
            </main>
        );
    }

    if (!(user && accessToken)) {
        return (
            <Navigate
                to="/login"
                state={{ from: location }}
                replace
            />
        );
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;
