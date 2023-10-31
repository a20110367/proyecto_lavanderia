import express from 'express';
import {
    getServices,
    getServicesById,
    createService,
    createServiceMany,
    updateService,
    updateServiceCategory,
    deleteService,
    
} from "../controllers/ServiceController.js";

const router = express.Router();

router.get('/services', getServices);
router.get('/servicesById/:id', getServicesById);
router.post('/services', createService);
router.post('/servicesMany', createServiceMany);
router.patch('/services/:id', updateService);
router.patch('/servicesCategory/:id', updateServiceCategory);
router.delete('/services/:id', deleteService);

export default router;