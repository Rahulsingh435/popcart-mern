import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/button";

function Login() {
  // 🟢 YAHAN DHYAN DIJIYE: 'email' ki jagah ab 'identifier' hai
  const [identifier, setIdentifier] = useState(""); 
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 🟢 YAHAN BHI: Backend ko 'identifier' hi bhejna hai
        body: JSON.stringify({ identifier, password }) 
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        alert(`Welcome back, ${data.user.name}! 🛍️`);
        navigate("/"); 
      } else {
        alert(`Oops! ❌ ${data.message}`);
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Server se connect nahi ho paya!");
    } finally {
      setLoading(false);
    }
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
            <label className="text-sm font-bold text-slate-700 ml-1">Email or Phone Number</label>
            <input 
              type="text" 
              required 
              className="w-full mt-1 px-4 py-3 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="rahul@example.com OR 9876543210"
              // 🟢 YAHAN BHI UPDATE HUA HAI
              onChange={(e) => setIdentifier(e.target.value)}
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
          
          <Button disabled={loading} type="submit" className="w-full py-7 text-lg font-bold bg-blue-600 hover:bg-blue-700 rounded-2xl mt-4 shadow-lg shadow-blue-100 transition-all text-white disabled:bg-blue-400">
            {loading ? "Checking details... ⏳" : "Sign In 🚀"}
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