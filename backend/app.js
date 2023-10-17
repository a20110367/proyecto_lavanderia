import express from "express";
import cors from "cors";
import dotenv from "dotenv";

//Rutas de los modelos
import UserRoute from './routes/UserRoute.js';
import ClientRoute from './routes/ClientRoute.js'
import ServiceRoute from './routes/ServiceRoute.js'
import MachineRoute from './routes/MachineRoute.js'
import OrderRoute from './routes/OrderRoute.js'
import CategoryRoute from './routes/CategoryRoute.js'
import StaffMemberRoute from './routes/StaffMemberRoute.js'
import CashCutRoute from './routes/CashCutRoute.js'
import PaymentRoute from './routes/PaymentRoute.js'
import DeliveryDetailRoute from './routes/DeliveryDetailRoute.js'
import ServiceTraceDetailRoute from './routes/ServiceTraceDetailRoute.js'
import OrderServiceDetailRoute from './routes/OrderServiceDetailRoute.js'

import MessageRoute from './routes/MessageRoute.js'

dotenv.config({ path: '.env' });
const app = express();

app.use(cors());
app.use(express.json());

//Uso de rutas de por la aplicación
app.use(UserRoute)
app.use(ClientRoute)
app.use(ServiceRoute)
app.use(MachineRoute)
app.use(OrderRoute)
app.use(CategoryRoute)
app.use(StaffMemberRoute)
app.use(CashCutRoute)
app.use(PaymentRoute)
app.use(DeliveryDetailRoute)
app.use(ServiceTraceDetailRoute)
app.use(OrderServiceDetailRoute)

app.use(MessageRoute)


app.listen(process.env.APP_PORT, (req, res) => {
    console.log('SERVER RUNNING IN http://localhost:5000');
})