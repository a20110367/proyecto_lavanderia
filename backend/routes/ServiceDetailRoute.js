import express from 'express';
import {
    getWashServices,
    getWashServicesById,
    createWashService,
    updateWashService,
    deleteWashService,
    getDryServices,
    getDryServicesById,
    createDryService,
    updateDryService,
    deleteDryService,
    getIronServices,
    getIronServicesById,
    createIronService,
    updateIronService,
    deleteIronService,

} from "../controllers/ServiceDetailController.js";

const router = express.Router();

router.get('/washServiceDetails', getWashServices);
router.get('/washServiceDetails/:id', getWashServicesById);
router.post('/washServiceDetails', createWashService);
router.patch('/washServiceDetails/:id', updateWashService);
router.delete('/washServiceDetails/:id', deleteWashService);

router.get('/dryServiceDetails', getDryServices);
router.get('/dryServiceDetails/:id', getDryServicesById);
router.post('/dryServiceDetails', createDryService);
router.patch('/dryServiceDetails/:id', updateDryService);
router.delete('/dryServiceDetails/:id', deleteDryService);

router.get('/ironServiceDetails', getIronServices);
router.get('/ironServiceDetails/:id', getIronServicesById);
router.post('/ironServiceDetails', createIronService);
router.patch('/ironServiceDetails/:id', updateIronService);
router.delete('/ironServiceDetails/:id', deleteIronService);

export default router;