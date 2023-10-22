import express from 'express';
import {
    getOrderServiceDetails,
    getOrderServiceDetailsById,
    createOrderServiceDetail,
    updateOrderServiceDetail,
    deleteOrderServiceDetail
} from "../controllers/OrderServiceDetailController.js";

const router = express.Router();

router.get('/orderServiceDetails', getOrderServiceDetails);
router.get('/orderServiceDetails/:id', getOrderServiceDetailsById);
router.post('/orderServiceDetails', createOrderServiceDetail);
router.patch('/orderServiceDetails/:id', updateOrderServiceDetail);
router.delete('/orderServiceDetails/:id', deleteOrderServiceDetail);

export default router;