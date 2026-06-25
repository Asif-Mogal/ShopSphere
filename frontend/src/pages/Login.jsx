import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("token", response.data);
      toast.success("Login successful");
      navigate("/products");
    } catch (error) {
      console.error(error);
      const data = error.response?.data;
      if (data && typeof data === "object") {
        toast.error(Object.values(data)[0]);
      } else {
        toast.error(data || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1 className="auth-title">shopsphere</h1>
        <p className="auth-subtitle">Sign in to your account</p>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="field">
            <label htmlFor="email" className="field-label">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="field-input"
              placeholder="you@example.com"
            />
          </div>

          <div className="field">
            <label htmlFor="password" className="field-label">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="field-input"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{" "}
          <button onClick={() => navigate("/register")} className="link">
            Create one
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;