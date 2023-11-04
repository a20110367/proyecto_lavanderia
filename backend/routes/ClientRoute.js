import express from 'express';
import {
    getClients,
    getClientsById,
    createClient,
    createClientMany,
    updateClient,
    deleteClient,
    getClientsByEmail,
    getClientsByPhone
} from "../controllers/ClientController.js";

const router = express.Router();

router.get('/clients', getClients);
router.get('/clientsById/:id', getClientsById);
router.get('/clientsByEmail/:email', getClientsByEmail);
router.get('/clientsByPhone/:phone', getClientsByPhone);
router.post('/clients', createClient);
router.post('/clientsMany', createClientMany);
router.patch('/clients/:id', updateClient);
router.delete('/clients/:id', deleteClient);

export default router;
