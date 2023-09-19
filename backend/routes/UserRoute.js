import express from 'express';
import {
    getUsers,
    getUsersById,
    createUser,
    updateUser,
    deleteUser,
    authUser
} from "../controllers/UserController.js";

const router = express.Router();

router.get('/users', getUsers);
router.get('/users/:id', getUsersById);
router.post('/users', createUser);
router.post('/auth', authUser)
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;