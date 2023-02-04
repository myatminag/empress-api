import express from 'express';

import { authMiddleware } from '../middleware/auth.js';
import { adminMiddleware } from '../middleware/admin.js';
import { createNewItem, deleteItem, getAllItem, getBrands, getCategories, getItemDetails, getItemList, getSearchItem, postReview, updateItem } from '../controllers/item.js';

const router = express.Router();

// Get All Items
router.get('/', getAllItem);

// Create New Item
router.post('/create', authMiddleware, adminMiddleware, createNewItem);

// Update Item
router.put('/item/:id', authMiddleware, adminMiddleware, updateItem);

// Delete Item
router.delete('/item/:id', authMiddleware, adminMiddleware, deleteItem);

// Get Item Details
router.get('/item/:id', getItemDetails);

// Post Review
router.post('/:id/reviews', authMiddleware, postReview); 

// Get Item Brand
router.get('/brands', getBrands);

// Get Item Categories
router.get('/categories', getCategories);

// Get Search Items
router.get('/shop', getSearchItem);

// Get Item List
router.get('/admin', authMiddleware, adminMiddleware, getItemList);


export default router;