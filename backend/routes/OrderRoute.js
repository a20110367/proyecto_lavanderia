import express from 'express';
import {
    getOrders,
    getOrdersById,
    getOrdersByIdClient,
    getOrdersByIdUser,
    getOrdersSelfService,
    getOrdersLaundry,
    getOrdersIron,
    getOrdersLaundryFinished,
    getOrdersIronFinished,
    createOrder,
    createLaudryServiceOrder,
    createIronServiceOrder,
    createSelfServiceOrder,
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
router.get('/ordersSelfService', getOrdersSelfService);
router.get('/ordersLaundry', getOrdersLaundry);
router.get('/ordersIron', getOrdersIron);
router.get('/ordersLaundryFinished', getOrdersLaundryFinished);
router.get('/ordersIronFinished', getOrdersIronFinished);

router.post('/orders', createOrder);
router.post('/ordersLaundryService', createLaudryServiceOrder);
router.post('/ordersSelfService', createSelfServiceOrder);
router.post('/ordersIronService', createIronServiceOrder);
router.post('/ordersMany', createOrderMany);

router.patch('/orders/:id', updateOrder);
router.delete('/orders/:id', deleteOrder);
router.delete('/ordersAll/', deleteOrderAll);
export default router;