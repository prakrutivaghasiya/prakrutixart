import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, createProductReview, getTopProducts } from '../controllers/productController.js';
import {protect, admin} from '../middleware/authMiddleware.js';
import checkObjectId from '../middleware/checkObjectId.js';

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.get('/top', getTopProducts);
router.route('/:id').get(checkObjectId, getProductById).put(protect, checkObjectId, admin, updateProduct).delete(protect, checkObjectId, admin, deleteProduct);
router.route('/:id/reviews').post(protect, createProductReview);

export default router;