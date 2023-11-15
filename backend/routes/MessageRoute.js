import express from 'express';
import {
    sendMessage,
    n2word,
    notifyAll
} from "../controllers/MessageController.js";

const router = express.Router();

router.post('/sendMessage', sendMessage);
router.post('/numberToWord', n2word)
router.post('/notifyAll', notifyAll)

export default router;