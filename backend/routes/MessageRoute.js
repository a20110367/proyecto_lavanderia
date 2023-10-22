import express from 'express';
import {
    sendMessage
} from "../controllers/MessageController.js";

const router = express.Router();

router.post('/sendMessage', sendMessage);

export default router;