import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Lock, CheckCircle, AlertCircle } from "lucide-react";

const ResetPassword = () => {
  const { token } = useParams(); // Grab the token from the URL
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" }); // type: 'success' | 'error'
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    // 1. Basic Validation
    if (password !== confirmPassword) {
        setStatus({ type: "error", message: "Passwords do not match." });
        return;
    }
    if (password.length < 6) {
        setStatus({ type: "error", message: "Password must be at least 6 characters." });
        return;
    }

    setLoading(true);

    try {
      // 2. Call Node.js Backend (Port 3000)
      // Ensure this matches your Node server route
      await axios.post("http://localhost:3000/reset-password", {
        token: token,
        newPassword: password,
      });

      // 3. Success Handling
      setStatus({ type: "success", message: "Password reset successfully! Redirecting..." });
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (error) {
      // 4. Error Handling
      const errorMsg = error.response?.data?.message || "Invalid or expired token.";
      setStatus({ type: "error", message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          
          <div className="flex flex-col items-center gap-2 mb-6">
            <div className="bg-primary/10 p-4 rounded-full text-primary">
                <Lock size={32} />
            </div>
            <h2 className="text-2xl font-bold text-center">Set New Password</h2>
            <p className="text-center text-base-content/60 text-sm">
                Please create a strong password for your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* New Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">New Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered w-full focus:input-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Confirm Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className={`input input-bordered w-full ${password && confirmPassword && password !== confirmPassword ? "input-error" : ""}`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {/* Status Messages */}
            {status.message && (
                <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-error'} text-sm py-2 mt-2`}>
                    {status.type === 'success' ? <CheckCircle size={18}/> : <AlertCircle size={18}/>}
                    <span>{status.message}</span>
                </div>
            )}

            {/* Submit Button */}
            <button 
                className="btn btn-primary w-full mt-4" 
                disabled={loading || status.type === 'success'}
            >
              {loading ? <span className="loading loading-spinner"></span> : "Reset Password"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;