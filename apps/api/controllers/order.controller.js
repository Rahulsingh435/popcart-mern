import { Order } from '@popcart/database';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// 1. Naya Order Place Karna (COD ke liye)
export const createOrder = async (req, res) => {
    try {
        const { userId, orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;
        if (!orderItems || orderItems.length === 0) return res.status(400).json({ success: false, message: "Cart khali hai!" });

        const newOrder = await Order.create({
            user: userId, orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice
        });
        res.status(201).json({ success: true, order: newOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Customer ke apne Orders nikalna
export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.userId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Admin ke liye saare orders nikalna
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Admin order ko "Delivered" mark karega
export const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id, 
            { isDelivered: true, deliveredAt: Date.now() }, 
            { new: true }
        );
        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// 💸 RAZORPAY ONLINE PAYMENT LOGIC 💸
// ==========================================

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag',
    key_secret: process.env.RAZORPAY_KEY_SECRET || '51m4n4v4n4m4n4v4n4m4n4v4'
});

export const createRazorpayOrder = async (req, res) => {
    try {
        const options = {
            amount: req.body.amount * 100, // Amount in paise
            currency: "INR",
            receipt: "receipt_order_" + Date.now(),
        };
        const order = await razorpay.orders.create(options);
        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error("Razorpay Error:", error);
        res.status(500).json({ success: false, message: "Payment gateway error!" });
    }
};

export const verifyRazorpayPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || '51m4n4v4n4m4n4v4n4m4n4v4')
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            // Payment Asli Hai! Order Save Karo
            const newOrder = await Order.create({
                ...orderData,
                paymentMethod: 'Online Payment (Razorpay)',
                isPaid: true,
                paidAt: Date.now()
            });
            return res.status(200).json({ success: true, message: "Payment Verified!", order: newOrder });
        } else {
            return res.status(400).json({ success: false, message: "Invalid signature sent!" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};