import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import Navbar from "../components/Navbar";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const navigate = useNavigate();

  // Categories extracted dynamically from products or fallback list
  const categories = ["Electronics", "Clothing", "Books", "Home", "Toys", "Fitness"];

  useEffect(() => {
    fetchProducts();
  }, [search, category, sortBy]);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/api/products", {
        params: {
          search: search || undefined,
          category: category || undefined,
          sortBy: sortBy || undefined,
        },
      });
      setProducts(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, e) => {
    e.stopPropagation(); // Prevent card click navigation
    try {
      await api.post("/api/cart/add", { productId, quantity: 1 });
      toast.success("Added to cart");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add to cart");
    }
  };

  return (
    <div className="page">
      <Navbar />
      <main className="container page-padding">
        <h1 className="page-title">Products</h1>
        <p className="page-subtitle">Browse our latest collection</p>

        {/* Filters Bar */}
        <div className="filters-bar">
          <div className="filter-group">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="field-input search-input"
            />
          </div>

          <div className="filter-group select-group">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="field-input"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="field-input"
            >
              <option value="">Sort by</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loader-center">
            <div className="spinner" />
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <p>No products available matching your search criteria.</p>
          </div>
        ) : (
          <div className="grid">
            {products.map((product) => (
              <div
                key={product.id}
                className="card"
                onClick={() => navigate(`/products/${product.id}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="card-image">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} />
                  ) : (
                    <span>No image</span>
                  )}
                </div>
                <div className="card-body">
                  <h3 className="card-title">{product.name}</h3>
                  <p className="card-description" title={product.description}>
                    {product.description}
                  </p>
                  <p className="card-category">{product.category}</p>
                  <p className="card-price">
                    ₹{Number(product.price).toLocaleString()}
                  </p>
                  <button
                    onClick={(e) => addToCart(product.id, e)}
                    className="btn-secondary"
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Products;