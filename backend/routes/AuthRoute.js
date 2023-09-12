import express from 'express';
import {
    authPost
} from "../controllers/AuthController.js";

const router = express.Router();

router.get('/login/authPost/:username,:pass', authPost);

export default router;