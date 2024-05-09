import express from 'express';
import {
    getIronControl,
    getIronControlById,
    getLastIronControl,
    createIronControl,
    updateIronControl,
    //updateDiaryIron,
    updateIronRegularOrderDone,
    updateIronRegularOrderNew,
    updateIronRegularOrderForTomorrow,
    updateIronExpressOrderNew,
    updateIronExpressOrderDone,
    updateCleanCashCutIron,
    deleteIronControl

} from "../controllers/IronControlController.js";

const router = express.Router();

router.get('/ironControl', getIronControl);
router.get('/ironControl/:id', getIronControlById);
router.get('/lastIronControl', getLastIronControl);
router.get('/newIronControl', createIronControl);

//router.post('/ironControl', createIronControl);

router.patch('/ironControl/:id', updateIronControl);
router.patch('/cahsCutIronControl/:id', updateIronRegularOrderDone);//Este es el que registra los pedidos regulares ya hechos
//router.patch('/diaryIronControl/:id', updateDiaryIron);
router.patch('/todayIronControl/:id', updateIronRegularOrderNew);
router.patch('/tomorrowIronControl/:id', updateIronRegularOrderForTomorrow);
router.patch('/expressNewOrderIronControl/:id', updateIronExpressOrderNew);
router.patch('/expressDoneOrderIronControl/:id', updateIronExpressOrderDone);
router.patch('/cleanCahsCutIronControl/:id', updateCleanCashCutIron);


router.delete('/ironControl/:id', deleteIronControl);

export default router;