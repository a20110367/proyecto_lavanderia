import express from 'express';
import {
    sendMessage,
    n2word
} from "../controllers/MessageController.js";

const router = express.Router();

router.post('/sendMessage', sendMessage);
router.post('/numberToWord', n2word)

export default router;