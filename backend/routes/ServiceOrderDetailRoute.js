import express from 'express';
import {
    getServiceOrderDetails,
    getServiceOrderDetailsById,
    getServiceOrderDetailsByOrderId,
    createServiceOrderDetail,
    updateServiceOrderDetail,
    deleteServiceOrderDetail
} from "../controllers/ServiceOrderDetailController.js";

const router = express.Router();

router.get('/serviceOrderDetails', getServiceOrderDetails);
router.get('/serviceOrderDetailsById/:id', getServiceOrderDetailsById);
router.get('/serviceOrderDetailsByOrderId/:id', getServiceOrderDetailsByOrderId);
router.post('/serviceOrderDetails', createServiceOrderDetail);
router.patch('/serviceOrderDetails/:id', updateServiceOrderDetail);
router.delete('/serviceOrderDetails/:id', deleteServiceOrderDetail);

export default router;