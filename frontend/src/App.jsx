import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useState } from "react"

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

import Dashboard from './components/Dashboard'
import ProtectedRoute from './routes/ProtectedRoute'
import Sidebar from "./components/shared/Sidebar"

//equipos
import Equipos from "./components//Equipos/Equipos"
import AddEquipo from "./components/Equipos/AddEquipo"
import EditEquipo from "./components/Equipos/EditEquipo"

import Cajas from "./components/Cajas/Cajas"
import CajaEntregas from "./components/Cajas/CajaEntregas"

import './index.css'
import CajaDevolucion from "./components/Cajas/CajaDevolucion"
import CajaRetiros from "./components/Cajas/CajaRetiros"

function App() {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState();

    const login = () => {
        setUser({
            id: 1,
            name: "John",
            role: "admin"
        })
    }

    const logout = () => setUser(null)

    return (
        <Router>
            {
                user ? (
                    <button onClick={logout}>Logout</button>
                ) : (
                    <button onClick={login}>Login</button>
                )
            }
            <Routes>
            
            <Route index element={<Login />} />
                <Route path="/login" setToken={setToken} element={<Login />} />

                {/* Rutas Protejidas */}
                <Route element={<ProtectedRoute
                    isAuth={!!user && user.role.includes('admin')} />}
                    redirectTo="/login"
                >
                    <Route path = "/" element = {<Sidebar/>}>
                        {/*Punto de venta */}
                        <Route path="/puntoVenta" element={<PuntoVenta/>}/>
                        <Route path="/menuPuntoVenta" element={<MenuPuntoVenta/>}/>

                        
                        <Route path = "/dashboard" element = {<Dashboard/>}/>
                        
                        <Route path = "/equipos" element = {<Equipos />}/>
                        <Route path = "/addEquipo" element = {<AddEquipo/>}/>
                        <Route path = "/editEquipo/:id" element = {<EditEquipo/>}/>
                        
                        <Route path = "/cajas" element = {<Cajas />}/>
                        <Route path = "/cajaEntregas" element = {<CajaEntregas />}/>
                        <Route path = "/cajaDevolucion" element = {<CajaDevolucion />}/>
                        <Route path = "/cajaRetiros" element = {<CajaRetiros />}/>
                        {/* Users */}
                        <Route path="/addUser" element={<AddUser />} />
                        <Route path="/editUser/:id" element={<EditUser />} />
                        <Route path="/users" element={<Users />} />
                        {/* Clients */}
                        <Route path="/addClient" element={<AddClient />} />
                        <Route path="/editClient/:id" element={<EditClient />} />
                        <Route path="/clients" element={<Clients />} />
                        {/* Services */}
                        <Route path="/addService" element={<AddService/>}/>
                        <Route path="/editService/:id" element={<EditService/>}/>
                        <Route path="/services" element={<Services/>}/>

                        <Route path="/pedidos" element={<Pedidos/>}/>
                        <Route path="/pedidosProceso" element={<PedidosProceso/>}/>
                        <Route path="/pedidosFinalizados" element={<PedidosFinalizados/>}/>
                    </Route>

                    
                </Route>
                
                
            </Routes>
        </Router>
    )
}

export default App