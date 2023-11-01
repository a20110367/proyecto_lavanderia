import express from 'express';
import {
    getSelfServiceWashQueue,
    getSelfServiceWashQueueById,
    getSelfServiceWashQueueByOrderId,
    createManySelfServiceWashQueue,
    updateSelfServiceWashQueue,
    deleteSelfServiceWashQueue,

    getSelfServiceDryQueue,
    getSelfServiceDryQueueById,
    getSelfServiceDryQueueByOrderId,
    createManySelfServiceDryQueue,
    updateSelfServiceDryQueue,
    deleteSelfServiceDryQueue
} from "../controllers/SelfServiceQueueController.js";

const router = express.Router();

router.get('/selfServiceWashQueue', getSelfServiceWashQueue);
router.get('/selfServiceWashQueueById/:id', getSelfServiceWashQueueById);
router.get('/selfServiceWashQueueByOrder/:fk_Order', getSelfServiceWashQueueByOrderId);
router.post('/selfServiceWashQueue', createManySelfServiceWashQueue);
router.patch('/selfServiceWashQueue/:id', updateSelfServiceWashQueue);
router.delete('/selfServiceWashQueue/:id', deleteSelfServiceWashQueue);

router.get('/selfServiceDryQueue', getSelfServiceDryQueue);
router.get('/selfServiceDryQueueById/:id', getSelfServiceDryQueueById);
router.get('/selfServiceDryQueueByOrder/:fk_Order', getSelfServiceDryQueueByOrderId);
router.post('/selfServiceDryQueue', createManySelfServiceDryQueue);
router.patch('/selfServiceDryQueue/:id', updateSelfServiceDryQueue);
router.delete('/selfServiceDryQueue/:id', deleteSelfServiceDryQueue);



export default router;