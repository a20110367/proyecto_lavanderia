import express from 'express';
import {
    getOrders,
    getOrdersById,
    getOrdersByIdClient,
    getOrdersByIdUser,
    createOrder,
    createOrderMany,
    updateOrder,
    deleteOrder,
    deleteOrderAll
} from "../controllers/OrderController.js";

const router = express.Router();

router.get('/orders', getOrders);
router.get('/orders/:id', getOrdersById);
router.get('/ordersByClient/:fk_client', getOrdersByIdClient);
router.get('/ordersByUser/:fk_user', getOrdersByIdUser);
router.post('/orders', createOrder);
router.post('/ordersMany', createOrderMany);
router.patch('/orders/:id', updateOrder);
router.delete('/orders/:id', deleteOrder);
router.delete('/ordersAll/', deleteOrderAll);
export default router;