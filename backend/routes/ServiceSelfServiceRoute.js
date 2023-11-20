import express from 'express';
import {
    getSelfServices,
    getSelfServicesById,
    createSelfService,
    createSelfServiceMany,
    updateSelfService,
    deleteSelfService,

} from "../controllers/ServiceSelfServiceController.js";

const router = express.Router();

//router.get('/servicesSelfServiceById/:id', getServicesById);
router.get('/servicesSelfService', getSelfServices);
router.get('/servicesSelfService/:id', getSelfServicesById);

router.post('/servicesSelfService', createSelfService);
router.post('/servicesSelfServiceMany', createSelfServiceMany);

router.patch('/servicesUpdateSelfService/:id', updateSelfService);

router.delete('/servicesSelfService/:id', deleteSelfService);

export default router;