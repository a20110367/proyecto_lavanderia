import express from 'express';
import {
    getWorkshiftBalances,
    getActiveWorkshiftBalances,
    getWorkshiftBalanceById,
    getLastWorkshiftBalance,
    createWorkshiftBalance,
    updateWorkshiftBalance,
    deleteWorkshiftBalance,
} from "../controllers/WorkshiftBalanceController.js";

const router = express.Router();

router.get('/workshiftBalances', getWorkshiftBalances);
router.get('/activeWorkshiftBalances', getActiveWorkshiftBalances);
router.get('/workshiftBalances/:id', getWorkshiftBalanceById);
router.get('/lastWorkshiftBalances/', getLastWorkshiftBalance);

router.get('/createWorkshiftBalances', createWorkshiftBalance);

router.patch('/workshiftBalances/:id', updateWorkshiftBalance);

router.delete('/workshiftBalances/:id', deleteWorkshiftBalance);

export default router;