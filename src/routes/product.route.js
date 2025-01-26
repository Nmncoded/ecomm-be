import express from 'express';
import { addProduct, getAllProducts } from '../controllers/product.controller.js';
import { addProductValidation } from '../validations/product.validation.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
const productRouter = express.Router();

productRouter.post('/product', addProductValidation, authenticateToken , addProduct );

productRouter.get('/products' , authenticateToken , getAllProducts );

export default productRouter