import { Order } from '@popcart/database';

// 1. Naya Order Place Karna (Purana wala)
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

// 🟢 2. NAYA: Customer ke apne Orders nikalna (My Orders ke liye)
export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.userId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 👑 3. NAYA: Admin ke liye saare orders nikalna (Admin Panel ke liye)
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 👑 4. NAYA: Admin order ko "Delivered" mark karega
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