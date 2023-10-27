import express from 'express';
import {
    getOrderServiceDetails,
    getOrderServiceDetailsById,
    getOrderServiceDetailsByOrderId,
    createOrderServiceDetail,
    updateOrderServiceDetail,
    deleteOrderServiceDetail
} from "../controllers/OrderServiceDetailController.js";

const router = express.Router();

router.get('/orderServiceDetails', getOrderServiceDetails);
router.get('/orderServiceDetails/:id', getOrderServiceDetailsById);
router.get('/orderServiceDetailsByOrder/:id', getOrderServiceDetailsByOrderId);
router.post('/orderServiceDetails', createOrderServiceDetail);
router.patch('/orderServiceDetails/:id', updateOrderServiceDetail);
router.delete('/orderServiceDetails/:id', deleteOrderServiceDetail);

export default router;