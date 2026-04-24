import { jwtDecode } from "jwt-decode";

// amazonq-ignore-next-line
const TOKEN_KEY = "token";

// amazonq-ignore-next-line
export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const getUsername = () => {
  const token = getToken();
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.sub || decoded.username || null;
  } catch (err) {
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  // dispatch a custom event for smooth SPA redirect
  window.dispatchEvent(new Event("tokenExpired"));
};

export const isTokenExpired = () => {
  const token = getToken();
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    const expired = decoded.exp < now;
    
    // Auto-clear expired token
    if (expired) {
      localStorage.removeItem(TOKEN_KEY);
    }
    
    return expired;
  } catch (err) {
    console.error("Invalid JWT:", err);
    // Auto-clear invalid token
    localStorage.removeItem(TOKEN_KEY);
    return true;
  }
};

export const startTokenMonitor = () => {
  const token = getToken();
  if (!token) return;
  // amazonq-ignore-next-line
  setInterval(() => {
    if (isTokenExpired()) {
      console.warn("Session expired. Logging out.");
      logout();
    }
  }, 60000);
};
