import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "../components/ui/button";

function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Address ka state
  const [shippingAddress, setShippingAddress] = useState({
    address: '', city: '', postalCode: '', country: 'India'
  });

  useEffect(() => {
    // Local storage se Cart aur User ka data nikalo
    const savedCart = JSON.parse(localStorage.getItem('popcart_cart')) || [];
    const savedUser = JSON.parse(localStorage.getItem('user'));

    if (!savedUser) {
      alert("Pehle login kijiye bhaiya!");
      navigate('/login');
    } else if (savedCart.length === 0) {
      alert("Aapka cart khali hai!");
      navigate('/');
    } else {
      setCart(savedCart);
      setUser(savedUser);
    }
  }, [navigate]);

  // Bill Calculation
  const itemsPrice = cart.reduce((total, item) => total + (item.price * item.qty), 0);
  const shippingPrice = itemsPrice > 5000 ? 0 : 100; // 5000 se upar free delivery
  const taxPrice = Number((0.18 * itemsPrice).toFixed(2)); // 18% GST
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        userId: user.id,
        orderItems: cart.map(item => ({
          name: item.name,
          qty: item.qty,
          image: item.imageUrl,
          price: item.price,
          product: item._id
        })),
        shippingAddress,
        paymentMethod: 'Cash On Delivery',
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
      };

      // 🌐 NAYA: Localhost ki jagah Render ka LIVE link daal diya!
      const response = await fetch('https://popcart-mern.onrender.com/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (data.success) {
        alert("🎉 Order Successfully Placed! Jaldi hi delivery hogi.");
        localStorage.removeItem('popcart_cart'); // Order hone ke baad cart khali kar do
        navigate('/'); // Wapas home par bhej do
      } else {
        alert("Oops! Order place nahi hua: " + data.message);
      }
    } catch (error) {
      console.error("Order Error:", error);
      alert("Server se connect nahi ho paya!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Side: Delivery Form */}
        <div className="bg-white p-8 rounded-[32px] shadow-lg border border-slate-100">
          <h2 className="text-2xl font-black mb-6">Delivery Details 📍</h2>
          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-700 ml-1">Full Address</label>
              <input type="text" name="address" required onChange={handleChange} placeholder="House No, Street, Landmark" className="w-full mt-1 px-4 py-3 bg-slate-100 border-none rounded-2xl outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-slate-700 ml-1">City</label>
                <input type="text" name="city" required onChange={handleChange} placeholder="Jaipur" className="w-full mt-1 px-4 py-3 bg-slate-100 border-none rounded-2xl outline-none" />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 ml-1">Pincode</label>
                <input type="text" name="postalCode" required onChange={handleChange} placeholder="302001" className="w-full mt-1 px-4 py-3 bg-slate-100 border-none rounded-2xl outline-none" />
              </div>
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 ml-1">Country</label>
              <input type="text" name="country" value="India" readOnly className="w-full mt-1 px-4 py-3 bg-slate-200 border-none rounded-2xl text-slate-500 cursor-not-allowed outline-none" />
            </div>
            
            <Button disabled={loading} type="submit" className="w-full py-7 text-lg font-bold bg-green-600 hover:bg-green-700 rounded-2xl mt-6 text-white">
              {loading ? "Placing Order... ⏳" : `Place Order (₹${totalPrice.toLocaleString('en-IN')}) 🚀`}
            </Button>
            <p className="text-center text-xs font-bold text-slate-400 mt-2">Paying via Cash On Delivery</p>
          </form>
        </div>

        {/* Right Side: Order Summary */}
        <div className="bg-slate-900 text-white p-8 rounded-[32px] shadow-lg flex flex-col">
          <h2 className="text-2xl font-black mb-6">Order Summary 🧾</h2>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {cart.map((item, index) => (
              <div key={index} className="flex justify-between border-b border-slate-700 pb-2">
                <div>
                  <p className="font-bold">{item.name}</p>
                  <p className="text-sm text-slate-400">Qty: {item.qty}</p>
                </div>
                <p className="font-bold text-blue-400">₹{(item.price * item.qty).toLocaleString('en-IN')}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-slate-700 space-y-2">
            <div className="flex justify-between text-slate-300"><span>Items Total:</span> <span>₹{itemsPrice.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between text-slate-300"><span>Shipping:</span> <span>₹{shippingPrice}</span></div>
            <div className="flex justify-between text-slate-300"><span>Tax (18% GST):</span> <span>₹{taxPrice.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between text-2xl font-black text-green-400 mt-4 pt-4 border-t border-slate-700">
              <span>Total:</span> <span>₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Checkout;