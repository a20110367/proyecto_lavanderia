import express from 'express';
import {
    getUsers,
    getUsersById,
    createUser,
    createUserMany,
    updateUser,
    deleteUser,
    authUser,
    recoverPwd
} from "../controllers/UserController.js";

const router = express.Router();

router.get('/users', getUsers);
router.get('/users/:id', getUsersById);
router.post('/users', createUser);
router.post('/usersMany', createUserMany);
router.post('/auth', authUser); //este no se que pedo
router.post('/user/recoverPassword', recoverPwd);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;
createUserMany