import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "../components/ui/button";

// 🌐 NAYA: Razorpay ki script background mein load karne ka function
const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    address: '', city: '', postalCode: '', country: 'India'
  });

  useEffect(() => {
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

  const itemsPrice = cart.reduce((total, item) => total + (item.price * item.qty), 0);
  const shippingPrice = itemsPrice > 5000 ? 0 : 100; 
  const taxPrice = Number((0.18 * itemsPrice).toFixed(2)); 
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  // 💸 NAYA: Online Payment Wala Logic
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Script load karo
      const isRazorpayLoaded = await loadRazorpay();
      if (!isRazorpayLoaded) {
        alert('Razorpay fail ho gaya. Apna internet check kijiye!');
        setLoading(false);
        return;
      }

      // 2. Order ka poora data jo baad mein DB mein jayega
      const orderData = {
        userId: user.id,
        orderItems: cart.map(item => ({ name: item.name, qty: item.qty, image: item.imageUrl, price: item.price, product: item._id })),
        shippingAddress,
        itemsPrice, taxPrice, shippingPrice, totalPrice
      };

      // 3. Backend se Razorpay ka "Order ID" mangwao
      const razorpayResponse = await fetch('https://popcart-mern.onrender.com/api/orders/razorpay/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Math.round(totalPrice) })
      });
      const razorpayOrder = await razorpayResponse.json();

      if (!razorpayOrder.success) {
        alert('Payment gateway mein dikkat aayi!');
        setLoading(false);
        return;
      }

      // 4. Razorpay ka asli Popup kholo!
      const options = {
        key: "rzp_test_1DP5mmOlF5G5ag", // Yahan test key hi rahegi
        amount: razorpayOrder.order.amount,
        currency: "INR",
        name: "PopCart 🛍️",
        description: "Secure Order Payment",
        order_id: razorpayOrder.order.id,
        handler: async function (response) {
          
          // 5. Payment ho gaya! Ab backend se verify karwao aur DB mein save karo
          const verifyRes = await fetch('https://popcart-mern.onrender.com/api/orders/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              orderData: orderData
            })
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            alert("🎉 Payment Successful! Order Placed.");
            localStorage.removeItem('popcart_cart'); 
            navigate('/my-orders'); // Seedha My Orders page par bhej do
          } else {
            alert("❌ Payment fake hai ya verify nahi hui!");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: { color: "#2563eb" } // Blue color theme
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        alert("Payment fail ho gayi bhaiya! Wapas try kijiye.");
      });
      rzp.open();

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
            
            <Button disabled={loading} type="submit" className="w-full py-7 text-lg font-bold bg-blue-600 hover:bg-blue-700 rounded-2xl mt-6 text-white shadow-lg shadow-blue-200">
              {loading ? "Processing... ⏳" : `Pay Online (₹${totalPrice.toLocaleString('en-IN')}) 💳`}
            </Button>
            <p className="text-center text-xs font-bold text-slate-400 mt-2">100% Secure Payments via Razorpay</p>
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