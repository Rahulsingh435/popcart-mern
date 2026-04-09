import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// 🟢 Paths fixed to relative for stability
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../components/ui/sheet";

function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch('https://popcart-mern.onrender.com/api/products')
      .then((res) => res.json())
      .then((data) => { if (data.success) setProducts(data.data); })
      .catch((err) => console.error(err));
  }, []);

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

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.qty), 0);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🛍️</span>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">PopCart</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/admin" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition">
              Admin Login
            </Link>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button className="font-bold bg-blue-600 hover:bg-blue-700 relative">
                  Cart 🛒 
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {cart.length}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="text-2xl font-bold">Your Cart 🛒</SheetTitle>
                </SheetHeader>
                <div className="mt-8 space-y-6">
                  {cart.length === 0 ? (
                    <div className="text-center text-slate-500 mt-10">
                      <p className="text-4xl mb-2">🛍️</p>
                      <p>Your cart is empty.</p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div key={item._id} className="flex justify-between items-center border-b border-slate-100 pb-4">
                        <div className="flex gap-3 items-center">
                          <img src={item.imageUrl} alt={item.name} className="h-12 w-12 object-contain rounded" />
                          <div>
                            <p className="font-bold text-sm line-clamp-1">{item.name}</p>
                            <p className="text-sm text-slate-500">₹{item.price} x {item.qty}</p>
                          </div>
                        </div>
                        <Button variant="destructive" size="sm" onClick={() => removeFromCart(item._id)}>Remove</Button>
                      </div>
                    ))
                  )}
                  {cart.length > 0 && (
                    <div className="pt-4 mt-6 border-t">
                      <div className="flex justify-between mb-4">
                        <span className="text-slate-500">Total:</span>
                        <span className="text-2xl font-black">₹{cartTotal.toLocaleString('en-IN')}</span>
                      </div>
                      <Button className="w-full bg-green-600 font-bold py-6">Checkout 💳</Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-slate-900 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">Level up your tech game.</h1>
        <p className="text-slate-400">Discover unbeatable prices on latest gadgets.</p>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-slate-900 mb-8">Trending Products 🔥</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product._id} className="flex flex-col group overflow-hidden">
              <div className="h-64 bg-white p-6 flex items-center justify-center relative">
                <img src={product.imageUrl} alt={product.name} className="max-h-full object-contain group-hover:scale-110 transition duration-500" />
              </div>
              <CardHeader className="p-4 flex-grow">
                <CardTitle className="text-lg font-bold line-clamp-1">{product.name}</CardTitle>
                <p className="text-sm text-slate-500 line-clamp-2">{product.description}</p>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <h2 className="text-2xl font-black">₹{product.price.toLocaleString('en-IN')}</h2>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full font-bold" onClick={() => addToCart(product)}>Add to Cart 🛒</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-slate-500 text-sm">
        <p>© 2026 PopCart Store. Built by Rahul Kumar.</p>
      </footer>
    </div>
  );
}

export default Home;