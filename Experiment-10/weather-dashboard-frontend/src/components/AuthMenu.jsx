import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getToken, getUsername, logout } from "../utils/auth";

export default function AuthMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const token = getToken();
  const username = getUsername();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/");
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-11 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 backdrop-blur-md transition-all hover:bg-white/20"
      >
        <span className="material-symbols-outlined text-white">
          {token ? "account_circle" : "login"}
        </span>
        <span className="hidden text-sm font-semibold text-white sm:inline">
          {token ? (username || "Account") : "Sign In"}
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[100]"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-14 z-[101] w-52 rounded-2xl border border-white/30 bg-white/10 backdrop-blur-2xl shadow-2xl">
            {token ? (
              <>
                <div className="border-b border-white/20 px-4 py-3">
                  <p className="text-sm font-semibold text-white">{username || "User"}</p>
                  <p className="text-xs text-white/70">Signed In</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-white transition hover:bg-white/20 rounded-b-2xl"
                >
                  <span className="material-symbols-outlined text-lg">logout</span>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/20 rounded-t-2xl"
                >
                  <span className="material-symbols-outlined text-lg">login</span>
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 border-t border-white/20 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/20 rounded-b-2xl"
                >
                  <span className="material-symbols-outlined text-lg">person_add</span>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
