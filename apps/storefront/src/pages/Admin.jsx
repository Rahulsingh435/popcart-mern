import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 

function Admin() {
  const [activeTab, setActiveTab] = useState('inventory'); // 🟢 NAYA: Tabs ke liye
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]); // 🟢 NAYA: Orders store karne ke liye
  const [formData, setFormData] = useState({ name: '', description: '', price: '', stock: '', imageUrl: '' });
  const [editingId, setEditingId] = useState(null); 
  
  const navigate = useNavigate(); 

  // 🛡️ SECURITY GUARD LOGIC
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || (user.role !== 'admin' && user.role !== 'vendor')) {
      alert("🛑 Ruk jaaiye! Aap Admin nahi hain. Yahan aana mana hai.");
      navigate('/'); 
    }
  }, [navigate]);

  const fetchProducts = () => {
    fetch('https://popcart-mern.onrender.com/api/products') 
      .then((res) => res.json())
      .then((data) => { if (data.success) setProducts(data.data); })
      .catch((err) => console.error("Fetch error:", err));
  };

  // 🟢 NAYA: Saare orders fetch karne ka function
  const fetchOrders = () => {
    fetch('https://popcart-mern.onrender.com/api/orders') 
      .then((res) => res.json())
      .then((data) => { if (data.success) setOrders(data.orders); })
      .catch((err) => console.error("Fetch error:", err));
  };

  useEffect(() => { 
    fetchProducts(); 
    fetchOrders(); // 🟢 NAYA: Page load hote hi orders bhi database se aayenge
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId ? `https://popcart-mern.onrender.com/api/products/${editingId}` : 'https://popcart-mern.onrender.com/api/products';
      const methodType = editingId ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method: methodType,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, price: Number(formData.price), stock: Number(formData.stock) })
      });
      const result = await response.json();
      if (result.success) {
        setFormData({ name: '', description: '', price: '', stock: '', imageUrl: '' });
        setEditingId(null);
        fetchProducts(); 
      }
    } catch (err) { console.error("Submit error:", err); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this product?")) {
      try {
        const response = await fetch(`https://popcart-mern.onrender.com/api/products/${id}`, { method: 'DELETE' });
        const result = await response.json();
        if (result.success) fetchProducts();
      } catch (err) { console.error("Delete error:", err); }
    }
  };

  const handleEditClick = (product) => {
    setActiveTab('inventory'); // Edit dabate hi wapas inventory form pe bhej dega
    setEditingId(product._id);
    setFormData({ name: product.name, description: product.description, price: product.price, stock: product.stock, imageUrl: product.imageUrl });
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  // 👑 NAYA: Order ko Delivered mark karne ka function
  const markAsDelivered = async (orderId) => {
    if (window.confirm("Kya sach mein is order ko Delivered mark karein?")) {
      try {
        const response = await fetch(`https://popcart-mern.onrender.com/api/orders/${orderId}/deliver`, { method: 'PUT' });
        const result = await response.json();
        if (result.success) fetchOrders(); // Update hone ke baad list refresh hogi
      } catch (err) { console.error("Update error:", err); }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-10">
      <nav className="bg-slate-900 text-white p-4 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
          <h1 className="text-2xl font-extrabold flex items-center gap-2">⚙️ Admin Panel</h1>
          <Link to="/" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-bold transition text-sm">
            🏪 View Store
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        
        {/* 🟢 NAYA: Tabs banaye hain (Inventory aur Orders switch karne ke liye) */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 pb-4 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`px-6 py-3 rounded-full font-bold transition whitespace-nowrap ${activeTab === 'inventory' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            📦 Manage Inventory
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 rounded-full font-bold transition whitespace-nowrap ${activeTab === 'orders' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            🧾 Manage Orders
          </button>
        </div>

        {/* 📦 INVENTORY TAB */}
        {activeTab === 'inventory' && (
          <div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-10">
              <h2 className="text-xl font-bold mb-6 text-gray-700 flex items-center gap-2">
                 {editingId ? '✏️ Edit Product' : '➕ Add New Product'}
              </h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50" />
                <input type="number" name="price" placeholder="Price (₹)" value={formData.price} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50" />
                <input type="text" name="description" placeholder="Short Description" value={formData.description} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 md:col-span-2" />
                <input type="number" name="stock" placeholder="Total Stock" value={formData.stock} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50" />
                <input type="url" name="imageUrl" placeholder="Image Link" value={formData.imageUrl} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50" />
                <div className="md:col-span-2 flex gap-3 mt-2">
                  <button type="submit" className={`flex-1 text-white font-bold py-3.5 rounded-xl ${editingId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                    {editingId ? 'Update Product' : 'Save to Database'}
                  </button>
                  {editingId && <button type="button" onClick={() => setEditingId(null)} className="flex-1 bg-gray-200 font-bold py-3.5 rounded-xl">Cancel</button>}
                </div>
              </form>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-6">Inventory ({products.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <div key={p._id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col">
                  <img src={p.imageUrl} alt={p.name} className="h-40 object-contain mb-4" />
                  <h3 className="font-bold text-lg mb-1">{p.name}</h3>
                  <p className="text-2xl font-extrabold mb-4 text-blue-600">₹{p.price.toLocaleString('en-IN')}</p>
                
                  <div className="mt-auto flex gap-2">
                    <button onClick={() => handleEditClick(p)} className="flex-1 bg-yellow-50 text-yellow-600 py-2 rounded-xl font-bold text-sm">Edit</button>
                    <button onClick={() => handleDelete(p._id)} className="flex-1 bg-red-50 text-red-600 py-2 rounded-xl font-bold text-sm">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🧾 ORDERS TAB (NAYA SECTION) */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">All Customer Orders ({orders.length})</h2>
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order._id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex flex-wrap justify-between items-start border-b border-gray-100 pb-4 mb-4 gap-4">
                    <div>
                      <p className="text-xs font-bold text-gray-400">ORDER ID</p>
                      <p className="text-sm font-bold text-gray-800">#{order._id}</p>
                      <p className="text-xs font-bold text-gray-400 mt-2">CUSTOMER DETAILS</p>
                      <p className="text-sm text-gray-700">{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                      <p className="text-sm text-gray-700">Pincode: {order.shippingAddress.postalCode}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-gray-400">TOTAL AMOUNT</p>
                      <p className="text-xl font-black text-blue-600">₹{order.totalPrice.toLocaleString('en-IN')}</p>
                      <div className="mt-2">
                        {order.isDelivered ? (
                          <span className="px-4 py-1.5 bg-green-100 text-green-700 font-bold rounded-full text-sm">Delivered ✅</span>
                        ) : (
                          <button onClick={() => markAsDelivered(order._id)} className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full text-sm transition shadow-sm">
                            Mark as Delivered 📦
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {order.orderItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <img src={item.image} alt={item.name} className="w-10 h-10 object-contain bg-white rounded-md" />
                        <div>
                          <p className="font-bold text-sm text-gray-800 line-clamp-1">{item.name}</p>
                          <p className="text-xs font-bold text-gray-500">Qty: {item.qty}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {orders.length === 0 && <p className="text-gray-500 text-center font-bold py-10">Koi order nahi aaya abhi tak! 😔</p>}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Admin;