import express from 'express';
import {
    authLogin,
    getUsers,
    getUsersById,
    createUser,
    updateUser,
    deleteUser
} from "../controllers/UserController.js";

const router = express.Router();

router.get('/users', getUsers);
router.get('/users/:id', getUsersById);
router.get('/authEmployee/login/:username,:pass', authLogin)
router.post('/users', createUser);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;