import express from 'express';
import {
    getOrderLaundryServiceDetails,
    getOrderLaundryServiceDetailsById,
    getOrderLaundryServiceDetailsByOrderId,
    createOrderLaundryServiceDetail,
    updateOrderLaundryServiceDetail,
    deleteOrderLaundryServiceDetail
} from "../controllers/OrderLaundryServiceDetailController.js";

const router = express.Router();

router.get('/orderLaundryServiceDetails', getOrderLaundryServiceDetails);
router.get('/orderLaundryServiceDetails/:id', getOrderLaundryServiceDetailsById);
router.get('/orderLaundryServiceDetailsByOrder/:id', getOrderLaundryServiceDetailsByOrderId);
router.post('/orderLaundryServiceDetails', createOrderLaundryServiceDetail);
router.patch('/orderLaundryServiceDetails/:id', updateOrderLaundryServiceDetail);
router.delete('/orderLaundryServiceDetails/:id', deleteOrderLaundryServiceDetail);

export default router;