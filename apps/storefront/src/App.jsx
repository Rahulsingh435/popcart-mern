import { useState, useEffect } from 'react';

function App() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', stock: '', imageUrl: ''
  });
  
  // 🟡 NAYA STATE: Ye yaad rakhega ki hum konsa product edit kar rahe hain
  const [editingId, setEditingId] = useState(null); 

  const fetchProducts = () => {
    fetch('http://localhost:5000/api/products')
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

  // 🟡 UPDATE SUBMIT: Ye check karega ki naya product daalna hai (POST) ya purana edit karna hai (PUT)
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      const url = editingId 
        ? `http://localhost:5000/api/products/${editingId}` 
        : 'http://localhost:5000/api/products';
        
      const methodType = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: methodType,
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
        setEditingId(null); // Edit mode se bahar aana
        fetchProducts(); 
      }
    } catch (error) { console.error("Error saving product:", error); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Kya aap sach me is product ko hamesha ke liye delete karna chahte hain?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`, { method: 'DELETE' });
        const result = await response.json();
        if (result.success) fetchProducts();
      } catch (error) { console.error("Error deleting product:", error); }
    }
  };

  // 🟡 NAYA FUNCTION: Edit button dabane par form me data bharna
  const handleEditClick = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl
    });
    // Form ke paas upar scroll karna
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  // Edit mode cancel karna
  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', price: '', stock: '', imageUrl: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-10">
      
      {/* Navbar */}
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
        
        {/* ADD / EDIT FORM */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-10">
          <h2 className="text-xl font-bold mb-6 text-gray-700 flex items-center gap-2">
            <span className={`p-2 rounded-lg text-sm ${editingId ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'}`}>
              {editingId ? '✏️' : '➕'}
            </span> 
            {editingId ? 'Edit Product Details' : 'Add New Product'}
          </h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input type="text" name="name" placeholder="Product Name (e.g. iPhone 15)" value={formData.name} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 hover:bg-white transition" />
            <input type="number" name="price" placeholder="Price (₹)" value={formData.price} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 hover:bg-white transition" />
            <input type="text" name="description" placeholder="Short Description" value={formData.description} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 hover:bg-white transition md:col-span-2" />
            <input type="number" name="stock" placeholder="Total Stock" value={formData.stock} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 hover:bg-white transition" />
            <input type="url" name="imageUrl" placeholder="Image Link (https://...)" value={formData.imageUrl} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 hover:bg-white transition" />
            
            <div className="md:col-span-2 flex gap-3 mt-2">
              <button type="submit" className={`flex-1 text-white font-bold py-3.5 rounded-xl transition shadow-lg active:scale-[0.99] ${editingId ? 'bg-yellow-500 hover:bg-yellow-600 shadow-yellow-200' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}`}>
                {editingId ? 'Update Product ✏️' : 'Save to Database 🚀'}
              </button>
              
              {editingId && (
                <button type="button" onClick={cancelEdit} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3.5 rounded-xl transition active:scale-[0.99]">
                  Cancel Edit ❌
                </button>
              )}
            </div>
          </form>
        </div>

        {/* PRODUCTS GRID */}
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
                
                {/* 🔴 Edit and Delete Buttons */}
                <div className="mt-auto flex gap-2">
                  <button onClick={() => handleEditClick(product)} className="flex-1 bg-yellow-50 hover:bg-yellow-500 text-yellow-600 hover:text-white border border-yellow-100 py-2.5 rounded-xl font-bold transition duration-200">
                    ✏️ Edit
                  </button>
                  <button onClick={() => handleDelete(product._id)} className="flex-1 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white border border-red-100 py-2.5 rounded-xl font-bold transition duration-200">
                    🗑️ Delete
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