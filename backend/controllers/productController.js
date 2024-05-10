import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

// Fetch all Products
// GET api/products
const getProducts = asyncHandler(async(req, res) => {
    const products = await Product.find({});
    res.json(products);
});

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

// Create a Product
// POST api/products
const createProduct = asyncHandler(async(req, res) => {
    const product = new Product({
        name: 'Sample Name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpeg',
        brand: 'Sample brand',
        category: 'Sample Category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample Description'
    })

    const createdProduct = await product.save();

    res.status(201).json(createdProduct);
});

// Update a Product
// PUT api/products/:id
const updateProduct = asyncHandler(async(req, res) => {
    const {name, price, description, image, brand, category, countInStock} = req.body;

    const product = await Product.findById(req.params.id);

    if(product){
        product.name= name;
        product.price = price;
        product.description = description;
        product.image = image;
        product.brand = brand;
        product.category = category;
        product.countInStock = countInStock;

        const updatedProduct = await product.save();

        res.json(updateProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// Delete Product by ID
// DELETE api/products/:id
const deleteProduct = asyncHandler(async(req, res) => {
    const product = await Product.findById(req.params.id);
    if (product){
        await Product.deleteOne({_id: product._id});
        res.status(200).json({message: 'Product deleted'});
    } else {
        res.status(404);
        throw new Error('Resource not found.')
    }
});

// Create Product Review
// POST api/products/:id/reviews
const createProductReview = asyncHandler(async(req, res) => {
    const {rating, comment} = req.body;

    const product = await Product.findById(req.params.id);

    if (product){
        const alreadyReviewed = product.reviews.find((review) => review.user.toString() === req.user._id.toString());

        if(alreadyReviewed) {
            res.status(400);
            throw new Error('Product already reviewed');
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };

        product.reviews.push(review);
        
        product.numReviews = product.reviews.length;

        product.rating = product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length;

        await product.save();
        res.status(201).json({message: 'Review Added'});

    } else {
        res.status(404);
        throw new Error('Resource not found.')
    }
});

export {getProducts, getProductById, createProduct, updateProduct, deleteProduct, createProductReview};