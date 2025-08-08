import express from 'express';
import {
    getClothingTypes,
    createClothingTypes,
    createManyClothingTypes,
    updateClothingTypes,
    deleteClothingTypes,
    getClothingColors,
    createClothingColors,
    createManyClothingColors,
    updateClothingColors,
    deleteClothingColors,
    getClothingPrints,
    createClothingPrints,
    createManyClothingPrints,
    updateClothingPrints,
    deleteClothingPrints,
    getClothingFinishes,
    createClothingsFinishes,
    createManyClothingFinishes,
    updateClothingFinishes,
    deleteClothingFinishes,
    getClothingFinishesCatalog,
    getClothingFinishesDetails,
    getClothingFinishesDetailsByOrderId,
    createClothingsFinishesDetail,
    createClothingsFinishesDetails
} from "../controllers/DryCleanDetailsController.js";
const router = express.Router();

//Rutas Tipos de Ropa
router.get('/clothingTypes', getClothingTypes);
router.post('/clothingTypesMany', createManyClothingTypes);
router.post('/clothingTypes', createClothingTypes);
router.patch('/clothingTypes/:id', updateClothingTypes);
router.delete('/clothingTypes/:id', deleteClothingTypes);

//Rutas Colores de Ropa
router.get('/clothingColors', getClothingColors);
router.post('/clothingColorsMany', createManyClothingColors);
router.post('/clothingColors', createClothingColors);
router.patch('/clothingColors/:id', updateClothingColors);
router.delete('/clothingColors/:id', deleteClothingColors);

//Rutas Estampados de Ropa
router.get('/clothingPrints', getClothingPrints);
router.post('/clothingPrintsMany', createManyClothingPrints);
router.post('/clothingPrints', createClothingPrints);
router.patch('/clothingPrints/:id', updateClothingPrints);
router.delete('/clothingPrints/:id', deleteClothingPrints);

//Rutas Terminado de Ropa
router.get('/clothingFinishes', getClothingFinishes);
router.post('/clothingFinishesMany', createManyClothingFinishes);
router.post('/clothingFinishes', createClothingsFinishes);
router.patch('/clothingFinishes/:id', updateClothingFinishes);
router.delete('/clothingFinishes/:id', deleteClothingFinishes);

//Rutas catalogo completo
router.get('/finishesDetailsCatalog', getClothingFinishesCatalog);
router.get('/finishesDetails', getClothingFinishesDetails);
router.get('/finishesDetailsByOrderId/:id', getClothingFinishesDetailsByOrderId);//Este regresa los detalles pero de la orden
router.post('/finishesDetail', createClothingsFinishesDetail);//Un solo detalle, no util realmente
router.post('/finishesDetails', createClothingsFinishesDetails);// Crea varios, regresa un entero, y espera un array en el body

export default router;

