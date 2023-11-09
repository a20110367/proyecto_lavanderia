import express from 'express';
import {
    getServices,
    getServicesById,
    getServicesByCategory,
    getLaundryServices,
    getSelfServiceServices,
    getIronServices,
    createService,
    createLaundryService,
    createSelfServiceWashService,
    createSelfServiceDryService,
    createIronService,
    createServiceMany,
    updateService,
    deleteService,
    
} from "../controllers/ServiceController.js";

const router = express.Router();

router.get('/services', getServices);
router.get('/servicesById/:id', getServicesById);
router.get('/servicesByCategoryId/:id', getServicesByCategory);
router.get('/servicesLaundry', getLaundryServices);
router.get('/servicesSelfService', getSelfServiceServices);
router.get('/servicesIronService', getIronServices);


router.post('/services', createService);
router.post('/servicesLaundry', createLaundryService);
router.post('/servicesWashSelfService', createSelfServiceWashService);
router.post('/servicesDrySelfService', createSelfServiceDryService);
router.post('/servicesIron', createIronService);
router.post('/servicesMany', createServiceMany);


router.patch('/services/:id', updateService);
router.delete('/services/:id', deleteService);

export default router;