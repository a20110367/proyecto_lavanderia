import { Routes, Route, Navigate } from "react-router-dom"
import './index.css'

//IMPORTANT
import Settings from './routes/Settings'
import ProtectedRoute from './routes/ProtectedRoute'
import { useAuth } from './hooks/auth/auth';
import Logout from './routes/Logout'
import Login from './routes/Login'

//Usuarios
import AddUser from './components/User/AddUser'
import EditUser from './components/User/EditUser'
import Users from './components/User/Users'

//Usuarios
import AddClient from './components/Client/AddClient'
import EditClient from './components/Client/EditClient'
import Clients from './components/Client/Clients'

//Servicios
import ServicesLavanderia from "./components/Service/ServicesLavanderia"
import AddServiceLavanderia from './components/Service/AddServiceLavanderia'
import EditServiceLavanderia from './components/Service/EditServiceLavanderia'

//Tintoreria
import ServicesTintoreria from "./components/Service/ServicesTintoreria"
import AddServiceTintoreria from "./components/Service/AddServiceTintoreria"
import EditServiceTintoreria from "./components/Service/EditServiceTintoreria"

//POS
import PuntoVenta from "./components/PuntoVenta/PuntoVenta"
import AutoServicio from "./components/Lavanderia/AutoServicio"
import SupplyPOS from './components/PuntoVenta/SupplyPOS'

//PEDIDOS
import PedidosLavanderia from "./components/Pedidos/PedidosLavanderia"
import PedidosGeneral from "./components/Pedidos/PedidosGeneral"
import PedidosAlmacenados from "./components/Pedidos/PedidosAlmacenados"

//SIDEBAR
import Sidebar from "./components/shared/Sidebar"

//EQUIPOS
import Equipos from "./components//Equipos/Equipos"
import AddEquipo from './components/Equipos/AddEquipo'
import EditEquipo from "./components/Equipos/EditEquipo"
import ActivarEquipos from "./components//Equipos/ActivarEquipos"

//PLANCHAS
import Planchas from "./components/Equipos/Planchas"
import AddPlancha from "./components/Equipos/AddPlanchas"
import EditPlancha from "./components/Equipos/EditPlancha"

//CAJA
import InicioCaja from "./components/Cajas/InicioCaja"
import HistorialCaja from "./components/Cajas/HistorialCaja"
import CajaPedidos from "./components/Cajas/CajaPedidos"
import CorteCaja from "./components/Cajas/CorteCaja"
import Retiro from "./components/Cajas/Retiro"

//COLA PEDIDOS
import EntregaLavanderia from "./components/Lavanderia/EntregaLavanderia"
import RecepcionLavanderia from "./components/Lavanderia/RecepcionLavanderia"

// PLANCHADO
import EntregaPlanchado from "./components/Planchado/EntregaPlanchado"
import RecepcionPlanchado from "./components/Planchado/RecepcionPlanchado"
import PedidosPlanchado from "./components/Pedidos/PedidosPlanchado"
import ServicesPlanchado from "./components/Service/ServicesPlanchado"
import AddServicePlanchado from "./components/Service/AddServicePlanchado"
import EditServicePlanchado from "./components/Service/EditServicePlanchado"

// AUTOSERVICIO
import PedidosAutoservicio from "./components/Pedidos/PedidosAutoservicio"
import ServicesAutoservicio from "./components/Service/ServicesAutoservicio"
import AddServiceAutoservicio from "./components/Service/AddServiceAutoservicio"
import EditServiceAutoservicio from "./components/Service/EditServiceAutoservicio"

// TINTORERIA
import EntregaTintoreria from "./components/Tintoreria/EntregaTintoreria"
import RecepcionTintoreria from "./components/Tintoreria/RecepcionTintoreria"
import PedidosTintoreria from "./components/Pedidos/PedidosTintoreria"

// VARIOS
import ServicesVarios from "./components/Service/ServicesVarios"
import AddServiceVarios from "./components/Service/AddServiceVarios"
import EditServiceVarios from "./components/Service/EditServiceVarios"
import PedidosVarios from "./components/Pedidos/PedidosVarios"
import RecepcionVarios from "./components/EncargoVarios/RecepcionVarios"
import EntregaVarios from "./components/EncargoVarios/EntregaVarios"

// PRODUCTOS
import RecepcionProductos from "./components/Productos/RecepcionProductos"
import Productos from "./components/Productos/Productos"
import AddProductos from "./components/Productos/AddProductos"
import EditProductos from "./components/Productos/EditProductos"
import BuscarPedidos from "./components/Pedidos/BuscarPedidos"
import HistorialCajaProductos from "./components/Cajas/HistorialCajaProductos";
import HistorialCajaPlanchado from "./components/Cajas/HistorialCajaPlanchado";

// ADMINISTRACION
// import ReportesProductos from "./components/Administracion/ReportesProductos";
import Reportes from "./components/Administracion/Reportes"
import Cancelacion from "./components/Administracion/Cancelacion";
import CajaChica from "./components/Administracion/CajaChica"
import Reembolso from "./components/Administracion/Reembolso"

function App() {
    const { cookies } = useAuth();

    return (
        <Routes>
            <Route index element={<Navigate to={'/autoServicio'} />} />
            <Route path="/login" element={<Login />} />

            {/* Rutas Protegidas */}
            <Route element={<ProtectedRoute
                isAuth={!!cookies.token} />}
                redirectTo="/login"
            >
                <Route path="/" element={<Sidebar />}>
                    <Route path="/logout" element={<Logout />} />

                    {/*Punto de venta */}
                    <Route path="/puntoVenta" element={<PuntoVenta />} />
                    <Route path="/puntoVentaProductos" element={<SupplyPOS/>} />
                    <Route path="/autoServicio" element={<AutoServicio />} />

                    <Route path="/equipos" element={<Equipos />} />
                    <Route path="/addEquipo" element={<AddEquipo />} />
                    <Route path="/editEquipo/:id" element={<EditEquipo />} />
                    <Route path="/activarEquipos" element={<ActivarEquipos />} />

                    <Route path="/planchas" element={<Planchas />} />
                    <Route path="/addPlancha" element={<AddPlancha />} />
                    <Route path="/editPlancha/:id" element={<EditPlancha />} />

                    <Route path="/corteCaja" element={<CorteCaja />} />
                    <Route path="/inicioCaja" element={<InicioCaja />} />
                    <Route path="/HistorialCaja" element={<HistorialCaja />} />
                    <Route path="/HistorialCajaProductos" element={<HistorialCajaProductos />} />
                    <Route path="/HistorialCajaPlanchado" element={<HistorialCajaPlanchado />} />
                    <Route path="/reportes" element={<Reportes />} />
                    {/* <Route path="/reportesProductos" element={<ReportesProductos />} /> */}
                    <Route path="/cancelacion" element={<Cancelacion/>}/>
                    <Route path="/retiro" element={<Retiro />} />
                    <Route path="/cajaChica" element={<CajaChica />} />
                    <Route path="/reembolso" element={<Reembolso />} />
                    <Route path="/cajaPedidos" element={<CajaPedidos />} />

                    {/* Services */}


                    <Route path="/servicesLavanderia" element={<ServicesLavanderia />} />
                    <Route path="/addServiceLavanderia" element={<AddServiceLavanderia />} />
                    <Route path="/editServiceLavanderia/:id" element={<EditServiceLavanderia />} />

                    <Route path="/ServicesTintoreria" element={<ServicesTintoreria />} />
                    <Route path="/addServiceTintoreria" element={<AddServiceTintoreria />} />
                    <Route path="/editServiceTintoreria/:id" element={<EditServiceTintoreria />} />

                    <Route path="/servicesPlanchado" element={<ServicesPlanchado />} />
                    <Route path="/addServicePlanchado" element={<AddServicePlanchado />} />
                    <Route path="/editServicePlanchado/:id" element={<EditServicePlanchado />} />

                    <Route path="/servicesAutoservicio" element={<ServicesAutoservicio />} />
                    <Route path="/addServiceAutoservicio" element={<AddServiceAutoservicio />} />
                    <Route path="/editServiceAutoservicio/:id" element={<EditServiceAutoservicio />} />

                    <Route path="/servicesVarios" element={<ServicesVarios />} />
                    <Route path="/addServiceVarios" element={<AddServiceVarios />} />
                    <Route path="/editServiceVarios/:id" element={<EditServiceVarios />} />


                    {/* Pedidos */}
                    <Route path="/pedidosLavanderia" element={<PedidosLavanderia />} />
                    <Route path="/pedidosAutoservicio" element={<PedidosAutoservicio />} />
                    <Route path="/pedidosAlmacenados" element={<PedidosAlmacenados />} />
                    <Route path="/buscarPedidos" element={<BuscarPedidos />} />

                    {/*Lavanderia */}
                    <Route path="/entregaLavanderia" element={<EntregaLavanderia />} />
                    <Route path="/recepcionLavanderia" element={<RecepcionLavanderia />} />
                    <Route path="/pedidosPlanchado" element={<PedidosPlanchado />} />
                    <Route path="/pedidosGeneral" element={<PedidosGeneral />} />
                    
                    {/**Encargo varios */}
                    <Route path="/pedidosVarios" element={<PedidosVarios/>}/>
                    <Route path="/recepcionVarios" element={<RecepcionVarios/>}/>
                    <Route path="/entregaVarios" element={<EntregaVarios/>}/>

                    {/*Planchado */}
                    <Route path="/entregaPlanchado" element={<EntregaPlanchado />} />
                    <Route path="/recepcionPlanchado" element={<RecepcionPlanchado />} />
                    <Route path="/addClient" element={<AddClient/>}/>
                    <Route path="/settings" element={<Settings/>}/>

                    {/*Tintoreria */}
                    <Route path="/entregaTintoreria" element={<EntregaTintoreria />} />
                    <Route path="/recepcionTintoreria" element={<RecepcionTintoreria/>} />
                    <Route path="/pedidosTintoreria" element={<PedidosTintoreria/>} />

                    {/*Productos */}
                    <Route path="/productos" element={<Productos />} />
                    <Route path="/addProductos" element={<AddProductos />} />
                    <Route path="/editProductos/:id" element={<EditProductos />} />
                    <Route path="/recepcionProductos" element={<RecepcionProductos />} />

                    {/* Clients */}
                    {/* <Route path="/addClient" element={
                        <ProtectedRoute
                            isAuth={cookies.role === 'admin'} redirectTo='/menuPuntoVenta'
                        >
                            <AddClient />
                        </ProtectedRoute>
                    } /> */}
                    <Route path="/editClient/:id" element={
                        <ProtectedRoute
                            isAuth={cookies.role === 'admin'} redirectTo='/autoServicio'
                        >
                            <EditClient />
                        </ProtectedRoute>
                    } />
                    <Route path="/clients" element={
                        <ProtectedRoute
                            isAuth={cookies.role === 'admin'} redirectTo='/autoServicio'
                        >
                            <Clients />
                        </ProtectedRoute>
                    } />

                    {/* Empleados */}
                    <Route path="/addUser" element={
                        <ProtectedRoute
                            isAuth={cookies.role === 'admin'} redirectTo='/autoServicio'
                        >
                            <AddUser />
                        </ProtectedRoute>
                    } />
                    <Route path="/editUser/:id" element={
                        <ProtectedRoute
                            isAuth={cookies.role === 'admin'} redirectTo='/autoServicio'
                        >
                            <EditUser />
                        </ProtectedRoute>
                    } />
                    <Route path="/users" element={
                        <ProtectedRoute
                            isAuth={cookies.role === 'admin'} redirectTo='/autoServicio'
                        >
                            <Users />
                        </ProtectedRoute>
                    } />
                    <Route path="/settings" element={
                        <ProtectedRoute
                            isAuth={cookies.role === 'admin'} redirectTo='/autoServicio'
                        >
                            <Settings />
                        </ProtectedRoute>
                    } />
                </Route>
            </Route>
        </Routes>
    )
}

export default App