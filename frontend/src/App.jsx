import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useState } from "react"

//Routes
import Login from './routes/Login'

//Usuarios
import AddUser from './components/AddUser'
import EditUser from './components/EditUser'
import Users from './components/Users'

//Usuarios
import AddClient from './components/AddUser'
import EditClient from './components/EditUser'
import Clients from './components/Users'

import Dashboard from './components/Dashboard'
import ProtectedRoute from './routes/ProtectedRoute'
import Layout from "./components/shared/Layout"
import Equipos from "./components/Equipos"
import Cajas from "./components/Cajas"

import './index.css'

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
                    <Route path = "/" element = {<Layout/>}>
                        <Route path = "/dashboard" element = {<Dashboard/>}/>
                        <Route path = "/equipos" element = {<Equipos />}/>
                        <Route path = "/cajas" element = {<Cajas />}/>
                        {/* Users */}
                        <Route path="/addUser" element={<AddUser />} />
                        <Route path="/editUser/:id" element={<EditUser />} />
                        <Route path="/users" element={<Users />} />
                        {/* Clients */}
                        <Route path="/addClient" element={<AddClient />} />
                        <Route path="/editClient/:id" element={<EditClient />} />
                        <Route path="/clients" element={<Clients />} />
                    </Route>

                    
                </Route>
                
                
            </Routes>
        </Router>
    )
}

export default App