import express from 'express';
import {
    getWashMachines,
    getWashMachinesById,
    createWashMachine,
    createWashMachineMany,
    updateWashMachine,
    deleteWashMachine,
    getDryMachines,
    getDryMachinesById,
    createDryMachine,
    createDryMachineMany,
    updateDryMachine,
    deleteDryMachine
} from "../controllers/MachineController.js";

const router = express.Router();

router.get('/washMachines', getWashMachines);
router.get('/washMachines/:id', getWashMachinesById);
router.post('/washMachines', createWashMachine);
router.post('/washMachinesMany', createWashMachineMany);
router.patch('/washMachines/:id', updateWashMachine);
router.delete('/washMachines/:id', deleteWashMachine);
router.get('/dryMachines', getDryMachines);
router.get('/dryMachines/:id', getDryMachinesById);
router.post('/dryMachines', createDryMachine);
router.post('/dryMachinesMany', createDryMachineMany);
router.patch('/dryMachines/:id', updateDryMachine);
router.delete('/dryMachines/:id', deleteDryMachine);

export default router;