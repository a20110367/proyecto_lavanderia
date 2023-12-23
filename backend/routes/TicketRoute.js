import express from 'express';
import {
    generateTicket
} from "../controllers/TicketController.js";

const router = express.Router();

router.post('/generateTicket', generateTicket);

export default router;