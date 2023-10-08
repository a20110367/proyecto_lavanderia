import express from 'express';
import {
    getCategories,
    getCategoriesById,
    getCategoriesByName,
    createCategory,
    deleteCategoryById,
    deleteCategoryByName,

} from "../controllers/CategoryController.js";

const router = express.Router();

router.get('/categories', getCategories);
router.get('/categoriesId/:id', getCategoriesById);
router.get('/categoriesName/:cateforyDes', getCategoriesByName);
router.post('/categories', createCategory);
router.delete('/categoriesId/:id', deleteCategoryById);
router.delete('/categoriesName/:cateforyDes', deleteCategoryByName);

export default router;