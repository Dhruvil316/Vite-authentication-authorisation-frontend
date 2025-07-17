// authProvider.tsx
import { useEffect, useState } from "react";
import { setUserAndCsrf } from "@/store/authSlice";
import { logoutUser } from "@/store/authSlice";
import api from "@/lib/axios";
import { useAppDispatch } from "@/store/hooks"; // Use typed dispatch

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch(); // This is the key fix
  const [loading, setLoading] = useState(true);
    
  useEffect(() => {
    api
      .get("/auth/session")
      .then((res) => dispatch(setUserAndCsrf(res.data)))
      .catch((err) => {
        console.log("kuch error " , err);
        
        dispatch(logoutUser());
      }) // Now properly typed
      .finally(() => setLoading(false));

      console.log("session called ");

  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-xl font-medium">Loading session...</span>
      </div>
    );
  }

  return <>{children}</>;
};
