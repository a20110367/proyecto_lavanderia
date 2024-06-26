import express from 'express';
import {
    getCategories,
    getCategoriesById,
    getCategoriesByName,
    createCategory,
    createCategoryMany,
    updateCategory,
    deleteCategoryById,
    deleteCategoryByName,

} from "../controllers/CategoryController.js";

const router = express.Router();

router.get('/categories', getCategories);
router.get('/categoriesId/:id', getCategoriesById);
router.get('/categoriesName/:categoryDescription', getCategoriesByName);
router.post('/categories', createCategory);
router.post('/categoriesMany', createCategoryMany);
router.patch('/categoriesId/:id', updateCategory);
router.delete('/categoriesId/:id', deleteCategoryById);
router.delete('/categoriesName/:categoryDescription', deleteCategoryByName);

export default router;