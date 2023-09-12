import express from 'express';
import {
    getMachines,
    getMachinesById,
    createMachine,
    updateMachine,
    deleteMachine
} from "../controllers/MachineController.js";

const router = express.Router();

router.get('/machines', getMachines);
router.get('/machines/:id', getMachinesById);
router.post('/machines', createMachine);
router.patch('/machines/:id', updateMachine);
router.delete('/machines/:id', deleteMachine);

export default router;