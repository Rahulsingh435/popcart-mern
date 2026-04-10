import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { ArrowLeft, ShieldCheck, Truck, Star } from "lucide-react";

function ProductDetails() {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 💡 Fix: Saari products fetch karke frontend par hi filter kar rahe hain
    // Taki agar backend ka single ID wala route kaam na kare toh bhi data mil jaye
    fetch('https://popcart-mern.onrender.com/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // ID ke basis par product dhoondho
          const found = data.data.find((item) => item._id === id);
          setProduct(found);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch Error:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-xl animate-pulse">Loading Awesome Tech... 🚀</div>;
  if (!product) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <p className="font-bold text-2xl text-red-500">Product not found! ❌</p>
      <Link to="/"><Button variant="outline">Back to Store</Button></Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans">
      <nav className="p-4 border-b sticky top-0 bg-white z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition font-medium">
            <ArrowLeft size={20} /> Back to Store
          </Link>
          <h2 className="font-black text-xl tracking-tight">PopCart</h2>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="bg-slate-50 rounded-[40px] p-12 flex items-center justify-center border border-slate-100 shadow-inner">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="max-h-[500px] w-full object-contain hover:scale-110 transition duration-700 ease-in-out" 
          />
        </div>

        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-yellow-400"><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /></div>
            <span className="text-sm text-slate-400 font-medium">(4.8 / 5.0 Rating)</span>
          </div>

          <h1 className="text-5xl font-black text-slate-900 mb-6 leading-tight">{product.name}</h1>

          <div className="flex items-baseline gap-4 mb-8">
            <span className="text-4xl font-bold text-blue-600">₹{product.price.toLocaleString('en-IN')}</span>
            <span className="text-xl text-slate-400 line-through">₹{(product.price + 2000).toLocaleString('en-IN')}</span>
            <span className="bg-green-100 text-green-700 text-sm font-bold px-3 py-1 rounded-full">Save ₹2,000</span>
          </div>
          
          <div className="space-y-4 mb-10">
            <h3 className="text-lg font-bold text-slate-800">Product Description</h3>
            <p className="text-slate-600 leading-relaxed text-lg">{product.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <ShieldCheck className="text-blue-600" size={32} />
              <div>
                <p className="font-bold text-slate-900">Secure Warranty</p>
                <p className="text-sm text-slate-500">1 Year Brand Protection</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <Truck className="text-blue-600" size={32} />
              <div>
                <p className="font-bold text-slate-900">Free Shipping</p>
                <p className="text-sm text-slate-500">Delivery in 2-3 Days</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button className="flex-1 py-8 text-xl font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 rounded-2xl transition-all active:scale-95">
              Add to Cart 🛒
            </Button>
          </div>
        </div>
      </div>
      
      <footer className="bg-slate-50 border-t border-slate-200 py-10 mt-12 text-center text-slate-400">
        <p>© 2026 PopCart Premium Store - All Rights Reserved</p>
      </footer>
    </div>
  );
}

export default ProductDetails;