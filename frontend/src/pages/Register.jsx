import API from "../services/api";
import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const register = async () => {
    try {
      const res = await axios.post(
       `${import.meta.env.VITE_API_URL}/api/auth/register`,
        form
      );

      alert("Registered successfully");
      window.location.href = "/";
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Registration failed");
    }
  };

  return (
    <div>
      <input
        placeholder="Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button onClick={register}>Register</button>
    </div>
  );
}

