import express from 'express';
import { createOrder, getUserOrders, getAllOrders, updateOrderStatus } from '../controllers/order.controller.js';

const router = express.Router();

router.post('/', createOrder); 
router.get('/user/:userId', getUserOrders); // 🟢 Customer ke liye
router.get('/', getAllOrders); // 👑 Admin ke liye
router.put('/:id/deliver', updateOrderStatus); // 👑 Admin ke liye

export default router;