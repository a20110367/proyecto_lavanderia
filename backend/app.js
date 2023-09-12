import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcryptjs from "bcryptjs";

//Rutas de los modelos
import UserRoute from './routes/UserRoute.js';
import ClientRoute from './routes/ClientRoute.js'
import ServiceRoute from './routes/ServiceRoute.js'
import AuthRoute from './routes/AuthRoute.js'

dotenv.config({ path: '.env' });
const app = express();

app.use(cors());
app.use(express.json());

//Uso de rutas de por la aplicación
app.use(UserRoute)
app.use(ClientRoute)
app.use(ServiceRoute)
app.use(AuthRoute)

app.listen(process.env.APP_PORT, (req, res) => {
    console.log('SERVER RUNNING IN http://localhost:5000');
})