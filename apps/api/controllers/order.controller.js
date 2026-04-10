import { Order } from '@popcart/database';

export const createOrder = async (req, res) => {
    try {
        // Frontend se order ka saara data aayega
        const { userId, orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ success: false, message: "Cart khali hai, order nahi ban sakta!" });
        }

        // Database mein naya order save kar rahe hain
        const newOrder = await Order.create({
            user: userId,
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        });

        res.status(201).json({ 
            success: true, 
            message: "Order placed successfully! 🎉", 
            order: newOrder 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};