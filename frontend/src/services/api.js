import axios from "axios";

/* ✅ BASE URL FROM ENV */
const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

/* 🔐 ATTACH TOKEN */
API.interceptors.request.use(
  (req) => {
    const stored = localStorage.getItem("user");

    if (stored) {
      try {
        const user = JSON.parse(stored);
        if (user?.token) {
          req.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch {
        localStorage.removeItem("user");
      }
    }

    return req;
  },
  (error) => Promise.reject(error)
);

/* 🚨 AUTO LOGOUT ON 401 */
API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;