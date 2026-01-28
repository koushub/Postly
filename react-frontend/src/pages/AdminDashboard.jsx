import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuthStore } from "../store/authStore";
import {
  Shield,
  Users,
  FileText,
  AlertTriangle,
  Trash2,
  CheckCircle,
  Plus,
  BarChart3,
  MessageSquare,
  ExternalLink,
  AlertCircle,
} from "lucide-react";

const AdminDashboard = () => {
  const { user, token } = useAuthStore();
  const navigate = useNavigate();

  // Stats & Data State
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalReports: 0,
  });
  const [activeTab, setActiveTab] = useState("reports");

  // Lists
  const [reports, setReports] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [postsList, setPostsList] = useState([]);
  const [commentsList, setCommentsList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Category Form
  const [newCategoryTitle, setNewCategoryTitle] = useState("");
  const [newCategoryDesc, setNewCategoryDesc] = useState("");

  // --- CUSTOM MODAL STATES ---
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    action: null, // The function to run if confirmed
    confirmBtnClass: "btn-error", // Optional: to change button color
  });

  const [infoAlert, setInfoAlert] = useState({
    isOpen: false,
    type: "error", // 'error' or 'success'
    message: "",
  });

  // 1. Initial Check & Stats
  useEffect(() => {
    if (!token || !user) {
      navigate("/login");
      return;
    }
    if (user.role !== "ADMIN") {
      setInfoAlert({
        isOpen: true,
        type: "error",
        message: "Unauthorized Access",
      });
      navigate("/");
      return;
    }

    fetchStats();
    if (activeTab === "reports") fetchReports();
  }, [token, user, navigate]);

  // Tab Switcher Logic
  useEffect(() => {
    if (activeTab === "reports") fetchReports();
    if (activeTab === "categories") fetchCategories();
    if (activeTab === "users") fetchUsers();
    if (activeTab === "posts") fetchPosts();
    if (activeTab === "comments") fetchComments();
  }, [activeTab]);

  // --- API CALLS ---
  const fetchStats = async () => {
    try {
      const res = await api.get("/dashboard/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Stats error", err);
    }
  };
  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.get("/reports");
      setReports(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get("/Category");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const activeRes = await api.get("/USER");
      const bannedRes = await api.get("/USER/banned");

      // Merge and mark banned flag
      const activeUsers = activeRes.data.map((u) => ({ ...u, banned: false }));
      const bannedUsers = bannedRes.data.map((u) => ({ ...u, banned: true }));

      setUsersList([...activeUsers, ...bannedUsers]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const banUser = async (id) => {
  try {
    await api.delete(`/USER/${id}`); 
    fetchUsers();
    fetchStats();
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    setInfoAlert({
      isOpen: true,
      type: "success",
      message: "User banned successfully.",
    });
  } catch (err) {
    setInfoAlert({
      isOpen: true,
      type: "error",
      message: "Failed to ban user.",
    });
  }
};

const unbanUser = async (id) => {
  try {
    await api.put(`/USER/${id}/restore`);
    fetchUsers();
    fetchStats();
    setConfirmDialog({ ...confirmDialog, isOpen: false });
    setInfoAlert({
      isOpen: true,
      type: "success",
      message: "User unbanned successfully.",
    });
  } catch (err) {
    setInfoAlert({
      isOpen: true,
      type: "error",
      message: "Failed to unban user.",
    });
  }
};


  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/POST");
      const content = res.data.content || res.data || [];
      setPostsList(content);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await api.get("/comments/all");
      const content = res.data.content || res.data || [];
      setCommentsList(content);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- CONFIRMATION HANDLERS ---

  // 1. Generic Delete Handler
  const confirmDeleteEntity = (type, id) => {
    setConfirmDialog({
      isOpen: true,
      title: `Delete ${type}?`,
      message: `Are you sure you want to permanently delete this ${type}? This action cannot be undone.`,
      confirmBtnClass: "btn-error",
      action: () => performDeleteEntity(type, id),
    });
  };

  const performDeleteEntity = async (type, id) => {
    try {
      if (type === "post") {
        await api.delete(`/POST/${id}`);
        setPostsList(postsList.filter((p) => p.postId !== id));
      } else if (type === "comment") {
        await api.delete(`/comments/${id}`);
        setCommentsList(commentsList.filter((c) => c.id !== id));
      } else if (type === "user") {
        await api.delete(`/USER/${id}`);
        setUsersList(usersList.filter((u) => u.id !== id));
      } else if (type === "category") {
        await api.delete(`/Category/${id}`);
        setCategories(
          categories.filter((c) => c.categoryId !== id && c.id !== id),
        );
      }
      fetchStats();
      setConfirmDialog({ ...confirmDialog, isOpen: false });
      setInfoAlert({
        isOpen: true,
        type: "success",
        message: `${type} deleted successfully.`,
      });
    } catch (err) {
      console.error(err);
      setConfirmDialog({ ...confirmDialog, isOpen: false });
      setInfoAlert({
        isOpen: true,
        type: "error",
        message: `Failed to delete ${type}.`,
      });
    }
  };

  const confirmBanUser = (id) => {
  setConfirmDialog({
    isOpen: true,
    title: "Ban User",
    message: "This user will be banned and unable to log in.",
    confirmBtnClass: "btn-error",
    action: () => banUser(id),
  });
};

const confirmUnbanUser = (id) => {
  setConfirmDialog({
    isOpen: true,
    title: "Unban User",
    message: "This user will regain access to the platform.",
    confirmBtnClass: "btn-success",
    action: () => unbanUser(id),
  });
};


  // 2. Dismiss Report Handler
  const confirmDismissReport = (reportId) => {
    setConfirmDialog({
      isOpen: true,
      title: "Dismiss Report",
      message: "Are you sure you want to dismiss this report?",
      confirmBtnClass: "btn-success",
      action: async () => {
        try {
          await api.delete(`/report/${reportId}`);
          setReports(reports.filter((r) => r.id !== reportId));
          setConfirmDialog({ ...confirmDialog, isOpen: false });
        } catch (err) {
          setInfoAlert({
            isOpen: true,
            type: "error",
            message: "Failed to dismiss report.",
          });
        }
      },
    });
  };

  // 3. Delete Report Target Handler
  const confirmDeleteReportTarget = (report) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Reported Content",
      message:
        "This will permanently delete the reported content (Post/Comment/User) and close the report.",
      confirmBtnClass: "btn-error",
      action: async () => {
        try {
          if (report.postId && !report.commentId)
            await api.delete(`/POST/${report.postId}`);
          else if (report.commentId)
            await api.delete(`/comments/${report.commentId}`);
          else if (report.reportedUserId)
            await api.delete(`/USER/${report.reportedUserId}`);

          // Cleanup report
          await api.delete(`/report/${report.id}`);
          setReports(reports.filter((r) => r.id !== report.id));
          fetchStats();
          setConfirmDialog({ ...confirmDialog, isOpen: false });
          setInfoAlert({
            isOpen: true,
            type: "success",
            message: "Target deleted and report closed.",
          });
        } catch (err) {
          setInfoAlert({
            isOpen: true,
            type: "error",
            message: "Action failed.",
          });
        }
      },
    });
  };

  // 4. Add Category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryTitle.trim()) return;
    try {
      const res = await api.post("/Category", {
        categoryTitle: newCategoryTitle,
        categoryDescription: newCategoryDesc,
      });
      setCategories([...categories, res.data]);
      setNewCategoryTitle("");
      setNewCategoryDesc("");
      setInfoAlert({
        isOpen: true,
        type: "success",
        message: "Category created.",
      });
    } catch (err) {
      setInfoAlert({
        isOpen: true,
        type: "error",
        message: "Failed to add category.",
      });
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-10 px-4 max-w-7xl mx-auto relative">
      {/* ================= MODALS ================= */}

      {/* 1. Confirmation Modal */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            role="alert"
            className="alert shadow-2xl bg-base-100 max-w-sm border border-base-300 transform scale-100 flex-col items-start gap-4"
          >
            <div className="flex items-center gap-3 w-full">
              <AlertTriangle className="stroke-warning h-8 w-8 shrink-0" />
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
                className={`btn btn-sm text-white ${confirmDialog.confirmBtnClass}`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Info/Error Modal */}
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

      {/* ================= DASHBOARD CONTENT ================= */}

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Shield size={32} className="text-primary" />
        <h1 className="text-3xl font-extrabold">Admin Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="stats shadow bg-base-100 border border-base-200">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <Users size={32} />
            </div>
            <div className="stat-title text-lg text-heading">Total Users</div>
            <div className="stat-value text-secondary">
              {stats.totalUsers || 0}
            </div>
          </div>
        </div>
        <div className="stats shadow bg-base-100 border border-base-200">
          <div className="stat">
            <div className="stat-figure text-primary">
              <FileText size={32} />
            </div>
            <div className="stat-title text-lg text-heading">Total Posts</div>
            <div className="stat-value text-primary">
              {stats.totalPosts || 0}
            </div>
          </div>
        </div>
        <div className="stats shadow bg-base-100 border border-base-200">
          <div className="stat">
            <div className="stat-figure text-error">
              <AlertTriangle size={32} />
            </div>
            <div className="stat-title text-lg text-heading">Reports</div>
            <div className="stat-value text-error">
              {stats.totalReports || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed bg-base-100 p-2 mb-6 shadow-sm overflow-x-auto">
        <a
          className={`tab tab-lg text-lg text-heading ${activeTab === "reports" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("reports")}
        >
          Reports
        </a>
        <a
          className={`tab tab-lg text-lg text-heading ${activeTab === "users" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          Users
        </a>
        <a
          className={`tab tab-lg text-lg text-heading ${activeTab === "posts" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("posts")}
        >
          Posts
        </a>
        <a
          className={`tab tab-lg text-lg text-heading ${activeTab === "comments" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("comments")}
        >
          Comments
        </a>
        <a
          className={`tab tab-lg text-lg text-heading ${activeTab === "categories" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("categories")}
        >
          Categories
        </a>
      </div>

      {/* Content Container */}
      <div className="bg-base-100 shadow-xl rounded-2xl border border-base-200 min-h-[400px] p-6">
        {loading && (
          <div className="flex justify-center p-10">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}

        {/* === REPORTS === */}
        {!loading && activeTab === "reports" && (
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <AlertTriangle size={20} /> Reports
            </h2>
            {reports.length === 0 ? (
              <p className="opacity-50 text-lg text-heading">
                No active reports.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Reason</th>
                      <th>Reporter</th>
                      <th>Preview</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((r) => (
                      <tr key={r.id}>
                        <td>
                          {r.commentId ? "Comment" : r.postId ? "Post" : "User"}
                        </td>
                        <td className="text-error font-semibold">{r.reason}</td>
                        <td>{r.reporterName}</td>
                        <td className="max-w-xs truncate">
                          {r.contentPreview}
                        </td>
                        <td className="flex gap-2">
                          {r.postId && !r.commentId && (
                            <Link
                              to={`/post/${r.postId}`}
                              target="_blank"
                              className="btn btn-xs btn-ghost"
                            >
                              <ExternalLink size={12} />
                            </Link>
                          )}
                          <button
                            onClick={() => confirmDeleteReportTarget(r)}
                            className="btn btn-xs btn-error text-white"
                          >
                            Delete Target
                          </button>
                          <button
                            onClick={() => confirmDismissReport(r.id)}
                            className="btn btn-xs btn-success text-white"
                          >
                            Dismiss
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

        {/* === POSTS MANAGEMENT === */}
        {!loading && activeTab === "posts" && (
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FileText size={20} /> Manage Posts
            </h2>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th className="text-lg text-heading">ID</th>
                    <th className="text-lg text-heading">Title</th>
                    <th className="text-lg text-heading">Author</th>
                    <th className="text-lg text-heading">Category</th>
                    <th className="text-lg text-heading">Date</th>
                    <th className="text-lg text-heading">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {postsList.map((post) => (
                    <tr key={post.postId}>
                      <td className="opacity-50 text-lg text-heading">{post.postId}</td>
                      <td className="font-bold max-w-xs truncate text-lg text-heading">
                        {post.title}
                      </td>
                      <td>
                        <div className="flex items-center gap-2 text-base text-heading">
                          <div className="avatar placeholder">
                            <div
                              className="
                                  bg-primary text-primary-content
                                  rounded-full w-10 h-10 
                                  flex items-center justify-center
                                  font-bold text-sm
                                  hover:ring hover:ring-primary 
                                  transition-all
                                  overflow-hidden"
                            >
                              <span>{post.user?.name?.[0]}</span>
                            </div>
                          </div>
                          {post.user?.name}
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-lg badge-outline text-base text-heading">
                          {post.category?.categoryTitle}
                        </span>
                      </td>
                      <td className="text-lg text-heading">
                        {new Date(post.uploadDate).toLocaleDateString()}
                      </td>
                      <td className="flex gap-2">
                        <Link
                          to={`/post/${post.postId}`}
                          target="_blank"
                          className="btn btn-xs btn-ghost text-base text-heading"
                        >
                          View
                        </Link>
                        <button
                          onClick={() =>
                            confirmDeleteEntity("post", post.postId)
                          }
                          className="btn btn-xs btn-error text-white "
                        >
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* === COMMENTS MANAGEMENT === */}
        {!loading && activeTab === "comments" && (
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <MessageSquare size={20} /> Manage Comments
            </h2>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th className="text-lg text-heading">ID</th>
                    <th className="text-lg text-heading">Content (Preview)</th>
                    <th className="text-lg text-heading">Author</th>
                    <th className="text-lg text-heading">Post Context</th>
                    <th className="text-lg text-heading">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {commentsList.map((comment) => (
                    <tr key={comment.id}>
                      <td className="opacity-50 text-lg text-heading">{comment.id}</td>
                      <td className="max-w-md">
                        <p className="line-clamp-1 text-lg text-heading">{comment.content}</p>
                      </td>
                      <td>
                        <span className="font-semibold text-lg text-heading">
                          {comment.user?.name || "Unknown"}
                        </span>
                      </td>
                      <td>
                        {comment.postId ? (
                          <Link
                            to={`/post/${comment.postId}`}
                            target="_blank"
                            className="link link-primary font-bold text-lg text-heading flex items-center gap-1 max-w-[200px] truncate"
                            title={comment.postTitle || "View Post"}
                          >
                            {comment.postTitle || "View Post"}{" "}
                            <ExternalLink size={10} className="shrink-0" />
                          </Link>
                        ) : (
                          <span className="opacity-50 text-base italic">
                            Orphaned
                          </span>
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() =>
                            confirmDeleteEntity("comment", comment.id)
                          }
                          className="btn btn-base btn-square btn-error text-white"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {commentsList.length === 0 && (
                <div className="text-center py-10 opacity-50">
                  No comments found.
                </div>
              )}
            </div>
          </div>
        )}

        {/* === USERS MANAGEMENT === */}
        {!loading && activeTab === "users" && (
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Users size={20} /> Manage Users
            </h2>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th className="text-lg text-heading">ID</th>
                    <th className="text-lg text-heading">User</th>
                    <th className="text-lg text-heading">Email</th>
                    <th className="text-lg text-heading">Role</th>
                    <th className="text-lg text-heading">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((u) => (
                    <tr key={u.id}>
                      <td className="opacity-50 text-lg text-heading">{u.id}</td>
                      <td className="font-bold text-lg text-heading">{u.name}</td>
                      <td className="text-lg text-heading">{u.email}</td>
                      <td>
                        {u.role === "ADMIN" ? (
                          <span className="badge badge-primary text-lg text-heading">ADMIN</span>
                        ) : (
                          <span className="badge badge-ghost text-lg text-heading">USER</span>
                        )}
                      </td>
                      <td>
                        {u.banned ? (
                          <button
                            onClick={() => confirmUnbanUser(u.id)}
                            className="btn btn-base btn-success btn-outline"
                          >
                            Unban
                          </button>
                        ) : (
                          <button
                            onClick={() => confirmBanUser(u.id)}
                            className="btn btn-base btn-error btn-outline"
                            disabled={u.id === user.id}
                          >
                            Ban
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* === CATEGORIES === */}
        {!loading && activeTab === "categories" && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <BarChart3 size={20} /> Manage Categories
            </h2>
            <form
              onSubmit={handleAddCategory}
              className="flex gap-4 items-end mb-10 bg-base-200/50 p-4 rounded-xl"
            >
              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text font-bold">New Category</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Technology"
                  className="input input-bordered w-full text-base text-heading"
                  value={newCategoryTitle}
                  onChange={(e) => setNewCategoryTitle(e.target.value)}
                />
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-bold">Description</span>
                </label>
                <input
                  type="text"
                  placeholder="Short description..."
                  className="input input-bordered w-full text-base text-heading"
                  value={newCategoryDesc}
                  onChange={(e) => setNewCategoryDesc(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                <Plus size={18} /> Add
              </button>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((cat) => (
                <div
                  key={cat.categoryId || cat.id}
                  className="alert bg-base-100 shadow-sm border border-base-200"
                >
                  <div>
                    <h3 className="font-bold text-lg text-heading">{cat.categoryTitle}</h3>
                    <div className="opacity-60 text-base text-heading">
                      {cat.categoryDescription}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      confirmDeleteEntity("category", cat.categoryId || cat.id)
                    }
                    className="btn btn-sm btn-circle btn-ghost text-error"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
