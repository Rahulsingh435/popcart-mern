import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
// 🟢 Ye rahi wo line jo Signup ko import karti hai
import Signup from './pages/Signup'; 

function App() {
  return (
    <Router>
      <Routes>
        {/* Saare products wala main page */}
        <Route path="/" element={<Home />} />
        
        {/* Admin dashboard jahan se product add karte hain */}
        <Route path="/admin" element={<Admin />} />
        
        {/* Product ki details dekhne ke liye */}
        <Route path="/product/:id" element={<ProductDetails />} />

        {/* 🔐 Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;