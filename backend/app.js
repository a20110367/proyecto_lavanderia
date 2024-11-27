import express from "express";
import cors from "cors";
import dotenv from "dotenv";

//Rutas de los modelos
import UserRoute from './routes/UserRoute.js';
import ClientRoute from './routes/ClientRoute.js'
//import ServiceRoute from './routes/ServiceRoute.js'
import QueueRoute from './routes/QueueRoute.js'
import ServiceLaundryRoute from './routes/ServiceLaundryRoute.js'
import ServiceIronRoute from './routes/ServiceIronRoute.js'
import ServiceSelfServiceRoute from './routes/ServiceSelfServiceRoute.js'
import MachineRoute from './routes/MachineRoute.js'
import IronStationRoute from './routes/IronStationRoute.js'
import LaundryQueueRoute from './routes/LaundryQueueRoute.js'
import OrderRoute from './routes/OrderRoute.js'
import CategoryRoute from './routes/CategoryRoute.js'
import StaffMemberRoute from './routes/StaffMemberRoute.js'
import CashCutRoute from './routes/CashCutRoute.js'
import PaymentRoute from './routes/PaymentRoute.js'
import DeliveryDetailRoute from './routes/DeliveryDetailRoute.js'
import SelfServiceQueueRoute from './routes/SelfServiceQueueRoute.js'
import ServiceDetailRoute from './routes/ServiceDetailRoute.js'
import ServiceOrderDetailRoute from './routes/ServiceOrderDetailRoute.js'
import CashWithdrawalRoute from './routes/CashWithdrawalRoute.js'
import PettyCashRoute from './routes/PettyCashRoute.js'
import MessageRoute from './routes/MessageRoute.js'
import IronControlRoute from './routes/IronControlRoute.js'
import ServiceDryclean from './routes/ServiceDrycleanRoute.js'
import OtherService from './routes/ServiceOtherServiceRoute.js'
import IronCutRoute from './routes/IronCutRoute.js';

import SupplyRoute from "./routes/SupplyRoute.js";
import SupplyCashCutRoute from "./routes/SupplyCashCutRoute.js";
import SupplyOrderDetailRoute from "./routes/SupplyOrderDetailRoute.js";
import SupplyOrderRoute from "./routes/SupplyOrderRoute.js";
import SupplyPaymentRoute from "./routes/SupplyPaymentRoute.js";

import Ticket from './routes/TicketRoute.js'
import Reports from './routes/ReportsRoute.js'
import LogRoute from './routes/LogRoute.js'

dotenv.config({ path: '.env' });
const app = express();

app.use(cors());
app.use(express.json());

//Uso de rutas de por la aplicación
app.use(LogRoute)

app.use(UserRoute)
app.use(ClientRoute)
app.use(QueueRoute)
//app.use(ServiceRoute)
app.use(ServiceLaundryRoute)
app.use(ServiceIronRoute)
app.use(ServiceSelfServiceRoute)
app.use(MachineRoute)
app.use(IronStationRoute)
app.use(OrderRoute)
app.use(CategoryRoute)
app.use(StaffMemberRoute)
app.use(CashCutRoute)
app.use(PaymentRoute)
app.use(DeliveryDetailRoute)
app.use(LaundryQueueRoute)
app.use(SelfServiceQueueRoute)
app.use(ServiceDetailRoute)
app.use(ServiceOrderDetailRoute)
app.use(CashWithdrawalRoute)
app.use(PettyCashRoute)
app.use(MessageRoute)
app.use(IronControlRoute)
app.use(ServiceDryclean)
app.use(OtherService)
app.use(Ticket)
app.use(SupplyRoute)
app.use(SupplyOrderDetailRoute)
app.use(SupplyPaymentRoute)
app.use(SupplyCashCutRoute)
app.use(SupplyOrderRoute)
app.use(IronCutRoute)
app.use(Reports)

app.listen(process.env.APP_PORT, (req, res) => {
    console.log('SERVER RUNNING IN http://localhost:5000');
})