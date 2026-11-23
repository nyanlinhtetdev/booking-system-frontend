import { createBrowserRouter } from "react-router";
import MainLayout from "../components/layout/MainLayout";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import HomePage from "../pages/HomePage";
import LoginPage from "../features/auth/LoginPage";
import RegisterPage from "../features/auth/RegisterPage";
import { ResourcesPage } from "../features/resources/ResourcesPage";
import { ResourceDetailsPage } from "../features/resources/ResourceDetailsPage";
import { MyBookings } from "../features/bookings/MyBookings";
import { UpdateBookingPage } from "../features/bookings/UpdateBookingPage";

export const router = createBrowserRouter([
    {
        element: <MainLayout />,
        children: [
            {
                path: "/",
                element: <HomePage />,
            },
            {
                path: "/resources",
                element: <ResourcesPage />
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
                    },
                    {
                        path: "/bookings",
                        element: <MyBookings />
                    },
                    {
                        path: "/bookings/:bookingId/edit",
                        element: <UpdateBookingPage />
                    },
                    {
                        path: "/resources/:resourceId",
                        element: <ResourceDetailsPage />
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