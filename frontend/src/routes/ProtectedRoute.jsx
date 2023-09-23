import { Outlet, Navigate } from 'react-router-dom';
// import { useAuth } from '../hooks/auth/auth';

export default function ProtectedRoute ({isAuth, children, redirectTo = '/login'}) {
    if (!isAuth) {
        return <Navigate to={redirectTo}/>
    }

    return children ? children : <Outlet/>
    // return !isAuth ? <Navigate to={redirectTo}/> : <Outlet/>
    // const { cookies } = useAuth();
    // return cookies.token ? <Outlet/> : <Navigate to='/login' exact />
};

// export default function ProtectedRoute({isAuth, children, redirectTo = "/login"}){
//     if (!isAuth) {
//         return <Navigate to={redirectTo}/>
//     }

//     return children ? children : <Outlet />
//     //return auth.isAuthenticated ? <Outlet /> : <Navigate to="/" />
// }