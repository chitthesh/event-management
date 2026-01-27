import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (err) {
    user = null;
  }

  // ✅ Allow access only if admin & token exists
  if (user?.role === "admin" && user?.token) {
    return children;
  }

  // ❌ Not authorized → redirect to login
  return <Navigate to="/" replace />;
}
