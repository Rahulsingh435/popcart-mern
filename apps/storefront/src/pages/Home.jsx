import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../components/ui/sheet";
import { Search } from "lucide-react";

function Home() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // 🛒 NAYA: Cart ko LocalStorage se load kar rahe hain
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('popcart_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // 👤 NAYA: User data nikal rahe hain
  const userData = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch('https://popcart-mern.onrender.com/api/products')
      .then((res) => res.json())
      .then((data) => { if (data.success) setProducts(data.data); })
      .catch((err) => console.error(err));
  }, []);

  // 💾 NAYA: Jab bhi cart badle, use save karo
  useEffect(() => {
    localStorage.setItem('popcart_cart', JSON.stringify(cart));
  }, [cart]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || 
                            product.description.toLowerCase().includes(selectedCategory.toLowerCase()) ||
                            product.name.toLowerCase().includes(selectedCategory.toLowerCase());
    
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);
      if (existingItem) {
        return prevCart.map((item) => 
          item._id === product._id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prevCart, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== id));
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload(); // Refresh to update UI
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.qty), 0);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* 🌟 Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-3xl">🛍️</span>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 hidden sm:block">PopCart</h1>
          </div>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3">
            {/* 🆕 NAYA: User Login Status */}
            {userData ? (
              <div className="flex items-center gap-2 md:gap-4">
                <span className="text-sm font-bold text-blue-600 hidden md:block">Hi, {userData.name.split(' ')[0]}! 👋</span>
                <Button variant="ghost" className="text-xs text-red-500 hover:text-red-700 h-8 px-2" onClick={handleLogout}>Logout</Button>
              </div>
            ) : (
              <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition">Login</Link>
            )}

            <Link to="/admin" className="text-sm font-medium text-slate-500 hover:text-slate-900 hidden md:block">Admin</Link>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button className="font-bold bg-blue-600 relative h-10 text-white">
                  Cart 🛒 
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full border-2 border-white">
                      {cart.length}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader><SheetTitle>Your Cart 🛒</SheetTitle></SheetHeader>
                <div className="mt-8 space-y-4">
                  {cart.map((item) => (
                    <div key={item._id} className="flex justify-between items-center border-b pb-2">
                      <div className="text-sm">
                        <p className="font-bold">{item.name}</p>
                        <p>₹{item.price} x {item.qty}</p>
                      </div>
                      <Button variant="destructive" size="sm" onClick={() => removeFromCart(item._id)}>Remove</Button>
                    </div>
                  ))}
                  {cart.length === 0 && <p className="text-center text-slate-500 mt-10">Empty cart!</p>}
                  {cart.length > 0 && (
                    <div className="pt-4 border-t">
                      <p className="text-xl font-black mb-4 text-right text-blue-600">Total: ₹{cartTotal.toLocaleString('en-IN')}</p>
                      <Button className="w-full bg-green-600 font-bold py-6 text-white hover:bg-green-700">Checkout 💳</Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* 🏷️ Category Filters */}
      <div className="bg-white border-b border-slate-100 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex gap-2 overflow-x-auto no-scrollbar">
          {["All", "Laptop", "Watch", "Mobile", "Accessories"].map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "secondary"}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-6 transition-all ${selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            {selectedCategory !== "All" ? `${selectedCategory}s` : "Everything"} For You
          </h2>
          <p className="text-sm text-slate-500">{filteredProducts.length} items showing</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product._id} className="flex flex-col border-slate-200 hover:shadow-xl transition group overflow-hidden">
              <Link to={`/product/${product._id}`} className="cursor-pointer">
                <div className="h-64 bg-white p-6 flex items-center justify-center">
                  <img src={product.imageUrl} alt={product.name} className="max-h-full object-contain group-hover:scale-105 transition duration-500" />
                </div>
              </Link>

              <CardHeader className="p-4 flex-grow">
                <Link to={`/product/${product._id}`} className="hover:text-blue-600">
                  <CardTitle className="text-lg font-bold line-clamp-1 transition">{product.name}</CardTitle>
                </Link>
                <p className="text-sm text-slate-500 line-clamp-2">{product.description}</p>
              </CardHeader>

              <CardContent className="p-4 pt-0">
                <h2 className="text-2xl font-black text-slate-900">₹{product.price.toLocaleString('en-IN')}</h2>
              </CardContent>

              <CardFooter className="p-4 pt-0 mt-auto">
                <Button className="w-full font-bold bg-slate-900 text-white hover:bg-slate-800" onClick={() => addToCart(product)}>
                  Add to Cart 🛒
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;