import { useState, useEffect } from 'react';

function App() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', stock: '', imageUrl: ''
  });

  const fetchProducts = () => {
    // 🔴 NAYA LIVE BACKEND URL YAHAN HAI
    fetch('https://popcart-mern.onrender.com/api/products')
      .then((response) => response.json())
      .then((data) => {
        if (data.success) setProducts(data.data);
      })
      .catch((error) => console.error("Error fetching products:", error));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      // 🔴 NAYA LIVE BACKEND URL YAHAN HAI
      const response = await fetch('https://popcart-mern.onrender.com/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price), 
          stock: Number(formData.stock)
        })
      });
      const result = await response.json();
      if (result.success) {
        setFormData({ name: '', description: '', price: '', stock: '', imageUrl: '' });
        fetchProducts(); 
      }
    } catch (error) { console.error("Error saving product:", error); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Kya aap sach me is product ko hamesha ke liye delete karna chahte hain?")) {
      try {
        // 🔴 NAYA LIVE BACKEND URL YAHAN HAI
        const response = await fetch(`https://popcart-mern.onrender.com/api/products/${id}`, { method: 'DELETE' });
        const result = await response.json();
        if (result.success) fetchProducts();
      } catch (error) { console.error("Error deleting product:", error); }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-10">
      
      {/* 🌟 Professional Navbar */}
      <nav className="bg-blue-600 text-white p-4 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
          <h1 className="text-2xl font-extrabold tracking-wider flex items-center gap-2">
            🛒 PopCart Store
          </h1>
          <p className="text-sm font-medium opacity-90 hidden sm:block bg-blue-700 px-3 py-1 rounded-full">
            Admin Dashboard
          </p>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        
        {/* 🚀 Modern ADD NEW PRODUCT FORM */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-10">
          <h2 className="text-xl font-bold mb-6 text-gray-700 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-600 p-2 rounded-lg text-sm">➕</span> Add New Product
          </h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input type="text" name="name" placeholder="Product Name (e.g. iPhone 15)" value={formData.name} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 hover:bg-white transition" />
            <input type="number" name="price" placeholder="Price (₹)" value={formData.price} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 hover:bg-white transition" />
            <input type="text" name="description" placeholder="Short Description" value={formData.description} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 hover:bg-white transition md:col-span-2" />
            <input type="number" name="stock" placeholder="Total Stock" value={formData.stock} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 hover:bg-white transition" />
            <input type="url" name="imageUrl" placeholder="Image Link (https://...)" value={formData.imageUrl} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 hover:bg-white transition" />
            
            <button type="submit" className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-blue-200 mt-2 active:scale-[0.99]">
              Save to Database 🚀
            </button>
          </form>
        </div>

        {/* 📦 Beautiful PRODUCTS GRID */}
        <h2 className="text-2xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
          🔥 Latest Arrivals
        </h2>
        
        {products.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-400 font-medium">
            No products found. Add your first product above! 📦
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 flex flex-col group relative overflow-hidden">
                
                {/* Image Section */}
                <div className="h-56 w-full bg-white rounded-xl overflow-hidden mb-4 flex items-center justify-center p-2 relative">
                  <img src={product.imageUrl} alt={product.name} className="max-h-full max-w-full object-contain group-hover:scale-110 transition duration-500 ease-out" />
                </div>
                
                {/* Details Section */}
                <h3 className="font-bold text-lg text-gray-800 mb-1 truncate">{product.name}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">{product.description}</p>
                
                <div className="flex justify-between items-end mb-5">
                  <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                    ₹{product.price.toLocaleString('en-IN')}
                  </h2>
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-md">
                    Stock: {product.stock}
                  </span>
                </div>
                
                {/* Actions */}
                <div className="mt-auto">
                  <button onClick={() => handleDelete(product._id)} className="w-full bg-red-50 hover:bg-red-500 text-red-600 hover:text-white border border-red-100 py-2.5 rounded-xl font-bold transition duration-200 flex justify-center items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    Delete
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;