import express from 'express';
import {
    getLaundryWashQueue,
    getLaundryWashQueueById,
    getLaundryWashQueueByOrderId,
    createLaundryWashQueue,
    updateLaundryWashQueue,
    deleteLaundryWashQueue,

    getLaundryDryQueue,
    getLaundryDryQueueById,
    getLaundryDryQueueByOrderId,
    createLaundryDryQueue,
    updateLaundryDryQueue,
    deleteLaundryDryQueue,
    
    getLaundryIronQueue,
    getLaundryIronQueueById,
    getLaundryIronQueueByOrderId,
    createLaundryIronQueue,
    updateLaundryIronQueue,
    deleteLaundryIronQueue
} from "../controllers/LaundryQueueController.js";

const router = express.Router();

router.get('/laundryWashQueue', getLaundryWashQueue);
router.get('/laundryWashQueueById/:id', getLaundryWashQueueById);
router.get('/laundryWashQueueByOrder/:fk_Order', getLaundryWashQueueByOrderId);
router.post('/laundryWashQueue', createLaundryWashQueue);
router.patch('/laundryWashQueue/:id', updateLaundryWashQueue);
router.delete('/laundryWashQueue/:id', deleteLaundryWashQueue);

router.get('/laundryDryQueue', getLaundryDryQueue);
router.get('/laundryDryQueueById/:id', getLaundryDryQueueById);
router.get('/laundryDryQueueByOrder/:fk_Order', getLaundryDryQueueByOrderId);
router.post('/laundryDryQueue', createLaundryDryQueue);
router.patch('/laundryDryQueue/:id', updateLaundryDryQueue);
router.delete('/laundryDryQueue/:id', deleteLaundryDryQueue);

router.get('/laundryIronQueue', getLaundryIronQueue);
router.get('/laundryIronQueueById/:id', getLaundryIronQueueById);
router.get('/laundryIronQueueByOrder/:fk_Order', getLaundryIronQueueByOrderId);
router.post('/laundryIronQueue', createLaundryIronQueue);
router.patch('/laundryIronQueue/:id', updateLaundryIronQueue);
router.delete('/laundryIronQueue/:id', deleteLaundryIronQueue);

export default router;