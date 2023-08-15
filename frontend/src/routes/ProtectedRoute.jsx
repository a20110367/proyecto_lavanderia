import { Outlet, Navigate } from "react-router-dom";

export default function ProtectedRoute({isAuth, children, redirectTo = "/login"}){
    if (!isAuth) {
        return <Navigate to={redirectTo}/>
    }

    return children ? children : <Outlet />
    //return auth.isAuthenticated ? <Outlet /> : <Navigate to="/" />
}