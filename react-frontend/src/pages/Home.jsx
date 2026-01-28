import React, { useEffect, useState } from "react";
import api from "../services/api";
import Hero from "../components/Hero";
import PostGrid from "../components/PostGrid";
import Pagination from "../components/Pagination";
import { Filter, SortAsc, SortDesc } from "lucide-react";

const Home = () => {
  // Data State
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination & Filter State
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(6); 
  
  const [sortBy, setSortBy] = useState("uploadDate");
  const [sortDir, setSortDir] = useState("desc");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // 1. Fetch Categories on Mount
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get("/Category");
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to load categories");
      }
    };
    fetchCats();
  }, []);

  // 2. Fetch Posts (Triggered when params change)
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        let url = "";
        let params = {
            pageNumber,
            pageSize,
            sortBy,
            sortDir
        };

        if (selectedCategory === "all") {
            url = `/POST`;
        } else {
            // Note: Your backend Category endpoint does NOT support pagination params yet,
            // but passing them won't break it. It just returns a List, not a Page.
            url = `/Category/${selectedCategory}/POST`;
        }

        const res = await api.get(url, { params });
        
        // --- FIX: Handle Response Structure Differences ---
        if (Array.isArray(res.data)) {
            // Case 1: Category Endpoint (Returns raw List<PostDto>)
            setPosts(res.data);
            setTotalPages(1); // No pagination info from backend, so assume 1 page
        } else {
            // Case 2: All Posts Endpoint (Returns PostResponse with .content)
            setPosts(res.data.content || []);
            setTotalPages(res.data.totalPages || 0);
        }
        
      } catch (err) {
        console.error("Error fetching posts:", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
    
    if(pageNumber > 0) {
        document.getElementById("latest-posts")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [pageNumber, pageSize, sortBy, sortDir, selectedCategory]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPageNumber(0); 
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    if (value === "newest") {
        setSortBy("uploadDate");
        setSortDir("desc");
    } else if (value === "oldest") {
        setSortBy("uploadDate");
        setSortDir("asc");
    } else if (value === "title") {
        setSortBy("title");
        setSortDir("asc");
    }
    setPageNumber(0);
  };

  return (
    <div className="min-h-screen bg-base-100">
      <Hero />

      {/* Main Content */}
      <div id="latest-posts" className="max-w-7xl mx-auto px-6 py-8">
        
        {/* --- Header & Controls --- */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold">Latest Stories</h2>
            <p className="text-base-content/60 mt-2 text-xl">Discover the most recent thinking.</p>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-4 items-center">
            
            {/* Sort Dropdown */}
            <div className="join">
                <button className="btn join-item btn-sm no-animation bg-base-200 border-none cursor-default"><SortDesc size={16}/></button>
                <select 
                    className="select select-bordered select-sm join-item focus:outline-none text-lg cursor-pointer"
                    onChange={handleSortChange}
                    defaultValue="newest"
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="title">A-Z Title</option>
                </select>
            </div>

            {/* Category Dropdown */}
            <div className="join">
                <button className="btn join-item btn-sm no-animation bg-base-200 border-none cursor-default"><Filter size={16}/></button>
                <select 
                    className="select select-bordered select-sm join-item focus:outline-none max-w-[150px] text-lg cursor-pointer"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                >
                    <option value="all">All Topics</option>
                    {categories.map((cat) => (
                        <option key={cat.categoryId || cat.id} value={cat.categoryId || cat.id}>
                            {cat.categoryTitle}
                        </option>
                    ))}
                </select>
            </div>

          </div>
        </div>

        {/* --- Posts Grid --- */}
        <PostGrid posts={posts} loading={loading} />

        {/* --- Pagination --- */}
        {!loading && totalPages > 1 && (
            <Pagination 
                currentPage={pageNumber} 
                totalPages={totalPages} 
                onPageChange={setPageNumber} 
            />
        )}
        
      </div>
    </div>
  );
};

export default Home;