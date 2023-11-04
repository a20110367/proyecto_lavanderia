import express from 'express';
import {
    getMachines,
    getMachinesById,
    createMachine,
    createMachineMany,
    updateMachine,
    deleteMachine

} from "../controllers/MachineController.js";

const router = express.Router();

router.get('/machines', getMachines);
router.get('/machines/:id', getMachinesById);
router.post('/machines', createMachine);
router.post('/machinesMany', createMachineMany);
router.patch('/machines/:id', updateMachine);
router.delete('/machines/:id', deleteMachine);


export default router;