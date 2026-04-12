import express from 'express';
import { 
    createOrder, 
    getUserOrders, 
    getAllOrders, 
    updateOrderStatus,
    createRazorpayOrder,      // 💸 NAYA: Import add kiya
    verifyRazorpayPayment     // 💸 NAYA: Import add kiya
} from '../controllers/order.controller.js';

const router = express.Router();

router.post('/', createOrder); 
router.get('/user/:userId', getUserOrders); // 🟢 Customer ke liye
router.get('/', getAllOrders); // 👑 Admin ke liye
router.put('/:id/deliver', updateOrderStatus); // 👑 Admin ke liye

// 💸 🟢 NAYA: Razorpay ke raste (Ye chhoot gaya tha)
router.post('/razorpay/create', createRazorpayOrder);
router.post('/razorpay/verify', verifyRazorpayPayment);

export default router;