import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "../components/ui/button";

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
  
  // 🟢 NAYA: Payment method ka state (Default COD rakha hai)
  const [paymentMethod, setPaymentMethod] = useState('COD'); 

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

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Common Order Data
      const orderData = {
        userId: user.id,
        orderItems: cart.map(item => ({ name: item.name, qty: item.qty, image: item.imageUrl, price: item.price, product: item._id })),
        shippingAddress,
        itemsPrice, taxPrice, shippingPrice, totalPrice,
        // 🟢 NAYA: Backend ko batao kaunsa method chuna hai
        paymentMethod: paymentMethod === 'COD' ? 'Cash On Delivery' : 'Online Payment (Razorpay)' 
      };

      // 📦 LOGIC 1: AGAR CUSTOMER NE COD CHUNA HAI
      if (paymentMethod === 'COD') {
        const response = await fetch('https://popcart-mern.onrender.com/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
        });
        const data = await response.json();

        if (data.success) {
          alert("🎉 Order Successfully Placed (Cash On Delivery)!");
          localStorage.removeItem('popcart_cart'); 
          navigate('/my-orders'); 
        } else {
          alert("Oops! Order place nahi hua: " + data.message);
        }
        setLoading(false);
        return; // COD tha toh yahi se wapas laut jao, aage ka Razorpay mat chalao
      }

      // 💳 LOGIC 2: AGAR CUSTOMER NE ONLINE CHUNA HAI (Razorpay)
      const isRazorpayLoaded = await loadRazorpay();
      if (!isRazorpayLoaded) {
        alert('Razorpay fail ho gaya. Apna internet check kijiye!');
        setLoading(false);
        return;
      }

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

      const options = {
        key: "rzp_test_1DP5mmOlF5G5ag", 
        amount: razorpayOrder.order.amount,
        currency: "INR",
        name: "PopCart 🛍️",
        description: "Secure Order Payment",
        order_id: razorpayOrder.order.id,
        handler: async function (response) {
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
            navigate('/my-orders'); 
          } else {
            alert("❌ Payment fake hai ya verify nahi hui!");
          }
        },
        prefill: { name: user.name, email: user.email },
        theme: { color: "#2563eb" } 
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

            {/* 🟢 NAYA: Payment Method Select Karne Ka Option */}
            <div className="pt-4 pb-2">
              <label className="text-sm font-bold text-slate-700 ml-1 block mb-3">Select Payment Method</label>
              <div className="flex gap-4">
                <label className={`flex-1 border-2 p-4 rounded-2xl cursor-pointer flex flex-col items-center gap-2 transition-all ${paymentMethod === 'COD' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                  <input type="radio" name="payment" value="COD" className="hidden" checked={paymentMethod === 'COD'} onChange={(e) => setPaymentMethod(e.target.value)} />
                  <span className="text-2xl">💵</span>
                  <span className="font-bold text-sm text-slate-700">Cash on Delivery</span>
                </label>
                
                <label className={`flex-1 border-2 p-4 rounded-2xl cursor-pointer flex flex-col items-center gap-2 transition-all ${paymentMethod === 'Online' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                  <input type="radio" name="payment" value="Online" className="hidden" checked={paymentMethod === 'Online'} onChange={(e) => setPaymentMethod(e.target.value)} />
                  <span className="text-2xl">💳</span>
                  <span className="font-bold text-sm text-slate-700">Pay Online</span>
                </label>
              </div>
            </div>
            
            {/* 🟢 NAYA: Button ka text automatically change hoga */}
            <Button disabled={loading} type="submit" className={`w-full py-7 text-lg font-bold rounded-2xl mt-4 text-white shadow-lg transition-all ${paymentMethod === 'COD' ? 'bg-slate-900 hover:bg-slate-800 shadow-slate-300' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}`}>
              {loading ? "Processing... ⏳" : paymentMethod === 'COD' ? `Place Order (COD) 🚀` : `Pay ₹${totalPrice.toLocaleString('en-IN')} Online 💳`}
            </Button>
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