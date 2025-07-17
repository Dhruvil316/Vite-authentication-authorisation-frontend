// src/components/HomeRedirect.tsx
import { Navigate } from "react-router";
import { useAppSelector } from "@/store/hooks";

export const HomeRedirect = () => {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return user.role === "admin" ? (
    <Navigate to="/admin/dashboard" replace />
  ) : (
    <Navigate to="/user/dashboard" replace />
  );
};