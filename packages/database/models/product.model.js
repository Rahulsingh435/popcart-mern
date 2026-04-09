import mongoose from 'mongoose';

// Define the rules (Schema) for a Product
const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is strictly required'],
            trim: true
        },
        description: {
            type: String,
            required: [true, 'Product description is required']
        },
        price: {
            type: Number,
            required: [true, 'Product price must be provided'],
            min: [0, 'Price cannot be negative']
        },
        imageUrl: {
            type: String,
            default: 'https://via.placeholder.com/150' // Fallback image if none provided
        },
        stock: {
            type: Number,
            required: true,
            default: 0
        }
    },
    {
        // Automatically adds 'createdAt' and 'updatedAt' timestamps
        timestamps: true 
    }
);

// Create the model from the schema. 
export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);