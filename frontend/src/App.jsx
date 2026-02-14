import {
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateEvent from "./pages/CreateEvent";
import Catering from "./pages/Catering";

import AdminDashboard from "./pages/AdminDashboard";
import AdminEventTypes from "./pages/AdminEventTypes";
import AdminCatering from "./pages/AdminCatering";
import AdminDecorations from "./pages/AdminDecoration";

import UserNavbar from "./components/UserNavbar";
import AdminNavbar from "./components/AdminNavbar";
import AdminRoute from "./components/AdminRoute";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AnimatePresence } from "framer-motion";

/* 🔐 Client Route Protection */
const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.token ? children : <Navigate to="/login" replace />;
};

/* 🔥 Layout Controller */
function Layout({ children }) {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const hideNavbar =
    location.pathname === "/" ||
    location.pathname === "/register" ||
    location.pathname === "/login";

  return (
    <>
      {!hideNavbar && user?.role === "client" && <UserNavbar />}
      {!hideNavbar && user?.role === "admin" && <AdminNavbar />}
      {children}
    </>
  );
}

function App() {
  const location = useLocation();

  return (
    <>
      <Layout>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>

            {/* 🌐 Public */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* 👤 Client */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/create"
              element={
                <PrivateRoute>
                  <CreateEvent />
                </PrivateRoute>
              }
            />

            <Route
              path="/catering"
              element={
                <PrivateRoute>
                  <Catering />
                </PrivateRoute>
              }
            />

            {/* 👑 Admin */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/event-types"
              element={
                <AdminRoute>
                  <AdminEventTypes />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/catering"
              element={
                <AdminRoute>
                  <AdminCatering />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/decorations"
              element={
                <AdminRoute>
                  <AdminDecorations />
                </AdminRoute>
              }
            />

            {/* ❌ Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </AnimatePresence>
      </Layout>

      {/* 🔔 Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
      />
    </>
  );
}

export default App;
