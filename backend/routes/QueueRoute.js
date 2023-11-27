import express from 'express';
import {
    getLaundryQueue,
    getLaundryQueueById,
    getLaundryQueueByOrderId,
    createManyLaundryQueue,
    updateLaundryQueue,
    updateWashDetails,
    updateDryDetails,
    finishLaundryQueue,
    deleteLaundryQueue,

    getSelfServiceQueue,
    getSelfServiceQueueById,
    getSelfServiceQueueByOrderId,
    createManySelfServiceQueue,
    updateSelfServiceQueue,
    deleteSelfServiceQueue,

    getIronQueue,
    getIronQueueById,
    getIronQueueByOrderId,
    createManyIronQueue,
    updateIronQueue,
    deleteIronQueue
} from "../controllers/QueueController.js";

const router = express.Router();

router.get('/laundryQueue', getLaundryQueue);
router.get('/laundryQueueById/:id', getLaundryQueueById);
router.get('/laundryQueueByOrder/:fk_Order', getLaundryQueueByOrderId);
//router.post('/laundryWashQueue', createManyLaundryQueue);
router.patch('/laundryQueue/:id', updateLaundryQueue);
router.patch('/updateWashDetails/:id', updateWashDetails);
router.patch('/updateDryDetails/:id', updateDryDetails);
router.patch('/finishLaundryQueue/:id', finishLaundryQueue);
router.delete('/laundryWashQueue/:id', deleteLaundryQueue);

router.get('/selfServiceQueue', getSelfServiceQueue);
router.get('/selfServiceQueueById/:id', getSelfServiceQueueById);
router.get('/selfServiceQueueByOrder/:fk_Order', getSelfServiceQueueByOrderId);
//router.post('/selfServiceQueue', createManySelfServiceQueue);
router.patch('/selfServiceQueue/:id', updateSelfServiceQueue);
router.delete('/selfServiceQueue/:id', deleteSelfServiceQueue);

router.get('/ironQueue', getIronQueue);
router.get('/ironQueueById/:id', getIronQueueById);
router.get('/ironQueueByOrder/:fk_Order', getIronQueueByOrderId);
//router.post('/ironQueue', createManyIronQueue);
router.patch('/ironQueue/:id', updateIronQueue);
router.delete('/ironQueue/:id', deleteIronQueue);

router.post('/')

export default router;