import { useState } from "react";
import { Link } from "react-router-dom";

export default function AuthForm({ type, onSubmit }) {
  const [form, setForm] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(form);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <div 
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?q=80&w=1920&auto=format&fit=crop')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/40 via-blue-500/30 to-teal-600/40 backdrop-blur-sm" />
      
      {/* Floating weather icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl opacity-20 animate-pulse">☀️</div>
        <div className="absolute top-40 right-20 text-5xl opacity-15 animate-bounce" style={{animationDuration: '3s'}}>🌤️</div>
        <div className="absolute bottom-32 left-1/4 text-4xl opacity-10">🌈</div>
        <div className="absolute bottom-20 right-1/3 text-5xl opacity-20">☁️</div>
      </div>

      {/* Auth Card */}
      <div className="relative z-10 bg-white/15 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 w-[90%] max-w-md border border-white/30">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-emerald-400 to-teal-500 p-4 rounded-full shadow-lg">
            <span className="text-4xl">{type === "login" ? "🌦️" : "🌤️"}</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-white mb-2 text-center drop-shadow-lg">
          {type === "login" ? "Welcome Back" : "Join Us"}
        </h1>
        <p className="text-white/80 text-center mb-8 text-sm">
          {type === "login" ? "Sign in to check the weather" : "Create your weather dashboard"}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              value={form.username}
              required
              className="w-full rounded-2xl px-5 py-4 bg-white/25 text-white placeholder:text-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all backdrop-blur-xl shadow-lg"
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              value={form.password}
              required
              className="w-full rounded-2xl px-5 py-4 bg-white/25 text-white placeholder:text-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all backdrop-blur-xl shadow-lg"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition-all text-white font-bold py-4 mt-2 shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
          >
            {type === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        {/* Redirect Link */}
        <div className="mt-6 text-center">
          <p className="text-white/90 text-sm">
            {type === "login" ? "Don't have an account?" : "Already have an account?"}
            {" "}
            <Link 
              to={type === "login" ? "/register" : "/login"}
              className="text-emerald-300 hover:text-emerald-200 font-semibold underline decoration-2 underline-offset-2 transition-colors"
            >
              {type === "login" ? "Sign Up" : "Sign In"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
