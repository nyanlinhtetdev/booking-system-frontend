import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../../features/auth/useAuth";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

function ProtectedRoute({ allowedRoles } : ProtectedRouteProps) {
    const { user, accessToken, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <div>Checking your session...</div>;
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
