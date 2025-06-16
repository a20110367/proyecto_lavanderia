import express from 'express';
import {
    writeToLogFile,
} from "../controllers/LogController.js";

const router = express.Router();

router.post('/log/write', writeToLogFile);

export default router;