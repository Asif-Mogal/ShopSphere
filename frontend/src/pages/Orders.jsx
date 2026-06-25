import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import api from "../api/axios";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/api/orders");
      setOrders(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const statusClass = (status) => {
    const map = {
      delivered: "badge-green",
      processing: "badge-blue",
      shipped: "badge-yellow",
      cancelled: "badge-red",
    };
    return map[status?.toLowerCase()] || "badge-default";
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loader-center">
          <div className="spinner" />
        </div>
      </>
    );
  }

  return (
    <div className="page">
      <Navbar />
      <main className="container page-padding max-w-xl">
        <h1 className="page-title">Your orders</h1>
        <p className="page-subtitle">View your purchase history</p>

        {orders.length === 0 ? (
          <div className="empty-state">
            <p>No orders yet.</p>
            <button onClick={() => navigate("/products")} className="link">
              Start shopping
            </button>
          </div>
        ) : (
          <div className="stack">
            {orders.map((order) => (
              <div key={order.id} className="panel">
                <div className="panel-header">
                  <div>
                    <p className="text-sm font-medium">Order #{order.id}</p>
                    <p className="text-muted text-xs mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <span className={`badge ${statusClass(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <ul className="panel-list">
                  {order.items.map((item, index) => (
                    <li key={index} className="panel-list-item">
                      <span className="truncate">{item.productName}</span>
                      <span className="text-muted shrink-0">
                        Qty: {item.quantity} × ₹
                        {Number(item.price).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="panel-footer">
                  <p className="text-muted">
                    Total:{" "}
                    <span className="font-semibold text-gray-900">
                      ₹{Number(order.totalAmount).toLocaleString()}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Orders;