import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useThemeStore } from "./store/themeStore";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostPage from "./pages/PostPage";
import ComposePage from "./pages/ComposePage";
import ProfilePage from "./pages/ProfilePage";
import EditPost from "./pages/EditPost";
import PublicProfilePage from "./pages/PublicProfilePage";
import AdminDashboard from "./pages/AdminDashboard";
import ResetPassword from "./pages/ResetPassword";
import About from "./pages/About"

function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-base-200 font-sans">
        <Navbar transparent={true} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post/:postId" element={<PostPage />} />
          <Route path="/write" element={<ComposePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/edit/:postId" element={<EditPost />} />
          <Route path="/author/:userId" element={<PublicProfilePage />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          {/* Admin Route */}
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;