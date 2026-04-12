import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Backend se User ke orders laa rahe hain
    fetch(`https://popcart-mern.onrender.com/api/orders/user/${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setOrders(data.orders);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch Error:", err);
        setLoading(false);
      });
  }, [navigate, user]);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900">My Orders 📦</h1>
            <p className="text-slate-500 mt-2">Check the status of your recent purchases</p>
          </div>
          <Link to="/" className="text-blue-600 font-bold hover:underline">Continue Shopping</Link>
        </div>

        {loading ? (
          <p className="text-center text-slate-500 font-bold text-lg mt-10">Loading orders... ⏳</p>
        ) : orders.length === 0 ? (
          <div className="bg-white p-10 rounded-[32px] text-center shadow-sm">
            <span className="text-5xl">🛍️</span>
            <h2 className="text-2xl font-bold mt-4 text-slate-800">No Orders Yet!</h2>
            <p className="text-slate-500 mt-2">Looks like you haven't bought anything. Let's fix that!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <div key={order._id} className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm hover:shadow-md transition">
                <div className="flex flex-wrap justify-between items-center border-b border-slate-100 pb-4 mb-4 gap-4">
                  <div>
                    <p className="text-xs font-bold text-slate-400">ORDER ID</p>
                    <p className="text-sm font-bold text-slate-700">#{order._id.substring(0, 10).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400">TOTAL</p>
                    <p className="text-sm font-bold text-blue-600">₹{order.totalPrice.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400">STATUS</p>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${order.isDelivered ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {order.isDelivered ? 'Delivered ✅' : 'Pending ⏳'}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {order.orderItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                      <div className="flex items-center gap-4">
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-contain bg-white p-1 rounded-lg" />
                        <div>
                          <p className="font-bold text-sm text-slate-800">{item.name}</p>
                          <p className="text-xs text-slate-500">Qty: {item.qty}</p>
                        </div>
                      </div>
                      <p className="font-bold text-slate-700 text-sm">₹{item.price.toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrders;