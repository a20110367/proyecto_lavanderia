import { createContext, useContext, useMemo } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import moment from 'moment'
import api from '../../api/api'
import { getLastIronControl } from '../../../../backend/controllers/IronControlController';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const navigate = useNavigate();
    const [cookies, setCookies, removeCookie] = useCookies();

    const login = async ({ user, pass }) => {
        const res = await api.post("/auth", {
            username: user,
            pass: pass
        });
        localStorage.clear()

        setCookies('token', res.data.id_user, { path: '/' }); // your token
        setCookies('username', res.data.username, { path: '/' }); // optional data
        setCookies('role', res.data.role, { path: '/' }); // optional data

        const lastIronControl = await api.get('/lastIronControl')
        const now = moment()
        const lastIronControlDate  = moment(lastIronControl)
        const diff = now.diff(lastIronControlDate, 'days');
        // const diff = 1
        // console.log(now)
        // console.log(lastIronControlDate)
        console.log(diff)
        // console.log(lastIronControl.data)
        if (!lastIronControl || lastIronControl.data.length === 0) {
            const res = await api.post("/ironControl", {
                piecesToday: 0,
            });
            localStorage.setItem('lastIronControl', res.data.id_ironControl)
        } else if (diff > 0) {
            const res = await api.post("/ironControl", {
                piecesToday: 0,
            });
            const resDiary = await api.patch(`/diaryIronControl/${res.data.id_ironControl}`); 
            localStorage.setItem('numberOfPieces', resDiary.data.piecesToday)           
            localStorage.setItem('lastIronControl', resDiary.data.id_ironControl)
        } else if(diff === 0){
            // console.log('mismo dia')
            // const res = await api.patch(`/diaryIronControl/${lastIronControl.data[0].id_ironControl}`);    
            localStorage.setItem('numberOfPieces', lastIronControl.data[0].piecesToday)
            localStorage.setItem('lastIronControl', lastIronControl.data[0].id_ironControl)
        }else{
            localStorage.setItem('lastIronControl', lastIronControl.data[0].id_ironControl)
        }


        navigate('/autoServicio');
    };

    const logout = () => {
        ['token', 'role', 'username'].forEach(obj => removeCookie(obj)); // remove data save in cookies
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
