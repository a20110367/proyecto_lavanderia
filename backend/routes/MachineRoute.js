import express from 'express';
import {
    getMachines,
    getMachinesById,
    createMachine,
    createMachineMany,
    updateMachine,
    deleteMachine,
    updateMachineConfig

} from "../controllers/MachineController.js";

const router = express.Router();

router.get('/machines', getMachines);
router.get('/machines/:id', getMachinesById);
router.post('/machines', createMachine);
router.post('/machinesMany', createMachineMany);
router.patch('/machines/:id', updateMachine);
router.patch('/machines/config/:id', updateMachineConfig);
router.delete('/machines/:id', deleteMachine);


export default router;