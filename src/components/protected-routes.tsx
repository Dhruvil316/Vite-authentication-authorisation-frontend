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

  console.log("protected route chala" , user );
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return user.role === "admin" ? (
      <Navigate to="/admin/dashboard"  />
    ) : (
      <Navigate to="/user/dashboard" replace />
    );
  }

  return <Outlet />;
};