// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router";
import {User} from "lucide-react"
import { MainLayout } from "./layouts/MainLayout";
// import { AuthLayout } from "./layouts/AuthLayout";

// pages
// import Home from "./pages/Home";
// import About from "./pages/About";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import ConcertsHome from "./pages/concerts/ConcertsHome";
// import City from "./pages/concerts/City";
// import Trending from "./pages/concerts/Trending";

// mock user data for sidebar
const userData = {
  teams: [{ name: "Acme Corp", id: "1" }],
  navMain: [
    { name: "UserDashboard", url: "/user/dashboard", icon: User },
    { name: "Inventory", url: "/user/inventory", icon : User },
    { name: "Contractors", url: "/user/contractors", icon: User },
  ],
  user: { name: "Jane Doe", email : "work.dhruvilrana@gmail.com"},
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        {/* <Route path="/" element={<Home />} />
        <Route path="about" element={<About />} /> */}

        {/* Auth routes */}
        {/* <Route element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route> */}

        {/* App (with sidebar) */}
        <Route path = "" element={<MainLayout userData={userData} />}>
          {/* example user routes */}
          <Route path="user/dashboard" element={<div>User Dashboard</div>} />
          <Route path="user/inventory" element={<div>Inventory</div>} />
          <Route path="user/contractors" element={<div>Contractors</div>} />

          {/* concerts example */}
          {/* <Route path="concerts">
            <Route index element={<ConcertsHome />} />
            <Route path=":city" element={<City />} />
            <Route path="trending" element={<Trending />} />
          </Route> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
