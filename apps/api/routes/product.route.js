import express from 'express';

// Teeno functions ko import kar liya
import { createProduct, getAllProducts, deleteProduct } from '../controllers/product.controller.js';

const router = express.Router();

// Naya product banane ke liye
router.post('/', createProduct);

// Saare products dekhne ke liye
router.get('/', getAllProducts);

// 🔴 Kisi ek product ko DELETE karne ke liye (URL me ID aayegi)
router.delete('/:id', deleteProduct);

export default router;