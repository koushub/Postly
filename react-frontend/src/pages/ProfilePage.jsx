import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuthStore } from "../store/authStore";
import PostCard from "../components/PostCard";
import { Edit2, Save, Heart, MessageSquare, FileText, Trash2, X, Check, AlertTriangle } from "lucide-react";

const ProfilePage = () => {
  const { user, token } = useAuthStore();
  const navigate = useNavigate();

  // Data States
  const [activeTab, setActiveTab] = useState("myPosts"); 
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Profile Editing State
  const [fullUserProfile, setFullUserProfile] = useState(null);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [aboutText, setAboutText] = useState("");

  // Confirmation Dialog State
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: "", // 'deletePost', 'deleteComment', 'deleteSaved', 'deleteLiked'
    id: null,
    title: ""
  });

  // 1. Fetch User Details
  useEffect(() => {
    if (!token || !user) {
      navigate("/login");
      return;
    }
    const fetchUserDetails = async () => {
      try {
        const res = await api.get(`/USER/${user.id}`);
        setFullUserProfile(res.data);
        setAboutText(res.data.about || ""); 
      } catch (err) { console.error(err); }
    };
    fetchUserDetails();
  }, [user, token, navigate]);

  // 2. Fetch Tab Content
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setData([]);
      try {
        let res;
        switch (activeTab) {
          case "myPosts": res = await api.get(`/user/${user.id}/POST`); break;
          case "saved": res = await api.get(`/user/saved-posts`); break;
          case "liked": res = await api.get(`/user/liked-posts`); break;
          case "comments": res = await api.get(`/user/${user.id}/comments`); break;
          default: return;
        }
        
        if (res.data && res.data.content && Array.isArray(res.data.content)) {
             setData(res.data.content);
        } else {
             setData(res.data);
        }
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    if (user) fetchData();
  }, [activeTab, user]);

  const handleUpdateAbout = async () => {
    try {
      const updatedUser = { ...fullUserProfile, about: aboutText };
      const res = await api.put(`/USER/${user.id}`, updatedUser);
      setFullUserProfile(res.data);
      setIsEditingAbout(false);
    } catch (err) { alert("Could not update profile."); }
  };

  // --- DELETE HANDLERS ---

  const requestDelete = (type, id) => {
    let title = "Are you sure?";
    if (type === "deletePost") title = "Delete this post permanently?";
    if (type === "deleteComment") title = "Delete this comment?";
    if (type === "deleteSaved") title = "Remove from Saved Posts?";
    if (type === "deleteLiked") title = "Remove from Liked Posts?"; // Added Title
    
    setConfirmDialog({ isOpen: true, type, id, title });
  };

  const confirmAction = async () => {
    const { type, id } = confirmDialog;
    try {
        if (type === "deletePost") {
            await api.delete(`/POST/${id}`);
            setData(data.filter(item => item.postId !== id));
        } else if (type === "deleteComment") {
            await api.delete(`/comments/${id}`);
            setData(data.filter(item => item.id !== id));
        } else if (type === "deleteSaved") {
            // Toggling save again removes it
            await api.post(`/post/${id}/save`); 
            setData(data.filter(item => item.postId !== id));
        } else if (type === "deleteLiked") {
            // Toggling like again removes it (unlike)
            await api.post(`/post/${id}/like`);
            setData(data.filter(item => item.postId !== id));
        }
    } catch (err) {
        console.error("Action failed", err);
        alert("Operation failed");
    } finally {
        setConfirmDialog({ isOpen: false, type: "", id: null, title: "" });
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 max-w-6xl mx-auto relative">
      
      {/* --- CUSTOM ALERT MODAL --- */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div role="alert" className="alert shadow-2xl bg-base-100 max-w-md border border-base-300 transform scale-100">
                <AlertTriangle className="stroke-error h-8 w-8 shrink-0" />
                <div className="flex flex-col">
                    <h3 className="font-bold text-lg">Confirm Action</h3>
                    <p className="text-base-content/70">{confirmDialog.title}</p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })} 
                        className="btn btn-sm btn-ghost"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={confirmAction} 
                        className="btn btn-sm btn-error text-white"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* --- Profile Header --- */}
      <div className="bg-base-100 shadow-xl rounded-2xl p-8 mb-10 border border-base-200">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="avatar placeholder">
  <div className="
    bg-primary text-primary-content 
    rounded-full 
    w-32 h-32 
    flex items-center justify-center
    text-4xl font-bold
    ring ring-primary ring-offset-base-100 ring-offset-2
    overflow-hidden
  ">
    {user.name.charAt(0).toUpperCase()}
  </div>
</div>

          <div className="flex-1 w-full">
            <h1 className="text-3xl font-extrabold mb-1">{user.name}</h1>
            <p className="text-base-content/60 font-medium mb-4">{user.email}</p>
            <div className="divider my-2"></div>
            <div className="relative group">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg">About Me</h3>
                {!isEditingAbout ? (
                  <button onClick={() => setIsEditingAbout(true)} className="btn btn-ghost btn-sm btn-circle"><Edit2 size={16} /></button>
                ) : (
                  <div className="flex gap-2">
                     <button onClick={handleUpdateAbout} className="btn btn-success btn-xs gap-1"><Check size={14}/> Save</button>
                     <button onClick={() => setIsEditingAbout(false)} className="btn btn-ghost btn-xs gap-1"><X size={14}/> Cancel</button>
                  </div>
                )}
              </div>
              {!isEditingAbout ? (
                <p className="text-base-content/80 leading-relaxed min-h-[3rem]">{fullUserProfile?.about || "Tell the world about yourself..."}</p>
              ) : (
                <textarea className="textarea textarea-bordered w-full h-24 text-base" value={aboutText} onChange={(e) => setAboutText(e.target.value)} placeholder="Write something about yourself..."></textarea>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- Tabs --- */}
      <div className="tabs tabs-boxed bg-base-100 p-2 mb-8 shadow-sm justify-center md:justify-start gap-2">
        {['myPosts', 'saved', 'liked', 'comments'].map(tab => (
            <a key={tab} className={`tab tab-lg capitalize ${activeTab === tab ? 'tab-active' : ''}`} onClick={() => setActiveTab(tab)}>
                {tab === 'myPosts' ? <FileText size={18} className="mr-2"/> : 
                 tab === 'saved' ? <Save size={18} className="mr-2"/> : 
                 tab === 'liked' ? <Heart size={18} className="mr-2"/> : 
                 <MessageSquare size={18} className="mr-2"/>} 
                {tab === 'myPosts' ? 'My Stories' : tab}
            </a>
        ))}
      </div>

      {/* --- Content --- */}
      {loading ? (
        <div className="flex justify-center py-20"><span className="loading loading-spinner loading-lg"></span></div>
      ) : (
        <>
          {(activeTab === 'myPosts' || activeTab === 'saved' || activeTab === 'liked') && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.length > 0 ? (
                data.map(post => (
                  <div key={post.postId} className="relative group h-full">
                    <PostCard post={post} />
                    
                    {/* Controls for MY STORIES */}
                    {activeTab === 'myPosts' && (
                       <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                          <Link to={`/edit/${post.postId}`} className="btn btn-sm btn-info text-white shadow-lg border-none"><Edit2 size={16}/></Link>
                          <button onClick={() => requestDelete('deletePost', post.postId)} className="btn btn-sm btn-error text-white shadow-lg border-none"><Trash2 size={16}/></button>
                       </div>
                    )}

                    {/* Controls for SAVED POSTS */}
                    {activeTab === 'saved' && (
                       <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                          <button 
                            onClick={() => requestDelete('deleteSaved', post.postId)} 
                            className="btn btn-sm btn-circle btn-error text-white shadow-lg border-none"
                            title="Remove from Saved"
                          >
                            <Trash2 size={16}/>
                          </button>
                       </div>
                    )}

                    {/* Controls for LIKED POSTS (Added) */}
                    {activeTab === 'liked' && (
                       <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                          <button 
                            onClick={() => requestDelete('deleteLiked', post.postId)} 
                            className="btn btn-sm btn-circle btn-error text-white shadow-lg border-none"
                            title="Remove from Liked"
                          >
                            <Trash2 size={16}/>
                          </button>
                       </div>
                    )}
                  </div>
                ))
              ) : <div className="col-span-full text-center py-10 opacity-50">No posts found.</div>}
            </div>
          )}

          {/* Comments List */}
          {activeTab === 'comments' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              {data.length > 0 ? (
                data.map(comment => (
                  <div key={comment.id} className="card bg-base-100 shadow-md border border-base-200 group">
                    <div className="card-body p-5">
                      <div className="flex gap-4 justify-between items-start">
                        <div className="flex gap-4">
                            <MessageSquare className="text-primary mt-1 shrink-0" size={24} />
                            <div>
                                <p className="font-medium text-lg mb-2">"{comment.content}"</p>
                                <span className="text-xs opacity-50">Comment ID: {comment.id}</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => requestDelete('deleteComment', comment.id)}
                            className="btn btn-sm btn-ghost btn-circle text-error opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : <div className="text-center py-10 opacity-50">No comments found.</div>}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProfilePage;