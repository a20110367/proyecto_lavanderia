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

router.patch('/ironControl/:id', updateIronControl);

router.patch('/updateIronRegularOrderNew/:id', updateIronRegularOrderNew);
router.patch('/updateIronRegularOrderForTomorrow/:id', updateIronRegularOrderForTomorrow);
router.patch('/expressNewOrderIronControl/:id', updateIronExpressOrderNew);

router.patch('/updateIronRegularOrderDone/:id', updateIronRegularOrderDone);//Este es el que registra los pedidos regulares ya hechos
router.patch('/expressDoneOrderIronControl/:id', updateIronExpressOrderDone);

router.patch('/cleanCashCutIronControl/:id', updateCleanCashCutIron);


router.delete('/ironControl/:id', deleteIronControl);

export default router;