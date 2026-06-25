import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

function Navbar() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await api.get("/api/auth/me");
          if (response.data.role === "ADMIN") {
            setIsAdmin(true);
          }
        }
      } catch (error) {
        console.error("Error fetching user in navbar:", error);
      }
    };
    fetchUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <button
          onClick={() => navigate("/products")}
          className="navbar-brand"
        >
          shopsphere
        </button>

        <nav className="navbar-nav">
          <button onClick={() => navigate("/products")}>Products</button>
          <button onClick={() => navigate("/orders")}>Orders</button>
          <button onClick={() => navigate("/cart")}>Cart</button>
          {isAdmin && (
            <button onClick={() => navigate("/admin")} style={{ fontWeight: '600', color: '#4f46e5' }}>
              Admin
            </button>
          )}
          <button onClick={logout} className="navbar-logout">
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;