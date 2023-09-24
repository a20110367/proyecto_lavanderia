import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useState } from "react"
import './index.css'

//Routes
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
import AddService from './components/Service/AddService'
import EditService from "./components/Service/EditService"
import Services from "./components/Service/Services"

//punto venta
import PuntoVenta from "./components/PuntoVenta/PuntoVenta"
import MenuPuntoVenta from "./components/PuntoVenta/MenuPuntoVenta"

//
import Pedidos from "./components/Pedidos/Pedidos"
import PedidosProceso from "./components/Pedidos/PedidosProceso"
import PedidosFinalizados from "./components/Pedidos/PedidosFinaliazdos"
import PedidosLavanderia from "./components/Pedidos/PedidosLavanderia"


import Dashboard from './components/Dashboard'
import Sidebar from "./components/shared/Sidebar"

//equipos
import Equipos from "./components//Equipos/Equipos"
import AddEquipo from './components/Equipos/AddEquipo'
import EditEquipo from "./components/Equipos/EditEquipo"

import Cajas from "./components/Cajas/Cajas"
import CajaEntregas from "./components/Cajas/CajaEntregas"

import CajaDevolucion from "./components/Cajas/CajaDevolucion"
import CajaRetiros from "./components/Cajas/CajaRetiros"

import ProtectedRoute from './routes/ProtectedRoute'
import { useAuth } from './hooks/auth/auth';
import Logout from './routes/Logout'

import EntregaLavanderia from "./components/Lavanderia/EntregaLavanderia"
import RecepcionLavanderia from "./components/Lavanderia/RecepcionLavanderia"

import EntregaPlanchado from "./components/Planchado/EntregaPlanchado"
import RecepcionPlanchado from "./components/Planchado/RecepcionPlanchado"
import PedidosPlanchado from "./components/Pedidos/PedidosPlanchado"
import CorteCajaTurno from "./components/Cajas/CorteCajaTurno"
import CorteCajaParcial from "./components/Cajas/CorteCajaParcial"
import Retiro from "./components/Cajas/Retiro"

function App() {
    const { cookies } = useAuth();

    return (
        <Routes>
            <Route index element={<Navigate to={'/menuPuntoVenta'} />} />
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
                    <Route path="/menuPuntoVenta" element={<MenuPuntoVenta />} />

                    <Route path="/dashboard" element={<Dashboard />} />

                    <Route path="/equipos" element={<Equipos />} />
                    <Route path="/addEquipo" element={<AddEquipo />} />
                    <Route path="/editEquipo/:id" element={<EditEquipo />} />

                    <Route path="/cajas" element={<Cajas />} />
                    <Route path="/cajaEntregas" element={<CajaEntregas />} />
                    <Route path="/cajaDevolucion" element={<CajaDevolucion />} />
                    <Route path="/cajaRetiros" element={<CajaRetiros />} />
                    <Route path="/corteCajaTurno" element={<CorteCajaTurno />} />
                    <Route path="/corteCajaParcial" element={<CorteCajaParcial />} />
                    <Route path="/retiro" element={<Retiro />} />

                    {/* Services */}
                    <Route path="/addService" element={<AddService />} />
                    <Route path="/editService/:id" element={<EditService />} />
                    <Route path="/services" element={<Services />} />

                    {/* Pedidos */}
                    <Route path="/pedidos" element={<Pedidos />} />
                    <Route path="/pedidosProceso" element={<PedidosProceso />} />
                    <Route path="/pedidosFinalizados" element={<PedidosFinalizados />} />
                    <Route path="/pedidosLavanderia" element={<PedidosLavanderia />} />

                    {/*Lavanderia */}
                    <Route path="/entregaLavanderia" element={<EntregaLavanderia />} />
                    <Route path="/recepcionLavanderia" element={<RecepcionLavanderia />} />
                    <Route path="/pedidosPlanchado" element={<PedidosPlanchado />} />

                    {/*Planchado */}
                    <Route path="/entregaPlanchado" element={<EntregaPlanchado />} />
                    <Route path="/recepcionPlanchado" element={<RecepcionPlanchado />} />



                    {/* Clients */}
                    <Route path="/addClient" element={
                        <ProtectedRoute
                            isAuth={cookies.role === 'admin'} redirectTo='/menuPuntoVenta'
                        >
                            <AddClient />
                        </ProtectedRoute>
                    } />
                    <Route path="/editClient/:id" element={
                        <ProtectedRoute
                            isAuth={cookies.role === 'admin'} redirectTo='/menuPuntoVenta'
                        >
                            <EditClient />
                        </ProtectedRoute>
                    } />
                    <Route path="/clients" element={
                        <ProtectedRoute
                            isAuth={cookies.role === 'admin'} redirectTo='/menuPuntoVenta'
                        >
                            <Clients />
                        </ProtectedRoute>
                    } />

                    {/* Empleados */}
                    <Route path="/addUser" element={
                        <ProtectedRoute
                            isAuth={cookies.role === 'admin'} redirectTo='/menuPuntoVenta'
                        >
                            <AddUser />
                        </ProtectedRoute>
                    } />
                    <Route path="/editUser/:id" element={
                        <ProtectedRoute
                            isAuth={cookies.role === 'admin'} redirectTo='/menuPuntoVenta'
                        >
                            <EditUser />
                        </ProtectedRoute>
                    } />
                    <Route path="/users" element={
                        <ProtectedRoute
                            isAuth={cookies.role === 'admin'} redirectTo='/menuPuntoVenta'
                        >
                            <Users />
                        </ProtectedRoute>
                    } />
                </Route>
            </Route>
        </Routes>
    )
}

export default App