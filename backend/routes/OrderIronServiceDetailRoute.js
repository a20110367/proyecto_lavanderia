import express from 'express';
import {
    getOrderIronServiceDetails,
    getOrderIronServiceDetailsById,
    getOrderIronServiceDetailsByOrderId,
    createOrderIronServiceDetail,
    updateOrderIronServiceDetail,
    deleteOrderIronServiceDetail
} from "../controllers/OrderIronServiceDetailController.js";

const router = express.Router();

router.get('/orderIronServiceDetails', getOrderIronServiceDetails);
router.get('/orderIronServiceDetailsById/:id', getOrderIronServiceDetailsById);
router.get('/orderIronServiceDetailsByOrder/:fk_Order', getOrderIronServiceDetailsByOrderId);
router.post('/orderIronServiceDetails', createOrderIronServiceDetail);
router.patch('/orderIronServiceDetails/:id', updateOrderIronServiceDetail);
router.delete('/orderIronServiceDetails/:id', deleteOrderIronServiceDetail);

export default router;