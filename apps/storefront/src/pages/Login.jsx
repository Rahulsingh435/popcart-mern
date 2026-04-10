import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/button";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Dummy login: Browser ki memory mein user ko save kar rahe hain
    localStorage.setItem("user", JSON.stringify({ email, name: email.split('@')[0] }));
    alert("Login Successful! Welcome to PopCart 🛍️");
    navigate("/"); // Login hote hi Home page par bhej dega
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-[32px] shadow-xl border border-slate-100">
        <div className="text-center mb-8">
          <span className="text-4xl">🔐</span>
          <h1 className="text-3xl font-black mt-4 text-slate-900">Welcome Back</h1>
          <p className="text-slate-500 font-medium">Please enter your details</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
            <input 
              type="email" 
              required 
              className="w-full mt-1 px-4 py-3 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="rahul@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
            <input 
              type="password" 
              required 
              className="w-full mt-1 px-4 py-3 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <Button type="submit" className="w-full py-7 text-lg font-bold bg-blue-600 hover:bg-blue-700 rounded-2xl mt-4 shadow-lg shadow-blue-100 transition-all active:scale-95 text-white">
            Sign In 🚀
          </Button>
        </form>

        <p className="text-center mt-8 text-slate-600 font-medium">
          Don't have an account? <Link to="/signup" className="text-blue-600 font-bold hover:underline">Create Account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
