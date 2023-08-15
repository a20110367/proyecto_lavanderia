import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import UserRoute from './routes/UserRoute.js';
import bcryptjs from "bcryptjs";

dotenv.config({ path: '.env' });
const app = express();

app.use(cors());
app.use(express.json());
app.use(UserRoute);

app.listen(process.env.APP_PORT, (req, res) => {
    console.log('SERVER RUNNING IN http://localhost:5000');
})