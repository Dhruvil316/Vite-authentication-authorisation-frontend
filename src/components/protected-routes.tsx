// src/components/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router";
import { useAppSelector } from "@/store/hooks";

type Role = "admin" | "user";

interface ProtectedRouteProps {
  allowedRoles: Role[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Only redirect if trying to access the wrong dashboard
  const isWrongDashboard =
    (location.pathname.startsWith("/admin") && user.role === "user") ||
    (location.pathname.startsWith("/user") && user.role === "admin");

  console.log("mei chala");
  console.log(user.role);
  

  if (!allowedRoles.includes(user.role)) {
    return isWrongDashboard ? (
      user.role === "admin" ? (
        // console.log("mearsdf");

        <Navigate to="/admin/dashboard" replace />
      ) : (
        <Navigate to="/user/dashboard" replace />
      )
    ) : (
      <div className="p-4 text-red-500 text-center">🚫 Access Denied</div>
    );
  }

  return <Outlet />;
};
