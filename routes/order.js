import express from 'express';

import { authMiddleware } from '../middleware/auth.js';
import { adminMiddleware } from '../middleware/admin.js';
import { deleteOrder, deliverOrder, getOrderDetail, getOrderHistory, getOrderList, getOrderSummary, orderPayment, postOrder } from '../controllers/order.js';

const router = express.Router(); 

// Post Order
router.post('/new', authMiddleware, postOrder); 

// Get Orders History
router.get('/client', authMiddleware, getOrderHistory); 

// Get Orders List (Admin)
router.get('/admin', authMiddleware, adminMiddleware, getOrderList);

// Get All Order Summary (Admin)
router.get('/summary', authMiddleware, adminMiddleware, getOrderSummary);

// Delete Order (Admin)
router.delete('/order/:id', authMiddleware, adminMiddleware, deleteOrder);

// Get Order Detail
router.get('/:id', authMiddleware, getOrderDetail); 

// Order Payment
router.put('/:id/pay', authMiddleware, orderPayment);

// Deliver Order
router.put('/:id/delivery', authMiddleware, adminMiddleware, deliverOrder);

export default router;