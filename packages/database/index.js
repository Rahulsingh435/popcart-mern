// Import mongoose to handle database connection and schemas
import mongoose from 'mongoose';

// Import our Product model so we can export it to other apps
import { Product } from './models/product.model.js';

/**
 * Connects to the MongoDB database using the provided URI.
 * @param {string} uri - The MongoDB connection string from .env
 */
export const connectToDatabase = async (uri) => {
    try {
        // Attempt to establish a connection to the database
        const connection = await mongoose.connect(uri);
        
        // Log a success message with the host name
        console.log(`[Database] MongoDB Connected Successfully: ${connection.connection.host}`);
    } catch (error) {
        // Log the error message if the connection fails
        console.error(`[Database] Connection Error: ${error.message}`);
        
        // Exit the Node.js process to prevent the app from running blindly without a database
        process.exit(1);
    }
};

// Export the connection function, mongoose instance, and all models (like Product)
// This makes them available to our 'api' backend via '@popcart/database'
export { mongoose, Product };