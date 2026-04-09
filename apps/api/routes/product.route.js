import express from 'express';

// Charo functions ko import kar liya
import { createProduct, getAllProducts, deleteProduct, updateProduct } from '../controllers/product.controller.js';

const router = express.Router();

router.post('/', createProduct);
router.get('/', getAllProducts);
router.delete('/:id', deleteProduct);

// 🟡 NAYA ROUTE: Kisi ek product ko UPDATE (Edit) karne ke liye
router.put('/:id', updateProduct);

export default router;