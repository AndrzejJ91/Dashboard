import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClaient";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false)
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true); // ✅ Set loading indicator

    try {
      
      const response = await apiClient.post("/auth/login", { email, password });

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        navigate("/Dashboard"); 
      } else {
        setError(response.data.message || "Login failed.");
      }

      if (rememberMe) {
        localStorage.setItem("token", response.data.token);
      } else {
        sessionStorage.setItem("token", response.data.token);
      }

    } catch (error: any) {
      setError(error.response?.data?.message || "Login error.");
    } finally {
      setLoading(false); // ✅ Stop loading indicator
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
    <form
      onSubmit={handleLogin}
      className="w-full max-w-md bg-white rounded-xl p-8 shadow-2xl hover:shadow-3xl hover:transition-all duration-300"
    >
      <h2 className="font-bold text-2xl text-center text-gray-800 mb-6">Log In</h2>
  
      {error && <p className="text-red-500 text-center">{error}</p>}
  
      <div className="flex flex-col space-y-4 w-full">
        {/* Email */}
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          className="border border-gray-300 rounded-lg w-full px-4 py-3 text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          required
        />
  
        {/* Password */}
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border border-gray-300 rounded-lg w-full px-4 py-3 text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          required
        />
  
        {/* Remember Me */}
        <div className="flex items-center text-gray-600 text-sm">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
            className="mr-2 w-4 h-4 accent-blue-500"
          />
          Remember Me
        </div>
      </div>
  
      {/* Submit button */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full px-6 py-3 rounded-lg font-bold mt-6 transition-all duration-300 cursor-pointer text-white ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-400 to-blue-600 hover:scale-105"
        }`}
      >
        {loading ? "Logging in..." : "Log In"}
      </button>
    </form>
  </div>
  

  );
};

export default LogIn;
