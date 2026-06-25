import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/api/auth/register", { name, email, password });
      toast.success("Registration successful");
      navigate("/");
    } catch (error) {
      console.error(error);
      const data = error.response?.data;
      if (data && typeof data === "object") {
        toast.error(Object.values(data)[0]);
      } else {
        toast.error(data || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1 className="auth-title">shopsphere</h1>
        <p className="auth-subtitle">Create your account</p>

        <form onSubmit={handleRegister} className="auth-form">
          <div className="field">
            <label htmlFor="name" className="field-label">Full name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="field-input"
              placeholder="John Doe"
            />
          </div>

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
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <button onClick={() => navigate("/")} className="link">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;