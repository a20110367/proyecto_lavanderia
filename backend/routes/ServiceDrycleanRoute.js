import express from 'express';
import {
    getDrycleanServices,
    getDrycleanServicesById,
    createDrycleanService,
    createDrycleanServiceMany,
    updateDrycleanService,
    deleteDrycleanService,

} from "../controllers/ServiceDrycleanController.js";

const router = express.Router();

//router.get('/servicesDrycleanById/:id', getServicesById);
router.get('/servicesDryclean', getDrycleanServices);
router.get('/servicesDryclean/:id', getDrycleanServicesById);

router.post('/servicesDryclean', createDrycleanService);
router.post('/servicesDrycleanMany', createDrycleanServiceMany);

router.patch('/servicesUpdateDryclean/:id', updateDrycleanService);

router.delete('/servicesDryclean/:id', deleteDrycleanService);

export default router;