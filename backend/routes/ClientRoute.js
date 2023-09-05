import express from 'express';
import {
    getClients,
    getClientsById,
    createClient,
    updateClient,
    deleteClient
} from "../controllers/ClientController.js";

const router = express.Router();

router.get('/clients', getClients);
router.get('/clients/:id', getClientsById);
router.post('/clients', createClient);
router.patch('/clients/:id', updateClient);
router.delete('/clients/:id', deleteClient);

export default router;