import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import api from "../api/axios";

function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("products");

  // Products state
  const [products, setProducts] = useState([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Product form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [savingProduct, setSavingProduct] = useState(false);

  // Orders state
  const [orders, setOrders] = useState([]);
  const [updatingOrderStatus, setUpdatingOrderStatus] = useState(null);

  useEffect(() => {
    checkAdminAccessAndLoad();
  }, [activeTab]);

  const checkAdminAccessAndLoad = async () => {
    try {
      const userRes = await api.get("/api/auth/me");
      if (userRes.data.role !== "ADMIN") {
        toast.error("Access denied. Admin role required.");
        navigate("/products");
        return;
      }
      
      if (activeTab === "products") {
        await fetchProducts();
      } else {
        await fetchOrders();
      }
    } catch (error) {
      console.error(error);
      toast.error("Auth check failed");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get("/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load products");
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await api.get("/api/orders/all");
      setOrders(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load orders");
    }
  };

  const handleOpenAddForm = () => {
    setEditingProduct(null);
    setName("");
    setDescription("");
    setPrice("");
    setStock("");
    setCategory("Electronics");
    setImageUrl("");
    setShowProductForm(true);
  };

  const handleOpenEditForm = (prod) => {
    setEditingProduct(prod);
    setName(prod.name);
    setDescription(prod.description);
    setPrice(prod.price);
    setStock(prod.stock);
    setCategory(prod.category);
    setImageUrl(prod.imageUrl);
    setShowProductForm(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!name || !description || !price || stock === "" || !category || !imageUrl) {
      toast.error("All fields are required");
      return;
    }
    setSavingProduct(true);
    const payload = {
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      category,
      imageUrl,
    };

    try {
      if (editingProduct) {
        await api.put(`/api/products/${editingProduct.id}`, payload);
        toast.success("Product updated successfully");
      } else {
        await api.post("/api/products", payload);
        toast.success("Product added successfully");
      }
      setShowProductForm(false);
      fetchProducts();
    } catch (error) {
      console.error(error);
      const data = error.response?.data;
      if (data && typeof data === "object") {
        toast.error(Object.values(data)[0]);
      } else {
        toast.error("Failed to save product");
      }
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/api/products/${productId}`);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete product");
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingOrderStatus(orderId);
    try {
      await api.put(`/api/orders/${orderId}/status`, null, {
        params: { status: newStatus },
      });
      toast.success(`Order #${orderId} status updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    } finally {
      setUpdatingOrderStatus(null);
    }
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
      <main className="container page-padding">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Manage store inventory and customer orders</p>

        {/* Tabs Bar */}
        <div className="admin-tabs">
          <button
            onClick={() => setActiveTab("products")}
            className={`admin-tab-btn ${activeTab === "products" ? "active" : ""}`}
          >
            Products Inventory
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`admin-tab-btn ${activeTab === "orders" ? "active" : ""}`}
          >
            Orders Management
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "products" && (
          <div className="admin-content-section">
            <div className="admin-action-header">
              <h2>Inventory List ({products.length})</h2>
              <button onClick={handleOpenAddForm} className="btn-primary add-product-btn">
                + Add Product
              </button>
            </div>

            {showProductForm && (
              <div className="modal-overlay" onClick={() => setShowProductForm(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <div className="modal-header">
                    <h2>{editingProduct ? "Edit Product" : "Add New Product"}</h2>
                    <button onClick={() => setShowProductForm(false)} className="modal-close-btn">
                      &times;
                    </button>
                  </div>
                  <form onSubmit={handleSaveProduct} className="modal-form">
                    <div className="field">
                      <label htmlFor="prod-name" className="field-label">Product Name</label>
                      <input
                        id="prod-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="field-input"
                        placeholder="e.g. Wireless Headset"
                      />
                    </div>

                    <div className="field-row">
                      <div className="field">
                        <label htmlFor="prod-price" className="field-label">Price (₹)</label>
                        <input
                          id="prod-price"
                          type="number"
                          required
                          min={1}
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="field-input"
                          placeholder="999"
                        />
                      </div>
                      <div className="field">
                        <label htmlFor="prod-stock" className="field-label">Stock Quantity</label>
                        <input
                          id="prod-stock"
                          type="number"
                          required
                          min={0}
                          value={stock}
                          onChange={(e) => setStock(e.target.value)}
                          className="field-input"
                          placeholder="50"
                        />
                      </div>
                    </div>

                    <div className="field">
                      <label htmlFor="prod-category" className="field-label">Category</label>
                      <select
                        id="prod-category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="field-input"
                      >
                        <option value="Electronics">Electronics</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Books">Books</option>
                        <option value="Home">Home</option>
                        <option value="Toys">Toys</option>
                        <option value="Fitness">Fitness</option>
                      </select>
                    </div>

                    <div className="field">
                      <label htmlFor="prod-image" className="field-label">Image URL</label>
                      <input
                        id="prod-image"
                        type="text"
                        required
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="field-input"
                        placeholder="https://images.unsplash.com/photo-..."
                      />
                    </div>

                    <div className="field">
                      <label htmlFor="prod-desc" className="field-label">Description</label>
                      <textarea
                        id="prod-desc"
                        required
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="field-input text-area"
                        placeholder="Detailed description of the product features..."
                      />
                    </div>

                    <button type="submit" disabled={savingProduct} className="btn-primary">
                      {savingProduct ? "Saving..." : "Save Product"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {products.length === 0 ? (
              <div className="empty-state">
                <p>No products in inventory. Click Add Product to create one.</p>
              </div>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((prod) => (
                      <tr key={prod.id}>
                        <td>
                          <img src={prod.imageUrl} alt={prod.name} className="admin-table-img" />
                        </td>
                        <td className="font-semibold">{prod.name}</td>
                        <td><span className="badge badge-default">{prod.category}</span></td>
                        <td>₹{Number(prod.price).toLocaleString()}</td>
                        <td>
                          <span className={prod.stock === 0 ? "text-danger font-semibold" : ""}>
                            {prod.stock}
                          </span>
                        </td>
                        <td className="text-right admin-table-actions">
                          <button
                            onClick={() => handleOpenEditForm(prod)}
                            className="btn-edit"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="btn-delete"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "orders" && (
          <div className="admin-content-section">
            <h2>Customer Orders List ({orders.length})</h2>

            {orders.length === 0 ? (
              <div className="empty-state">
                <p>No customer orders placed yet.</p>
              </div>
            ) : (
              <div className="admin-orders-list">
                {orders.map((order) => (
                  <div key={order.id} className="admin-order-panel">
                    <div className="order-panel-header">
                      <div>
                        <h3>Order #{order.id}</h3>
                        <p className="order-date">
                          Placed on: {new Date(order.createdAt).toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div className="order-status-update">
                        <label htmlFor={`status-${order.id}`} className="sr-only">Status</label>
                        <select
                          id={`status-${order.id}`}
                          value={order.status}
                          disabled={updatingOrderStatus === order.id}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                          className="field-input status-select"
                        >
                          <option value="PLACED">Placed</option>
                          <option value="PROCESSING">Processing</option>
                          <option value="SHIPPED">Shipped</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div className="order-panel-details">
                      <div className="order-shipping-info">
                        <h4>Shipping Information</h4>
                        <p><strong>Address:</strong> {order.shippingAddress}</p>
                        <p><strong>Phone:</strong> {order.phoneNumber}</p>
                      </div>

                      <div className="order-items-info">
                        <h4>Items Ordered</h4>
                        <ul>
                          {order.items.map((item, index) => (
                            <li key={index}>
                              <span>{item.productName}</span>
                              <span>Qty: {item.quantity} &times; ₹{Number(item.price).toLocaleString()}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="order-panel-footer">
                          <span>Total Amount:</span>
                          <span className="total-val">₹{Number(order.totalAmount).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
