import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { useAuthStore } from "../store/authStore";

const EditPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load Categories & Post Data
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const initData = async () => {
      try {
        // 1. Fetch Categories
        const catRes = await api.get("/Category");
        setCategories(catRes.data);

        // 2. Fetch Post Details
        const postRes = await api.get(`/POST/${postId}`);
        const post = postRes.data;

        setTitle(post.title);
        setContent(post.content);
        setCategoryId(post.category?.id || post.category?.categoryId || ""); 
        setLoading(false);
      } catch (err) {
        console.error("Error loading edit data", err);
        setError("Failed to load post data.");
        setLoading(false);
      }
    };

    initData();
  }, [postId, token, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedPost = {
        title,
        content,
        imageName: "default.png" // Preserve or update image logic if you have it
      };

      // Endpoint: PUT /home/api/POST/{postId}
      await api.put(`/POST/${postId}`, updatedPost);
      
      // Redirect back to the post or profile
      navigate(`/post/${postId}`);
    } catch (err) {
      console.error("Update failed", err);
      setError("Failed to update post.");
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><span className="loading loading-spinner loading-lg"></span></div>;

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 max-w-4xl mx-auto">
      <div className="flex flex-col gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-extrabold mb-2">Edit Story</h1>
          <p className="text-base-content/60">Update your content.</p>
        </div>

        {error && <div className="alert alert-error"><span>{error}</span></div>}

        <form onSubmit={handleUpdate} className="flex flex-col gap-6">
          <div className="form-control w-full">
            <label className="label"><span className="label-text font-bold text-lg">Title</span></label>
            <input 
              type="text" 
              className="input input-bordered input-lg w-full text-xl font-semibold" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-control w-full">
             {/* Category is often read-only in edits, or you can allow change if backend supports it */}
             <label className="label"><span className="label-text font-bold">Category (Current)</span></label>
             <select 
               className="select select-bordered" 
               value={categoryId} 
               disabled 
               // Disabled because changing category usually requires a different endpoint or complex logic
             >
                {categories.map(c => <option key={c.id} value={c.id}>{c.categoryTitle}</option>)}
             </select>
             <span className="text-xs text-base-content/50 mt-1">Category cannot be changed during edit.</span>
          </div>

          <div className="form-control w-full">
            <label className="label"><span className="label-text font-bold text-lg">Content</span></label>
            <textarea 
              className="textarea textarea-bordered h-[40vh] w-full text-lg leading-relaxed p-4" 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="flex justify-end gap-4 mt-4">
             <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
             <button type="submit" className="btn btn-primary px-8 rounded-full">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;