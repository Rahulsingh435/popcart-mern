// Import required external modules
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import our custom database connection and routes
import { connectToDatabase } from '@popcart/database';
import productRoutes from './routes/product.route.js';

// Load environment variables from .env file
dotenv.config();

// Initialize the Express application
const app = express();
const PORT = process.env.PORT || 5000;

// Apply Middlewares
app.use(cors());
app.use(express.json());

// 🚀 YAHAN HUM DATABASE CONNECT KAR RAHE HAIN
connectToDatabase(process.env.MONGO_URI);

// Define a basic Health Check Route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: "PopCart API is up and running smoothly!",
        version: "1.0.0"
    });
});

// 🚀 YAHAN HUM APNI PRODUCT API KO JOD RAHE HAIN
app.use('/api/products', productRoutes);

// Start the server and listen for incoming requests
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});