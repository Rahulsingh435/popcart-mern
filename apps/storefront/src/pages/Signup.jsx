import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/button";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); // 📱 NAYA State
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    
    // Strict Frontend Validation
    if(phone.length !== 10) {
      alert("❌ Phone number must be exactly 10 digits!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }) // phone add kiya
      });

      const data = await response.json();

      if (data.success) {
        alert("Account Created Successfully! 🎉 Now please Login.");
        navigate("/login");
      } else {
        alert(`Oops! ❌ ${data.message}`);
      }
    } catch (error) {
      console.error("Signup Error:", error);
      alert("Server se connect nahi ho paya!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-10">
      <div className="max-w-md w-full bg-white p-8 rounded-[32px] shadow-xl border border-slate-100">
        <div className="text-center mb-8">
          <span className="text-4xl">✨</span>
          <h1 className="text-3xl font-black mt-4 text-slate-900">Join PopCart</h1>
          <p className="text-slate-500">Create an account to start shopping</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
            <input type="text" required placeholder="Rahul Kumar" onChange={(e) => setName(e.target.value)} className="w-full mt-1 px-4 py-3 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
            <input type="email" required placeholder="rahul@example.com" onChange={(e) => setEmail(e.target.value)} className="w-full mt-1 px-4 py-3 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          {/* 📱 NAYA PHONE KA DABBA */}
          <div>
            <label className="text-sm font-bold text-slate-700 ml-1">Phone Number (+91)</label>
            <input type="number" required placeholder="9876543210" onChange={(e) => setPhone(e.target.value)} className="w-full mt-1 px-4 py-3 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
            <input type="password" required placeholder="Create a strong password" onChange={(e) => setPassword(e.target.value)} className="w-full mt-1 px-4 py-3 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          
          <Button disabled={loading} type="submit" className="w-full py-7 text-lg font-bold bg-blue-600 hover:bg-blue-700 rounded-2xl mt-6 text-white disabled:bg-blue-400">
            {loading ? "Creating Account... ⏳" : "Create Account 🚀"}
          </Button>
        </form>

        <p className="text-center mt-8 text-slate-600 font-medium">
          Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;