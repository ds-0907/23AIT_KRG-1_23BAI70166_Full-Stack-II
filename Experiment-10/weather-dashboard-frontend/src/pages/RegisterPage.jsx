import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";

export default function RegisterPage() {
  const navigate = useNavigate();

  const handleRegister = async ({ username, password }) => {
    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const contentType = res.headers.get("content-type");
      let data;
      let errorMessage = "";
      
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
        errorMessage = data.error || data.message || "";
      } else {
        const text = await res.text();
        errorMessage = text;
        data = { error: text };
      }
      
      if (res.ok) {
        // Store token and redirect to dashboard
        if (data.token) {
          localStorage.setItem("token", data.token);
          navigate("/dashboard");
        } else {
          // Auto-login after registration
          const loginRes = await fetch("http://localhost:8080/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
          });
          
          const loginContentType = loginRes.headers.get("content-type");
          let loginData;
          
          if (loginContentType && loginContentType.includes("application/json")) {
            loginData = await loginRes.json();
          } else {
            loginData = {};
          }
          
          if (loginRes.ok && loginData.token) {
            localStorage.setItem("token", loginData.token);
            navigate("/dashboard");
          } else {
            alert("Registration successful! Please login.");
            navigate("/login");
          }
        }
      } else {
        // Show specific error message
        const lowerError = errorMessage.toLowerCase();
        if (res.status === 409 || lowerError.includes("already exists") || lowerError.includes("already registered") || lowerError.includes("already taken")) {
          alert("Username already exists. Please choose a different username.");
        } else {
          alert(errorMessage || "Registration failed. Please try again.");
        }
      }
    } catch (error) {
      alert("Registration failed. Please try again.");
      console.error(error);
    }
  };

  return <AuthForm type="register" onSubmit={handleRegister} />;
}
