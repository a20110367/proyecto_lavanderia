import express from 'express';
import {
    getLaundryWashQueue,
    getLaundryWashQueueById,
    getLaundryWashQueueByOrderId,
    createManyLaundryWashQueue,
    updateLaundryWashQueue,
    deleteLaundryWashQueue,

    getLaundryDryQueue,
    getLaundryDryQueueById,
    getLaundryDryQueueByOrderId,
    createManyLaundryDryQueue,
    updateLaundryDryQueue,
    deleteLaundryDryQueue,

    getIronQueue,
    getIronQueueById,
    getIronQueueByOrderId,
    createManyIronQueue,
    updateIronQueue,
    deleteIronQueue
} from "../controllers/LaundryQueueController.js";

const router = express.Router();

router.get('/laundryWashQueue', getLaundryWashQueue);
router.get('/laundryWashQueueById/:id', getLaundryWashQueueById);
router.get('/laundryWashQueueByOrder/:fk_Order', getLaundryWashQueueByOrderId);
router.post('/laundryWashQueue', createManyLaundryWashQueue);
router.patch('/laundryWashQueue/:id', updateLaundryWashQueue);
router.delete('/laundryWashQueue/:id', deleteLaundryWashQueue);

router.get('/laundryDryQueue', getLaundryDryQueue);
router.get('/laundryDryQueueById/:id', getLaundryDryQueueById);
router.get('/laundryDryQueueByOrder/:fk_Order', getLaundryDryQueueByOrderId);
router.post('/laundryDryQueue', createManyLaundryDryQueue);
router.patch('/laundryDryQueue/:id', updateLaundryDryQueue);
router.delete('/laundryDryQueue/:id', deleteLaundryDryQueue);

router.get('/laundryIronQueue', getIronQueue);
router.get('/laundryIronQueueById/:id', getIronQueueById);
router.get('/laundryIronQueueByOrder/:fk_Order', getIronQueueByOrderId);
router.post('/laundryIronQueue', createManyIronQueue);
router.patch('/laundryIronQueue/:id', updateIronQueue);
router.delete('/laundryIronQueue/:id', deleteIronQueue);

export default router;