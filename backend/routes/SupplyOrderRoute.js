import express from 'express';
import {
    getSupplyOrders,
    getSupplyOrdersById,
    getSupplyOrdersByClientName,
    getSupplyOrdersByIdUser,
    getSupplyOrdersByIdClient,
    createOrder,
    createOrderMany,
    updateOrder,
    deleteOrder,
    deleteOrderAll,
    updateCancelledSupplyOrder
} from "../controllers/SupplyOrderController.js";

const router = express.Router();

router.get('/supplyOrder', getSupplyOrders);
router.get('/supplyOrder/:id', getSupplyOrdersById);
router.get('/supplyOrderByClientName', getSupplyOrdersByClientName);
router.get('/supplyOrderByIdClient', getSupplyOrdersByIdClient);
router.get('/supplyOrderByUser', getSupplyOrdersByIdUser);

router.post('/supplyOrder', createOrder);
router.post('/supplyOrderMany', createOrderMany);

router.patch('/supplyOrder/:id', updateOrder);
router.patch('/cancelSupplyOrder/:id', updateCancelledSupplyOrder);

router.delete('/supplyOrder/:id', deleteOrder);
router.delete('/supplyOrderDeleteAll', deleteOrderAll)

export default router;