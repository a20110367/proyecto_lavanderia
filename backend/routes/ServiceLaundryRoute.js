import express from 'express';
import {
    getLaundryServices,
    createLaundryService,
    createLaundryServiceMany,
    updateLaundryService,
    deleteLaundryService,

} from "../controllers/ServiceLaundryController.js";

const router = express.Router();

//router.get('/servicesLaundryById/:id', getServicesById);
router.get('/servicesLaundry', getLaundryServices);

router.post('/servicesLaundry', createLaundryService);
router.post('/servicesLaundryMany', createLaundryServiceMany);

router.patch('/servicesUpdateLaundry/:id', updateLaundryService);

router.delete('/servicesLaundry/:id', deleteLaundryService);

export default router;