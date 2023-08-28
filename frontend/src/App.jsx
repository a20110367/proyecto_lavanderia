import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useState } from "react"

//Routes
import Login from './routes/Login'
import Signup from './routes/signup'
import Dashboard from './components/Dashboard'
import ProtectedRoute from './routes/ProtectedRoute'
import Layout from "./components/shared/Layout"
import Equipos from "./components/Equipos"
import Cajas from "./components/Cajas"

function App() {
    const [user, setUser] = useState(null)

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
            {/*{
                user ? (
                    <button onClick={logout}>Logout</button>
                ) : (
                    <button onClick={login}>Login</button>
                )
            }*/}
            <Routes>
               <Route index element={<Login />} />
                <Route path="/login" element={<Login />} />
                   {/*<Route element={<ProtectedRoute
                    isAuth={!!user && user.role.includes('admin')} />}
                    redirectTo="/login"
                >
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/signup" element={<Signup />} />
                   </Route>*/}
                
                <Route path = "/" element = {<Layout/>}>
                    <Route path = "/dashboard" element = {<Dashboard/>}/>
                    <Route path = "/equipos" element = {<Equipos />}/>
                    <Route path = "/cajas" element = {<Cajas />}/>
                </Route>
            </Routes>
        </Router>
    )
}

export default App