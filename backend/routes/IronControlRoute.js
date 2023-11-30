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
    deleteIronControl



} from "../controllers/IronControlController.js";

const router = express.Router();

router.get('/ironControl', getIronControl);
router.get('/ironControl/:id', getIronControlById);
router.get('/lastIronControl', getLastIronControl);

router.post('/ironControl', createIronControl);

router.patch('/ironControl/:id', updateIronControl);
router.patch('/cahsCutIronControl/:id', updateCashCutIron);
router.patch('/diaryIronControl/:id', updateDiaryIron);
router.patch('/todayIronControl/:id', updateTodayIron);
router.patch('/tomorrowIronControl/:id', updateTomorrowIron);
router.patch('/cleanCahsCutIronControl/:id', updateCleanCashCutIron);


router.delete('/ironControl/:id', deleteIronControl);

export default router;