import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = async ({ username, password }) => {
    
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const contentType = res.headers.get("content-type");
      
      let data;
      
      if (contentType && contentType.includes("application/json")) {
        
        data = await res.json();
      } else {
        const text = await res.text();
        data = { error: text };
      }

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        const errorMsg = String(data.error || "Invalid credentials").replace(/<[^>]*>/g, '');
        alert(errorMsg);
      }
    } catch (error) {
      alert("Login failed. Please try again.");
      console.error(error);
    }
  };

  return <AuthForm type="login" onSubmit={handleLogin} />;
}
