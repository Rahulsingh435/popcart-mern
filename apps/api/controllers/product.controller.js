// Import the Product model from our monorepo database package
import { Product } from '@popcart/database';

/**
 * Controller to handle the creation of a new product.
 * @route POST /api/products
 */
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, imageUrl, stock } = req.body;

        if (!name || !description || !price) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields: name, description, and price."
            });
        }

        const newProduct = await Product.create({
            name,
            description,
            price,
            imageUrl,
            stock
        });

        res.status(201).json({
            success: true,
            message: "Product created successfully!",
            data: newProduct
        });

    } catch (error) {
        console.error(`[Product Error] Failed to create product: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Server Error: Could not create the product."
        });
    }
};

/**
 * Controller to fetch all products from the database.
 * @route GET /api/products
 */
export const getAllProducts = async (req, res) => {
    try {
        // Find all products in the database. 
        // Passing an empty object {} means "find everything".
        const products = await Product.find({});

        // Send the list of products back to the client
        res.status(200).json({
            success: true,
            count: products.length, // Let the frontend know how many products exist
            data: products
        });

    } catch (error) {
        console.error(`[Product Error] Failed to fetch products: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Server Error: Could not fetch products."
        });
    }
};

/**
 * 🔴 NAYA FUNCTION: Controller to delete a product by its ID.
 * @route DELETE /api/products/:id
 */
export const deleteProduct = async (req, res) => {
    try {
        // URL se product ki ID nikalna
        const { id } = req.params;

        // Database me wo ID dhoondh kar delete karna
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product nahi mila!"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product successfully delete ho gaya!"
        });

    } catch (error) {
        console.error(`[Product Error] Failed to delete product: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Server Error: Could not delete product."
        });
    }
};