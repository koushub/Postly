import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import PostCard from "../components/PostCard";
import { User, FileText, Calendar } from "lucide-react";

const PublicProfilePage = () => {
  const { userId } = useParams();
  
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Public User Details
        // Endpoint: GET /home/api/public/users/{userId}
        const userRes = await api.get(`/public/users/${userId}`);
        setProfile(userRes.data);

        // 2. Fetch User's Posts (Reuse existing endpoint)
        // Endpoint: GET /home/api/user/{userId}/POST
        const postsRes = await api.get(`/user/${userId}/POST`);
        
        // Handle Pagination vs Array structure
        if (postsRes.data && postsRes.data.content && Array.isArray(postsRes.data.content)) {
            setPosts(postsRes.data.content);
        } else if (Array.isArray(postsRes.data)) {
            setPosts(postsRes.data);
        } else {
            setPosts([]);
        }

        setLoading(false);
      } catch (err) {
        console.error("Failed to load public profile", err);
        setError("Failed to load profile.");
        setLoading(false);
      }
    };

    if (userId) fetchData();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl font-bold mb-4">User not found</h2>
        <Link to="/" className="btn btn-primary">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 max-w-6xl mx-auto">
      
      {/* --- Profile Header --- */}
      <div className="bg-base-100 shadow-xl rounded-2xl p-8 mb-10 border border-base-200">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
          {/* Avatar */}
          <div className="avatar placeholder">
            <div className="bg-primary text-primary-content 
    rounded-full 
    w-32 h-32 
    flex items-center justify-center
    text-4xl font-bold
    ring ring-primary ring-offset-base-100 ring-offset-2
    overflow-hidden">
              <span>{profile.name?.charAt(0).toUpperCase()}</span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold mb-2">{profile.name}</h1>
            <div className="badge badge-secondary badge-outline mb-4">Author</div>
            
            <div className="divider my-2"></div>
            
            <div className="bg-base-200/50 p-4 rounded-xl">
                <h3 className="font-bold text-sm text-base-content/50 uppercase mb-2">About</h3>
                <p className="text-lg leading-relaxed italic">
                  "{profile.about || "This author hasn't written a bio yet."}"
                </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- Stories Section --- */}
      <div className="mb-6 flex items-center gap-2">
         <FileText className="text-primary" />
         <h2 className="text-2xl font-bold">Stories by {profile.name}</h2>
         <span className="badge badge-neutral ml-2">{posts.length}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.length > 0 ? (
            posts.map(post => (
              <div key={post.postId} className="h-full">
                <PostCard post={post} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-base-100 rounded-xl border border-dashed border-base-300">
                <p className="text-base-content/50">No stories published yet.</p>
            </div>
          )}
      </div>

    </div>
  );
};

export default PublicProfilePage;