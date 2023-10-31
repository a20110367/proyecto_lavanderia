import express from 'express';
import {
    getIronStations,
    getIronStationsById,
    createIronStation,
    updateIronStation,
    deleteIronStation
} from "../controllers/IronStationController.js";

const router = express.Router();

router.get('/ironStations', getIronStations);
router.get('/ironStations/:id', getIronStationsById);
router.post('/ironStations', createIronStation);
router.patch('/ironStations/:id', updateIronStation);
router.delete('/ironStations/:id', deleteIronStation);

export default router;