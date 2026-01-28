import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  User,
  Calendar,
  MessageSquare,
  Heart,
  Send,
  LogIn,
  Bookmark,
  AlertCircle,
  Trash2,
  Flag,
  X,
  CheckCircle,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";

const PostPage = () => {
  const { theme } = useThemeStore();
  const { postId } = useParams();
  const { token, user } = useAuthStore();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // Interactive State
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  // --- MODAL STATES ---
  // 1. Login Requirement
  const [showLoginAlert, setShowLoginAlert] = useState(false);

  // 2. Report Modal (Reason Input)
  const [reportModal, setReportModal] = useState({
    isOpen: false,
    type: "", // 'post' or 'comment'
    id: null,
  });
  const [reportReason, setReportReason] = useState("");

  // 3. Confirmation Dialog (Delete)
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    action: null, // Function to execute on confirm
  });

  // 4. Info/Success Alert (Replacing standard alert())
  const [infoAlert, setInfoAlert] = useState({
    isOpen: false,
    type: "error", // 'error' or 'success'
    message: "",
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/POST/${postId}`);
        setPost(response.data);
        setLikeCount(response.data.likeCount || 0);
        setLoading(false);
        if (token) checkInteractions();
      } catch (err) {
        console.error("Error fetching post:", err);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId, token]);

  const checkInteractions = async () => {
    try {
      const likeRes = await api.get("/user/liked-posts");
      const likedPosts = likeRes.data.content || likeRes.data || [];
      if (Array.isArray(likedPosts))
        setIsLiked(likedPosts.some((p) => p.postId === Number(postId)));

      const saveRes = await api.get("/user/saved-posts");
      const savedPosts = saveRes.data.content || saveRes.data || [];
      if (Array.isArray(savedPosts))
        setIsSaved(savedPosts.some((p) => p.postId === Number(postId)));
    } catch (err) {
      console.error(err);
    }
  };

  // --- HANDLERS ---

  const handleLike = async () => {
    if (!token) {
      setShowLoginAlert(true);
      return;
    }
    const newStatus = !isLiked;
    setIsLiked(newStatus);
    setLikeCount((prev) => (newStatus ? prev + 1 : prev - 1));
    try {
      await api.post(`/post/${postId}/like`);
    } catch (err) {
      setIsLiked(!newStatus);
      setLikeCount((prev) => (newStatus ? prev - 1 : prev + 1));
    }
  };

  const handleSave = async () => {
    if (!token) {
      setShowLoginAlert(true);
      return;
    }
    const newStatus = !isSaved;
    setIsSaved(newStatus);
    try {
      await api.post(`/post/${postId}/save`);
    } catch (err) {
      setIsSaved(!newStatus);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmittingComment(true);
    try {
      const res = await api.post(`/POST/${postId}/comments`, {
        content: commentText,
      });
      setPost((prev) => ({ ...prev, comments: [...prev.comments, res.data] }));
      setCommentText("");
    } catch (err) {
      setInfoAlert({
        isOpen: true,
        type: "error",
        message: "Failed to post comment.",
      });
    } finally {
      setSubmittingComment(false);
    }
  };

  // --- REPORT LOGIC ---
  const initiateReport = (type, id) => {
    if (!token) {
      setShowLoginAlert(true);
      return;
    }
    setReportModal({ isOpen: true, type, id });
    setReportReason("");
  };

  const submitReport = async () => {
    if (!reportReason.trim()) return;

    const payload = {
      reason: reportReason,
      reporterName: user.name, // Optional, backend might extract from token
      postId: reportModal.type === "post" ? reportModal.id : null,
      commentId: reportModal.type === "comment" ? reportModal.id : null,
    };

    try {
      await api.post("/report", payload);
      setReportModal({ isOpen: false, type: "", id: null });
      setInfoAlert({
        isOpen: true,
        type: "success",
        message: "Report submitted successfully.",
      });
    } catch (err) {
      console.error(err);
      setInfoAlert({
        isOpen: true,
        type: "error",
        message: "Failed to submit report.",
      });
    }
  };

  // --- DELETE LOGIC (Custom Alert) ---
  const handleDeleteRequest = (commentId) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Comment",
      message: "Are you sure you want to delete this comment?",
      action: () => performDelete(commentId),
    });
  };

  const performDelete = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setPost((prev) => ({
        ...prev,
        comments: prev.comments.filter((c) => c.id !== commentId),
      }));
      setConfirmDialog({ isOpen: false, title: "", message: "", action: null });
    } catch (err) {
      setInfoAlert({
        isOpen: true,
        type: "error",
        message: "Failed to delete comment.",
      });
    }
  };

  // --- RENDER ---
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  if (!post)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl font-bold mb-4">Post not found</h2>
        <Link to="/" className="btn btn-primary">
          Go Home
        </Link>
      </div>
    );

  const formattedDate = new Date(post.uploadDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const isOwnPost = user && post.user && user.id === post.user.id;
  const authorLink = isOwnPost ? "/profile" : `/author/${post.user?.id}`;

  return (
    <div className="min-h-screen bg-base-100 pb-20 relative">
      {/* ================= MODALS ================= */}

      {/* 1. Login Required Modal */}
      {showLoginAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            role="alert"
            className="alert shadow-2xl bg-base-100 max-w-sm border border-base-300 transform scale-100 flex-col items-start gap-4"
          >
            <div className="flex items-center gap-3 w-full">
              <AlertCircle className="stroke-info h-8 w-8 shrink-0" />
              <h3 className="font-bold text-lg">Login Required</h3>
            </div>
            <p className="text-base-content/70">
              You need to be logged in to perform this action.
            </p>
            <div className="flex justify-end gap-2 w-full mt-2">
              <button
                onClick={() => setShowLoginAlert(false)}
                className="btn btn-sm btn-ghost"
              >
                Cancel
              </button>
              <Link to="/login" className="btn btn-sm btn-primary">
                Log in
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 2. Custom Confirmation Modal (Delete) */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            role="alert"
            className="alert shadow-2xl bg-base-100 max-w-sm border border-base-300 transform scale-100 flex-col items-start gap-4"
          >
            <div className="flex items-center gap-3 w-full">
              <AlertCircle className="stroke-error h-8 w-8 shrink-0" />
              <h3 className="font-bold text-lg">{confirmDialog.title}</h3>
            </div>
            <p className="text-base-content/70">{confirmDialog.message}</p>
            <div className="flex justify-end gap-2 w-full mt-2">
              <button
                onClick={() =>
                  setConfirmDialog({ ...confirmDialog, isOpen: false })
                }
                className="btn btn-sm btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={confirmDialog.action}
                className="btn btn-sm btn-error text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Info/Success Modal */}
      {infoAlert.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            role="alert"
            className="alert shadow-2xl bg-base-100 max-w-sm border border-base-300 transform scale-100 flex-col items-start gap-4"
          >
            <div className="flex items-center gap-3 w-full">
              {infoAlert.type === "success" ? (
                <CheckCircle className="stroke-success h-8 w-8 shrink-0" />
              ) : (
                <AlertCircle className="stroke-error h-8 w-8 shrink-0" />
              )}
              <h3 className="font-bold text-lg capitalize">{infoAlert.type}</h3>
            </div>
            <p className="text-base-content/70">{infoAlert.message}</p>
            <div className="flex justify-end w-full mt-2">
              <button
                onClick={() => setInfoAlert({ ...infoAlert, isOpen: false })}
                className="btn btn-sm btn-primary"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Report Modal */}
      {reportModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-base-100 p-6 rounded-2xl shadow-2xl max-w-md w-full border border-base-300">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Flag className="text-warning" size={24} /> Report Content
            </h3>
            <p className="text-sm text-base-content/70 mb-4">
              Please provide a reason for reporting this {reportModal.type}.
            </p>
            <textarea
              className="textarea textarea-bordered w-full h-24 text-base focus:outline-none focus:border-warning"
              placeholder="e.g. Spam, Harassment, Misinformation..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            ></textarea>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() =>
                  setReportModal({ isOpen: false, type: "", id: null })
                }
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={submitReport}
                className="btn btn-warning"
                disabled={!reportReason.trim()}
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= HERO SECTION ================= */}
      <div
        className="relative h-[50vh] w-full bg-cover bg-center"
        style={{
          backgroundImage: post.imageName
            ? `url("${post.imageName}")`
            : `url("https://images.unsplash.com/photo-1499750310159-525446cc0d27?q=80&w=2070&auto=format&fit=crop")`,
        }}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-500
    ${
      theme === "night"
        ? "from-base-100  via-base-100/30 to-transparent"
        : "from-white via-white/10 to-transparent"
    }`}
        ></div>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
              <div className="flex-1">
                <div className="badge badge-primary mb-4 font-bold">
                  {post.category?.categoryTitle || "General"}
                </div>
                <h1
                  className={`text-4xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg
    ${theme === "night" ? "text-white" : "text-base-content"}
  `}
                >
                  {post.title}
                </h1>
                <div
                  className={`flex flex-wrap items-center gap-6 font-medium
    ${theme === "night" ? "text-white/90" : "text-base-content/70"}
  `}
                >
                  <Link
                    to={authorLink}
                    className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer group"
                  >
                    <div className="avatar placeholder">
                      <div className="bg-neutral text-neutral-content rounded-full w-8 h-8 flex items-center justify-center group-hover:ring group-hover:ring-primary transition-all">
                        <span className="text-xs">
                          {post.user?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <span className="underline decoration-transparent group-hover:decoration-primary underline-offset-4 transition-all">
                      {isOwnPost ? "You" : post.user?.name}
                    </span>
                  </Link>
                  <div className="flex items-center gap-2">
                    <Calendar size={18} />
                    <span>{formattedDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Report Post Button */}
                <button
                  onClick={() => initiateReport("post", post.postId)}
                  className={`btn btn-circle btn-lg border-none shadow-2xl backdrop-blur-md transition-all hover:scale-110
  ${
    theme === "night"
      ? "bg-white/20 hover:bg-white/30 text-white"
      : "bg-base-200 hover:bg-base-300 text-base-content"
  }`}
                  title="Report Post"
                >
                  <Flag size={24} />
                </button>
                {/* Save Button */}
                <button
                  onClick={handleSave}
                  className={`btn btn-circle btn-lg border-none shadow-2xl backdrop-blur-md transition-all hover:scale-110
  ${
    theme === "night"
      ? "bg-white/20 hover:bg-white/30 text-white"
      : "bg-base-200 hover:bg-base-300 text-base-content"
  }`}
                  title={isSaved ? "Unsave" : "Save"}
                >
                  <Bookmark
                    size={28}
                    fill={isSaved ? "currentColor" : "none"}
                  />
                </button>
                {/* Like Button */}
                <button
                  onClick={handleLike}
                  className={`btn btn-circle btn-lg border-none shadow-2xl backdrop-blur-md transition-all hover:scale-110
  ${
    theme === "night"
      ? "bg-white/20 hover:bg-white/30 text-white"
      : "bg-base-200 hover:bg-base-300 text-base-content"
  }`}
                  title={isLiked ? "Unlike" : "Like"}
                >
                  <Heart size={30} fill={isLiked ? "currentColor" : "none"} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= CONTENT & COMMENTS ================= */}
      <div className="max-w-3xl mx-auto px-6 mt-12">
        <div className="flex items-center gap-6 mb-8 text-base-content/60 border-b border-base-200 pb-4">
          <div className="flex items-center gap-2">
            <Heart
              size={20}
              className={isLiked ? "text-red-500" : ""}
              fill={isLiked ? "currentColor" : "none"}
            />
            <span className="font-semibold">{likeCount} Likes</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare size={20} />
            <span className="font-semibold">
              {post.comments?.length || 0} Comments
            </span>
          </div>
        </div>

        <article className="prose prose-lg prose-invert md:prose-xl w-full max-w-none">
          <div className="whitespace-pre-wrap leading-relaxed text-lg text-heading ">
            {post.content}
          </div>
        </article>

        <div className="divider my-12"></div>

        <div className="space-y-8">
          <h3 className="text-2xl font-bold">Discussion</h3>

          {/* Comment Form */}
          {token ? (
            <form
              onSubmit={handleCommentSubmit}
              className="flex gap-4 items-start bg-base-200/50 p-4 rounded-xl"
            >
              <div className="avatar placeholder">
  <div className="
    bg-primary text-primary-content
                          rounded-full w-10 h-10 
                          flex items-center justify-center
                          font-bold text-sm
                          hover:ring hover:ring-primary 
                          transition-all
                          overflow-hidden
  ">
    {user.name.charAt(0).toUpperCase()}
  </div>
</div>

              <div className="flex-1">
                <textarea
                  className="textarea textarea-bordered w-full text-base focus:outline-none focus:border-primary"
                  placeholder="What are your thoughts?"
                  rows="3"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                ></textarea>
                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm rounded-full px-6"
                    disabled={submittingComment || !commentText.trim()}
                  >
                    {submittingComment ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                      <>
                        <Send size={14} /> Post
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="alert bg-base-200 border-none flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <LogIn size={20} />
                <span>Log in to join the conversation.</span>
              </div>
              <Link to="/login" className="btn btn-sm btn-primary">
                Log in
              </Link>
            </div>
          )}

          {/* Comment List */}
          <div className="space-y-6">
            {post.comments && post.comments.length > 0 ? (
              [...post.comments].reverse().map((comment) => {
                const isOwnComment =
                  user && comment.user && user.id === comment.user.id;
                const isAdmin = user?.role === "ADMIN";
                const canDelete = isOwnComment || isAdmin;
                const commentAuthorLink = isOwnComment
                  ? "/profile"
                  : `/author/${comment.user?.id}`;

                return (
                  <div key={comment.id} className="flex gap-4 group">
                    <Link
                      to={commentAuthorLink}
                      className="avatar placeholder cursor-pointer"
                    >
                      <div
                        className="bg-primary text-primary-content
                          rounded-full w-10 h-10 
                          flex items-center justify-center
                          font-bold text-sm
                          hover:ring hover:ring-primary 
                          transition-all
                          overflow-hidden
                        "
                      >
                        {comment.user?.name
                          ? comment.user.name.charAt(0).toUpperCase()
                          : "?"}
                      </div>
                    </Link>

                    <div className="flex-1">
                      <div className="bg-base-200/40 p-4 rounded-2xl rounded-tl-none relative group/bubble">
                        <div className="flex justify-between items-center mb-1">
                          <Link
                            to={commentAuthorLink}
                            className="font-bold text-sm hover:underline cursor-pointer"
                          >
                            {comment.user?.name || "Unknown User"}
                          </Link>

                          <div className="flex gap-1">
                            {/* Report Comment Button (Always visible on hover) */}
                            <button
                              onClick={() =>
                                initiateReport("comment", comment.id)
                              }
                              className="btn btn-ghost btn-xs btn-circle opacity-0 group-hover/bubble:opacity-100 transition-opacity"
                              title="Report"
                            >
                              <Flag size={14} className="text-warning" />
                            </button>

                            {/* Delete Comment Button */}
                            {canDelete && (
                              <button
                                onClick={() => handleDeleteRequest(comment.id)}
                                className="btn btn-ghost btn-xs btn-circle text-error opacity-0 group-hover/bubble:opacity-100 transition-opacity"
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-base-content/80 text-sm leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-base-content/50 italic text-center py-8">
                No comments yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
