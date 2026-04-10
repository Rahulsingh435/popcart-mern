// Import mongoose to handle database connection and schemas
import mongoose from 'mongoose';

// Import our Product, User aur naya Order model so we can export them to other apps
import { Product } from './models/product.model.js';
import { User } from './models/user.model.js'; 
import { Order } from './models/order.model.js'; // 🟡 NAYA: Order import kiya

/**
 * Connects to the MongoDB database using the provided URI.
 * @param {string} uri - The MongoDB connection string from .env
 */
export const connectToDatabase = async (uri) => {
    try {
        const connection = await mongoose.connect(uri);
        console.log(`[Database] MongoDB Connected Successfully: ${connection.connection.host}`);
    } catch (error) {
        console.error(`[Database] Connection Error: ${error.message}`);
        process.exit(1);
    }
};

// 🟡 NAYA: Aakhiri line mein 'Order' ko bhi export kar diya hai
export { mongoose, Product, User, Order };