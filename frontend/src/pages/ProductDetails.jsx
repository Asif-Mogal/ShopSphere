import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import api from "../api/axios";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  // Review Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchProductAndReviews();
  }, [id]);

  const fetchProductAndReviews = async () => {
    try {
      const productRes = await api.get(`/api/products/${id}`);
      setProduct(productRes.data);

      const reviewsRes = await api.get(`/api/products/${id}/reviews`);
      setReviews(reviewsRes.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load product details");
      navigate("/products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    setAddingToCart(true);
    try {
      await api.post("/api/cart/add", { productId: product.id, quantity: 1 });
      toast.success("Added to cart");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please add a comment");
      return;
    }
    setSubmittingReview(true);
    try {
      await api.post(`/api/products/${id}/reviews`, {
        rating,
        comment,
      });
      toast.success("Review submitted!");
      setComment("");
      setRating(5);
      // Reload reviews
      const reviewsRes = await api.get(`/api/products/${id}/reviews`);
      setReviews(reviewsRes.data);
    } catch (error) {
      console.error(error);
      const data = error.response?.data;
      if (data && typeof data === "object") {
        toast.error(Object.values(data)[0]);
      } else {
        toast.error(data || "Failed to submit review");
      }
    } finally {
      setSubmittingReview(false);
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

  if (!product) return null;

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <div className="page">
      <Navbar />
      <main className="container page-padding">
        <button onClick={() => navigate("/products")} className="link-back">
          ← Back to products
        </button>

        {/* Product Details Section */}
        <div className="product-details-container">
          <div className="details-image-section">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} />
            ) : (
              <div className="no-image-placeholder">No Image Available</div>
            )}
          </div>

          <div className="details-info-section">
            <span className="details-category">{product.category}</span>
            <h1 className="details-title">{product.name}</h1>

            {averageRating && (
              <div className="details-rating-summary">
                <span className="stars">{"★".repeat(Math.round(averageRating)) + "☆".repeat(5 - Math.round(averageRating))}</span>
                <span className="rating-value">{averageRating} / 5.0</span>
                <span className="reviews-count">({reviews.length} customer reviews)</span>
              </div>
            )}

            <p className="details-price">₹{Number(product.price).toLocaleString()}</p>
            
            <div className="details-stock-status">
              {product.stock > 0 ? (
                <span className="stock-in">In Stock ({product.stock} items left)</span>
              ) : (
                <span className="stock-out">Out of Stock</span>
              )}
            </div>

            <p className="details-description">{product.description}</p>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || addingToCart}
              className="btn-primary details-btn"
            >
              {addingToCart ? "Adding..." : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section-wrapper">
          <div className="reviews-list-block">
            <h2>Customer Reviews ({reviews.length})</h2>
            {reviews.length === 0 ? (
              <p className="no-reviews-msg">No reviews yet for this product. Be the first to review!</p>
            ) : (
              <div className="reviews-list">
                {reviews.map((r) => (
                  <div key={r.id} className="review-card">
                    <div className="review-header">
                      <span className="review-user">{r.userName}</span>
                      <span className="review-date">
                        {new Date(r.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="review-rating">
                      {"★".repeat(r.rating) + "☆".repeat(5 - r.rating)}
                    </div>
                    <p className="review-comment">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="reviews-form-block">
            <h3>Write a Review</h3>
            <form onSubmit={handleAddReview} className="review-form">
              <div className="field">
                <label className="field-label">Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="field-input"
                >
                  <option value={5}>5 Stars - Excellent</option>
                  <option value={4}>4 Stars - Good</option>
                  <option value={3}>3 Stars - Average</option>
                  <option value={2}>2 Stars - Poor</option>
                  <option value={1}>1 Star - Very Bad</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="comment" className="field-label">
                  Your Review
                </label>
                <textarea
                  id="comment"
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="field-input text-area"
                  placeholder="Share your experience with this product..."
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="btn-primary"
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProductDetails;
