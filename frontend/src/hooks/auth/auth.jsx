import { createContext, useContext, useMemo } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const navigate = useNavigate();
    const [cookies, setCookies, removeCookie] = useCookies();

    const login = async ({ user, pass }) => {
        const res = await Axios.post("http://localhost:5000/auth", {
            username: user,
            pass: pass
        });

        setCookies('token', res.data.id_user, { path: '/' }); // your token
        setCookies('role', res.data.role, { path: '/' }); // optional data

        navigate('/menuPuntoVenta');
    };

    const logout = () => {
        ['token', 'role'].forEach(obj => removeCookie(obj)); // remove data save in cookies
        navigate('/login');
    };

    const value = useMemo(
        () => ({
            cookies,
            login,
            logout
        }),
        [cookies]
    );

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
};

export const useAuth = () => {
    return useContext(UserContext)
};
