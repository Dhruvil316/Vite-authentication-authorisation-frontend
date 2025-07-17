// src/authProvider.tsx
import { useEffect, useState } from "react";
import { logout, setUserAndCsrf } from "@/store/authSlice";

import api from "@/lib/axios";
import { useAppDispatch } from "@/store/hooks";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    console.log("auth provider mounted");
    
    const checkSession = async () => {
      try {
        const response = await api.get("/auth/session");
        if (isMounted) {
          dispatch(setUserAndCsrf(response.data));
        }
      } catch (err) {
        if (isMounted) {
          console.error("Session error:", err);
          // Don't call logoutUser here - it triggers refresh loop
          dispatch(logout()); // Directly clear auth state
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium text-red-600">Authentication Error</h2>
          <p className="mt-2">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-xl font-medium">Loading session...</span>
      </div>
    );
  }

  return <>{children}</>;
};