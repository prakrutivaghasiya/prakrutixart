import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

// Fetch all Products
// GET api/products
const getProducts = async(req, res) => {
    const products = await Product.find({});
    res.json(products);
};

// Fetch Product by ID
// GET api/product/:id
const getProductById = asyncHandler(async(req, res) => {
    const product = await Product.findById(req.params.id);
    if (product){
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Resource not found.')
    }
});

export {getProducts, getProductById};