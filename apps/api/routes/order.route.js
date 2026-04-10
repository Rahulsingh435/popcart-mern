import express from 'express';
import { createOrder } from '../controllers/order.controller.js';

const router = express.Router();

// POST request jab /api/orders par aayegi, toh createOrder chalega
router.post('/', createOrder);

export default router;