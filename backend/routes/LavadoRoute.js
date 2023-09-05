import express from 'express';
import {
    getLavados,
    getLavadosById,
    createLavado,
    updateLavado,
    deleteLavado
} from "../controllers/LavadoController.js";

const router = express.Router();

router.get('/lavados', getLavados);
router.get('/lavados/:id', getLavadosById);
router.post('/lavados', createLavado);
router.patch('/lavados/:id', updateLavado);
router.delete('/lavados/:id', deleteLavado);

export default router;