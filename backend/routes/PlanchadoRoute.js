import express from 'express';
import {
    getPlanchados,
    getPlanchadosById,
    createPlanchado,
    updatePlanchado,
    deletePlanchado
} from "../controllers/PlanchadoController.js";

const router = express.Router();

router.get('/planchados', getPlanchados);
router.get('/planchados/:id', getPlanchadosById);
router.post('/planchados', createPlanchado);
router.patch('/planchados/:id', updatePlanchado);
router.delete('/planchados/:id', deletePlanchado);

export default router;