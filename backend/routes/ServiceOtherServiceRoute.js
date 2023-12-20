import express from 'express';
import {
    getOtherServices,
    getOtherServicesById,
    createOtherService,
    createOtherServiceMany,
    updateOtherService,
    deleteOtherService,

} from "../controllers/ServiceOtherServiceController.js";

const router = express.Router();

//router.get('/servicesOtherServiceById/:id', getServicesById);
router.get('/servicesOtherService', getOtherServices);
router.get('/servicesOtherService/:id', getOtherServicesById);

router.post('/servicesOtherService', createOtherService);
router.post('/servicesOtherServiceMany', createOtherServiceMany);

router.patch('/servicesUpdateOtherService/:id', updateOtherService);

router.delete('/servicesOtherService/:id', deleteOtherService);

export default router;