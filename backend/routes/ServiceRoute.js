import express from 'express';
import {
    getServices,
    getServicesById,
    getServicesByCategory,
    createService,
    createServiceMany,
    updateService,
    deleteService,
    
} from "../controllers/ServiceController.js";

const router = express.Router();

router.get('/services', getServices);
router.get('/servicesById/:id', getServicesById);
router.get('/servicesByCategoryId/:id', getServicesByCategory);
router.post('/services', createService);
router.post('/servicesMany', createServiceMany);
router.patch('/services/:id', updateService);
router.delete('/services/:id', deleteService);

export default router;