import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useState } from "react"

//Routes
import Login from './routes/Login'
import Signup from './routes/signup'
import Dashboard from './routes/Dashboard'
import ProtectedRoute from './routes/ProtectedRoute'

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
            {
                user ? (
                    <button onClick={logout}>Logout</button>
                ) : (
                    <button onClick={login}>Login</button>
                )
            }
            <Routes>
                <Route index element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route element={<ProtectedRoute
                    isAuth={!!user && user.role.includes('admin')} />}
                    redirectTo="/login"
                >
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/signup" element={<Signup />} />
                </Route>
            </Routes>
        </Router>
    )
}

export default App