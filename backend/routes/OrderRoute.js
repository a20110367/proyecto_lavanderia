import express from 'express';
import {
    getOrders,
    getOrdersById,
    getOrdersByIdClient,
    getOrdersByIdUser,
    createOrder,
    updateOrder,
    deleteOrder
} from "../controllers/OrderController.js";

const router = express.Router();

router.get('/orders', getOrders);
router.get('/orders/:id', getOrdersById);
router.get('/orders/:fk_client', getOrdersByIdClient);
router.get('/ordersByUser/:fk_user', getOrdersByIdUser);
router.post('/orders', createOrder);
router.patch('/orders/:id', updateOrder);
router.delete('/orders/:id', deleteOrder);

export default router;