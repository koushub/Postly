import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";
import { Shield, Github, Mail, Info, Menu } from "lucide-react";

const Navbar = ({ transparent }) => {
  const { token, user, logout } = useAuthStore();
  const { toggleTheme, theme } = useThemeStore();

  const navbarClasses = transparent
    ? "navbar absolute top-0 z-50 bg-black/20 backdrop-blur-sm text-white border-b border-white/10"
    : "navbar bg-base-100 shadow-md text-base-content sticky top-0 z-50";

  const navLinks = (
    <>
      <a
        href="https://github.com/koushub/Postly"
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-ghost btn-sm gap-2 normal-case font-normal text-lg"
      >
        <Github size={16} /> GitHub
      </a>

      <a
        href="mailto:koushubhy2k@gmail.com"
        className="btn btn-ghost btn-sm gap-2 normal-case font-normal text-lg"
      >
        <Mail size={16} /> Contact
      </a>

      <Link
        to="/about"
        className="btn btn-ghost btn-sm gap-2 normal-case font-normal text-lg"
      >
        <Info size={16} /> About
      </Link>

      {token && user?.role === "ADMIN" && (
        <Link to="/admin" className="btn btn-sm btn-warning btn-outline gap-2 text-lg">
          <Shield size={16} /> Admin
        </Link>
      )}
    </>
  );

  return (
    <div className={navbarClasses}>
      {/* Left */}
      <div className="flex-1 flex items-center gap-4">
        <Link
          to="/"
          className="btn btn-ghost text-xl font-bold uppercase tracking-wider"
        >
          Postly
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">{navLinks}</div>
      </div>

      {/* Right Section */}
      <div className="flex-none flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`btn btn-circle btn-base border-none transition-colors ${
            transparent
              ? "bg-white/20 hover:bg-white/30 text-white"
              : "bg-base-200 hover:bg-base-300 text-base-content"
          }`}
          title="Toggle Theme"
        >
          {theme === "night" ? "🌙" : "☀️"}
        </button>

        {/* Auth Buttons Desktop */}
        <div className="hidden md:flex items-center gap-3 mr-12">
          {!token ? (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm text-lg font-bold">
                Log in
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm text-lg font-bold">
                Sign Up
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3  mx-6">
              <button
                onClick={logout}
                className={`cursor-pointer px-4 py-1.5 rounded-lg font-semibold text-sm md:text-base transition-all
    ${
      transparent
        ? "bg-white text-black hover:bg-white/90"
        : "bg-base-200 text-base-content hover:bg-base-300"
    }`}
              >
                Logout
              </button>

              <Link to="/profile" className="avatar placeholder">
                <div className="bg-neutral text-neutral-content rounded-full w-11 h-11 flex items-center justify-center font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-circle btn-ghost">
            <Menu size={22} />
          </label>

          <ul
            tabIndex={0}
            className="dropdown-content menu p-3 shadow bg-base-100 rounded-box w-52 mt-2"
          >
            {/* Nav Links */}
            <li>{navLinks}</li>

            <div className="divider my-2"></div>

            {/* Auth Links */}
            {!token ? (
              <>
                <li>
                  <Link to="/login">Log in</Link>
                </li>
                <li>
                  <Link to="/register">Sign Up</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/profile">Profile ({user?.name})</Link>
                </li>
                <li>
                  <button onClick={logout}>Logout</button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
