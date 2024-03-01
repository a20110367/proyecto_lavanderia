import express from 'express';
import {
    getOrders,
    getActiveOrders,
    getOrdersById,
    getOrdersStatusById,
    getOrdersByIdClient,
    getOrdersByClientName,
    getStoredOrdersByClientName,
    getOrdersByIdUser,
    getOrdersSelfService,
    getOrdersLaundry,
    getOrdersIron,
    getOrdersLaundryFinished,
    getOrdersIronFinished,
    getOrdersDrycleanFinished,
    getOrdersOtherServiceFinished,
    getOrdersDryclean,
    getOrderOtherService,
    createOrder,
    createLaudryServiceOrder,
    createIronServiceOrder,
    createSelfServiceOrder,
    createDrycleanServiceOrder,
    createOtherServiceOrder,
    createOrderMany,
    updateOrder,
    updateStoredOrders,
    updateCancelledOrder,
    deleteOrder,
    deleteOrderAll
} from "../controllers/OrderController.js";

const router = express.Router();

router.get('/orders', getOrders);
router.get('/ordersActive', getActiveOrders);
router.get('/orders/:id', getOrdersById);
router.get('/ordersByClient/:fk_client', getOrdersByIdClient);
router.get('/orderStatusById/:id', getOrdersStatusById);


router.get('/ordersByUser/:fk_user', getOrdersByIdUser);
router.get('/ordersSelfService', getOrdersSelfService);
router.get('/ordersLaundry', getOrdersLaundry);
router.get('/ordersIron', getOrdersIron);
router.get('/ordersDryclean', getOrdersDryclean);
router.get('/ordersOtherService', getOrderOtherService);
router.get('/ordersLaundryFinished', getOrdersLaundryFinished);
router.get('/ordersIronFinished', getOrdersIronFinished);
router.get('/ordersDrycleanFinished', getOrdersDrycleanFinished);
router.get('/ordersOtherServiceFinished', getOrdersOtherServiceFinished);



router.post('/orders', createOrder);
router.post('/ordersLaundryService', createLaudryServiceOrder);
router.post('/ordersSelfService', createSelfServiceOrder);
router.post('/ordersIronService', createIronServiceOrder);
router.post('/ordersDryclean', createDrycleanServiceOrder);
router.post('/ordersOtherService', createOtherServiceOrder);
router.post('/ordersMany', createOrderMany);
router.post('/ordersByClientName', getOrdersByClientName);
router.post('/storedOrdersByClientName', getStoredOrdersByClientName);

router.patch('/orders/:id', updateOrder);
router.patch('/storedOrders/', updateStoredOrders);
router.patch('/cancelOrder/:id', updateCancelledOrder);


router.delete('/orders/:id', deleteOrder);
router.delete('/ordersAll/', deleteOrderAll);
export default router;