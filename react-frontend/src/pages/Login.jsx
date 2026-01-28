import { useState } from "react";
import { Link } from "react-router-dom"; 
import { loginUser } from "../services/authService";
import { useAuthStore } from "../store/authStore";
import axios from "axios";

export default function Login() {
  const login = useAuthStore((state) => state.login);

  // Toggle state
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  // Form states
  const [form, setForm] = useState({ email: "", password: "" });
  const [resetEmail, setResetEmail] = useState("");

  // UI states
  const [message, setMessage] = useState("");
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);

  // --- LOGIN HANDLER ---
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoadingLogin(true);

    try {
      const data = await loginUser(form.email, form.password);
      login(data);
      window.location.href = "/";
    } catch (error) {
      alert("Invalid credentials");
    } finally {
      setLoadingLogin(false);
    }
  };

  // --- FORGOT PASSWORD HANDLER ---
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setLoadingReset(true);
    setMessage("");

    try {
      await axios.post("http://localhost:3000/forgot-password", {
        email: resetEmail
      });
      setMessage("✅ Reset link sent! Check your email.");
    } catch (error) {
      setMessage("❌ Error: User not found or server issue.");
    } finally {
      setLoadingReset(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div className="card p-8 bg-base-100 shadow-xl w-96 transition-all duration-300">

        <h2 className="text-2xl font-bold mb-6 text-center">
          {isForgotPassword ? "Reset Password" : "Login"}
        </h2>

        {!isForgotPassword ? (

          /* ================= LOGIN FORM ================= */
          <form onSubmit={handleLoginSubmit}>
            <input
              className="input input-bordered w-full mb-3"
              placeholder="Email"
              disabled={loadingLogin}
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              className="input input-bordered w-full mb-1"
              type="password"
              placeholder="Password"
              disabled={loadingLogin}
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            {/* Forgot Password */}
            <div className="text-right mb-6">
              <button
                type="button"
                disabled={loadingLogin}
                onClick={() => {
                  setIsForgotPassword(true);
                  setMessage("");
                }}
                className="text-xs text-primary hover:underline bg-transparent border-none cursor-pointer p-0"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button with Spinner */}
            <button
              className="btn btn-primary w-full mb-4"
              disabled={loadingLogin}
            >
              {loadingLogin ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Login"
              )}
            </button>

            <div className="text-center text-sm">
              <span className="text-base-content/70">
                Don't have an account?{" "}
              </span>
              <Link
                to="/register"
                className="link link-primary font-semibold no-underline hover:underline"
              >
                Sign up
              </Link>
            </div>
          </form>

        ) : (

          /* ================= FORGOT PASSWORD FORM ================= */
          <form onSubmit={handleForgotSubmit}>
            <p className="text-sm text-base-content/70 text-center mb-4">
              Enter your email address and we'll send you a reset link.
            </p>

            <input
              className="input input-bordered w-full mb-4"
              placeholder="Enter your email"
              type="email"
              required
              disabled={loadingReset}
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />

            {message && (
              <div className={`alert ${
                message.includes("Error") ? "alert-error" : "alert-success"
              } p-2 text-sm mb-4`}>
                {message}
              </div>
            )}

            <button
              className="btn btn-primary w-full mb-2"
              disabled={loadingReset}
            >
              {loadingReset ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Send Reset Link"
              )}
            </button>

            <button
              type="button"
              disabled={loadingReset}
              onClick={() => {
                setIsForgotPassword(false);
                setMessage("");
              }}
              className="btn btn-ghost w-full"
            >
              Back to Login
            </button>
          </form>

        )}

      </div>
    </div>
  );
}
