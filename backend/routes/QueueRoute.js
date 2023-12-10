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
    updateStartSelfServiceQueue,
    updateFinishSelfServiceQueue,
    updateSelfServiceQueue,
    deleteSelfServiceQueue,

    getIronQueue,
    getIronQueueById,
    getIronQueueByOrderId,
    createManyIronQueue,
    startIronQueue,
    finishIronQueue,
    updateIronQueue,
    deleteIronQueue,

    getDrycleanQueue,
    getDrycleanQueueById,
    getDrycleanQueueByOrderId,
    createManyDrycleanQueue,
    deliveryDrycleanQueue,
    receptionDrycleanQueue,
    updateDrycleanQueue,
    deleteDrycleanQueue
    
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
router.delete('/laundryQueue/:id', deleteLaundryQueue);

router.get('/selfServiceQueue', getSelfServiceQueue);
router.get('/selfServiceQueueById/:id', getSelfServiceQueueById);
router.get('/selfServiceQueueByOrder/:fk_Order', getSelfServiceQueueByOrderId);
//router.post('/selfServiceQueue', createManySelfServiceQueue);
router.patch('/startSelfServiceQueue/:id', updateStartSelfServiceQueue);
router.patch('/finishSelfServiceQueue/:id', updateFinishSelfServiceQueue);
router.delete('/selfServiceQueue/:id', deleteSelfServiceQueue);

router.get('/ironQueue', getIronQueue);
router.get('/ironQueueById/:id', getIronQueueById);
router.get('/ironQueueByOrder/:fk_Order', getIronQueueByOrderId);
//router.post('/ironQueue', createManyIronQueue);
router.patch('/startIronQueue/:id', startIronQueue);
router.patch('/finishIronQueue/:id', finishIronQueue);
router.patch('/ironQueue/:id', updateIronQueue);
router.delete('/ironQueue/:id', deleteIronQueue);

router.get('/drycleanQueue', getDrycleanQueue);
router.get('/drycleanQueueById/:id', getDrycleanQueueById);
router.get('/drycleanQueueByOrder/:fk_Order', getDrycleanQueueByOrderId);
//router.post('/drycleanQueue', createManydrycleanQueue);
router.patch('/deliveryDrycleanQueue/:id', deliveryDrycleanQueue);
router.patch('/receptionDrycleanQueue/:id', receptionDrycleanQueue);
router.patch('/drycleanQueue/:id', updateDrycleanQueue);
router.delete('/drycleanQueue/:id', deleteDrycleanQueue);

export default router;