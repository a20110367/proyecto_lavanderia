import express from 'express';
import {
    getIronControl,
    getIronControlById,
    getLastIronControl,
    createIronControl,
    updateIronControl,
    updateDiaryIron,
    updateCashCutIron,
    updateTodayIron,
    updateTomorrowIron,
    updateCleanCashCutIron,
    deleteIronControl,
    updateTomorrowIron


} from "../controllers/IronControlController.js";

const router = express.Router();

router.get('/ironControl', getIronControl);
router.get('/ironControl/:id', getIronControlById);
router.get('/lastIronControl/', getLastIronControl);

router.post('/ironControl', createIronControl);

router.patch('/ironControl/:id', updateIronControl);
router.patch('/cahsCutIronControl/', updateCashCutIron);
router.patch('/diaryIronControl/', updateDiaryIron);
router.patch('/todayIronControl/', updateTodayIron);
router.patch('/tomorrowIronControl/', updateTomorrowIron);
router.patch('/cleanCahsCutIronControl/', updateCleanCashCutIron);


router.delete('/ironControl/:id', deleteIronControl);

export default router;