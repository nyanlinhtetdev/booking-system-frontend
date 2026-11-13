import { createBrowserRouter } from "react-router";
import MainLayout from "../components/layout/MainLayout";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import HomePage from "../pages/HomePage";
import LoginPage from "../features/auth/LoginPage";
import RegisterPage from "../features/auth/RegisterPage";

export const router = createBrowserRouter([
    {
        element: <MainLayout />,
        children: [
            {
                path: "/",
                element: <HomePage />,
            },
            {
                path: "/resources"
            },
            {
                path: "/login",
                element: <LoginPage />,
            },
            {
                path: "/register",
                element: <RegisterPage />,
            },
            {
                element: <ProtectedRoute allowedRoles={["Student", "Admin", "SuperAdmin"]}/>,
                children: [
                    {
                        path: "/profile"
                    }
                ]
            },
            {
                element: <ProtectedRoute allowedRoles={["Student"]}/>,
                children: [
                    {
                        path: "/bookings"
                    }
                ]
            },
            {
                element: <ProtectedRoute allowedRoles={["Admin", "SuperAdmin"]}/>,
                children: [
                    {
                        path: "/admin"
                    }
                ]
            }
        ]
    }
])