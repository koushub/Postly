import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuthStore } from "../store/authStore";
import ImageUpload from "../components/ImageUpload";

const ComposePage = () => {
  const navigate = useNavigate();
  const { token } = useAuthStore();

  const [imageName, setImageName] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchCategories = async () => {
      try {
        const response = await api.get("/Category");
        setCategories(response.data);

        if (response.data && response.data.length > 0) {
          setCategoryId(response.data[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchCategories();
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!title.trim() || !content.trim() || !categoryId) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post(`/category/${categoryId}/POST`, {
        title,
        content,
        imageName: imageName || "default.png"
      });

      navigate(`/post/${response.data.postId}`);
    } catch (err) {
      console.error("Error creating post:", err);
      setError("Failed to publish post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 max-w-4xl mx-auto">
      <div className="flex flex-col gap-6">
        {}
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-extrabold mb-2">Create a Story</h1>
          <p className="text-base-content/60">
            Share your thoughts with the world.
          </p>
        </div>

        {}
        {error && (
          <div role="alert" className="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-bold text-lg">Title</span>
            </label>
            <input
              type="text"
              placeholder="Enter an engaging title..."
              className="input input-bordered input-lg w-full text-xl font-semibold focus:outline-none focus:border-primary"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {}
          <div className="form-control w-full md:w-1/2">
            <label className="label">
              <span className="label-text font-bold">Category</span>
            </label>
            <select
              className="select select-bordered w-full text-base"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option disabled value="">
                Select a category
              </option>
              {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                  {cat.categoryTitle}
                </option>
              ))}
            </select>
          </div>

          <ImageUpload onUploadSuccess={(url) => setImageName(url)} />

          {}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-bold text-lg">Content</span>
            </label>
            <textarea
              className="textarea textarea-bordered h-[40vh] w-full text-lg leading-relaxed resize-none focus:outline-none focus:border-primary p-4"
              placeholder="Tell your story..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>

          {}
          <div className="flex justify-end items-center gap-4 mt-4">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary px-8 rounded-full text-lg shadow-lg hover:scale-105 transition-transform"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Publish"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComposePage;
