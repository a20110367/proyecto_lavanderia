import express from 'express';
import {
    getIronCuts,
    getIronCutById,
    getLastIronCut,
    createIronCut,
    calculateIronCut,
    updateIronCut,
    deleteIronCut



} from "../controllers/IronCutController.js";

const router = express.Router();

router.get('/ironCuts', getIronCuts);
router.get('/ironCut/:id', getIronCutById);
router.get('/lastIronCut', getLastIronCut);
router.get('/calculateIronCut', calculateIronCut);


router.post('/ironCut', createIronCut);

router.patch('/ironCut/:id', updateIronCut);

router.delete('/ironCut/:id', deleteIronCut);

export default router;