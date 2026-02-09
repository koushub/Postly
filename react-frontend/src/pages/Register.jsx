import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "../services/authService";
import { useAuthStore } from "../store/authStore";


export default function Register() {
  
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    about: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    try {
      await registerUser(form);

      const data = await loginUser(form.email, form.password);

      login(data);

      navigate("/");
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Registration failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <form
        onSubmit={handleSubmit}
        className="card p-8 bg-base-100 shadow-xl w-96 relative"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        <input
          className="input input-bordered w-full mb-3"
          placeholder="Name"
          disabled={loading}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="input input-bordered w-full mb-3"
          placeholder="Email"
          disabled={loading}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="input input-bordered w-full mb-3"
          type="password"
          placeholder="Password"
          disabled={loading}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <textarea
          className="textarea textarea-bordered w-full mb-6"
          placeholder="About (Optional)"
          rows="2"
          disabled={loading}
          onChange={(e) => setForm({ ...form, about: e.target.value })}
        ></textarea>

        {}
        {errorMessage && (
          <div
            role="alert"
            className="alert alert-error alert-vertical sm:alert-horizontal mb-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current h-6 w-6 shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"
              />
            </svg>

            <span>{errorMessage}</span>
          </div>
        )}

        {}
        <button className="btn btn-primary w-full mb-4" disabled={loading}>
          {loading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            "Create Account"
          )}
        </button>

        <div className="text-center text-sm">
          <span className="text-base-content/70">
            Already have an account?{" "}
          </span>
          <Link
            to="/login"
            className="link link-primary font-semibold no-underline hover:underline"
          >
            Log in
          </Link>
        </div>
      </form>
    </div>
  );
}
