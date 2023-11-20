import express from 'express';
import {
    getIronServices,
    getIronServicesById,
    createIronService,
    createIronServiceMany,
    updateIronService,
    deleteIronService,

} from "../controllers/ServiceIronController.js";

const router = express.Router();

//router.get('/servicesIronById/:id', getServicesById);
router.get('/servicesIron', getIronServices);
router.get('/servicesIron/:id', getIronServicesById);

router.post('/servicesIron', createIronService);
router.post('/servicesIronMany', createIronServiceMany);

router.patch('/servicesUpdateIron/:id', updateIronService);

router.delete('/servicesIron/:id', deleteIronService);

export default router;