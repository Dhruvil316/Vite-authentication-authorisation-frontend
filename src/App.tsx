// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router";
import { User } from "lucide-react";
import { MainLayout } from "./layouts/MainLayout";
import Login from "./auth-screens/login";
import { HomeRedirect } from "./components/home-redirect";
import { ProtectedRoute } from "./components/protected-routes";

const userData = {
  teams: [{ name: "Acme Corp", id: "1" }],
  navMain: [
    { name: "UserDashboard", url: "/user/dashboard", icon: User },
    { name: "Inventory", url: "/user/inventory", icon: User },
    { name: "Contractors", url: "/user/contractors", icon: User },
  ],
  user: { name: "Jane Doe", email: "work.dhruvilrana@gmail .com" },
};

const adminData = {
  teams: [{ name: "Acme Corp", id: "1" }],
  navMain: [
    { name: "UserDashboard", url: "/admin/dashboard", icon: User },
    { name: "Inventory", url: "/admin/inventory", icon: User },
    { name: "Contractors", url: "/admin/contractors", icon: User },
  ],
  user: { name: "Jane Doe", email: "work.dhruvilrana@gmail.com" },
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<HomeRedirect />} />

        {/* User Routes */}
        <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
          <Route element={<MainLayout userData={userData} />}>
            <Route path="user/dashboard" element={<div>User Dashboard</div>} />
            <Route path="user/inventory" element={<div>Inventory</div>} />
            <Route path="user/contractors" element={<div>Contractors</div>} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route element={<MainLayout userData={adminData} />}>
            <Route
              path="admin/dashboard"
              element={<div>Admin Dashboadfard</div>}
            />
            <Route path="admin/inventory" element={<div>Inventiry</div>} />
            <Route path="admin/contractors" element={<div>Contractors</div>} />
          </Route>
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
