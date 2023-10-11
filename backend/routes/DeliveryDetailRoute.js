import express from 'express';
import {
    getDeliveryDetails,
    getDeliveryDetailsById,
    createDeliveryDetail,
    updateDeliveryDetail,
    deleteDeliveryDetail
} from "../controllers/DeliveryDetailController.js";

const router = express.Router();

router.get('/deliveryDetails', getDeliveryDetails);
router.get('/deliveryDetails/:id', getDeliveryDetailsById);
router.post('/deliveryDetails', createDeliveryDetail);
router.patch('/deliveryDetails/:id', updateDeliveryDetail);
router.delete('/deliveryDetails/:id', deleteDeliveryDetail);

export default router;