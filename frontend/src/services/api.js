import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

/* 🔐 ATTACH TOKEN TO EVERY REQUEST */
API.interceptors.request.use(
  (req) => {
    const stored = localStorage.getItem("user");

    if (stored) {
      try {
        const user = JSON.parse(stored);
        if (user?.token) {
          req.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (err) {
        console.error("Invalid user in localStorage");
        localStorage.removeItem("user");
      }
    }

    return req;
  },
  (error) => Promise.reject(error)
);

/* 🚨 HANDLE 401 (AUTO LOGOUT) */
API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized – logging out");

      localStorage.removeItem("user");

      // optional redirect
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;
