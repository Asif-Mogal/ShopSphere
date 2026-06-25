import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import api from "../api/axios";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await api.get("/api/cart");
      setCartItems(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const increaseQuantity = async (id) => {
    try {
      await api.put(`/api/cart/${id}/increase`);
      fetchCart();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update quantity");
    }
  };

  const decreaseQuantity = async (id) => {
    try {
      await api.put(`/api/cart/${id}/decrease`);
      fetchCart();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update quantity");
    }
  };

  const removeItem = async (id) => {
    try {
      await api.delete(`/api/cart/${id}`);
      toast.success("Item removed");
      fetchCart();
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove item");
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!shippingAddress.trim() || !phoneNumber.trim()) {
      toast.error("Please fill in all shipping details");
      return;
    }
    setPlacingOrder(true);
    try {
      await api.post("/api/orders/place", {
        shippingAddress,
        phoneNumber,
      });
      toast.success("Order placed successfully");
      navigate("/orders");
    } catch (error) {
      console.error(error);
      const data = error.response?.data;
      if (data && typeof data === "object") {
        toast.error(Object.values(data)[0]);
      } else {
        toast.error(data || "Failed to place order");
      }
    } finally {
      setPlacingOrder(false);
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

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
        <h1 className="page-title">Shopping cart</h1>

        {cartItems.length === 0 ? (
          <div className="empty-state">
            <p>Your cart is empty.</p>
            <button onClick={() => navigate("/products")} className="link">
              Browse products
            </button>
          </div>
        ) : !showCheckout ? (
          <>
            <ul className="list">
              {cartItems.map((item) => (
                <li key={item.id} className="list-item">
                  <div className="list-item-main">
                    <h3>{item.product.name}</h3>
                    <p className="text-muted">
                      ₹{Number(item.product.price).toLocaleString()}
                    </p>
                  </div>
                  <div className="list-item-actions">
                    <div className="qty-control">
                      <button onClick={() => decreaseQuantity(item.id)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => increaseQuantity(item.id)}>+</button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="btn-remove"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="cart-summary">
              <p>
                Total ({cartItems.length}{" "}
                {cartItems.length === 1 ? "item" : "items"})
              </p>
              <p className="cart-total">₹{Number(total).toLocaleString()}</p>
            </div>

            <button
              onClick={() => setShowCheckout(true)}
              className="btn-primary btn-full"
            >
              Proceed to checkout
            </button>
          </>
        ) : (
          <div className="checkout-wrapper">
            <div className="checkout-header">
              <h2>Shipping details</h2>
              <button
                onClick={() => setShowCheckout(false)}
                className="link-back"
              >
                ← Back to cart
              </button>
            </div>

            <form onSubmit={handlePlaceOrder} className="checkout-form">
              <div className="field">
                <label htmlFor="address" className="field-label">
                  Shipping Address
                </label>
                <textarea
                  id="address"
                  required
                  rows={3}
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="field-input text-area"
                  placeholder="Flat/House No., Street Address, City, Pincode"
                />
              </div>

              <div className="field">
                <label htmlFor="phone" className="field-label">
                  Contact Number
                </label>
                <input
                  id="phone"
                  type="text"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="field-input"
                  placeholder="10-digit mobile number"
                />
              </div>

              <div className="checkout-summary">
                <p>Order Total:</p>
                <p className="checkout-total">₹{Number(total).toLocaleString()}</p>
              </div>

              <button
                type="submit"
                disabled={placingOrder}
                className="btn-primary btn-full"
              >
                {placingOrder ? "Placing order..." : "Confirm & Pay (COD)"}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default Cart;