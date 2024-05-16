import { createContext, useContext, useMemo } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import moment from 'moment'
import Swal from 'sweetalert2'
import api from '../../api/api'

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const navigate = useNavigate();
    const [cookies, setCookies, removeCookie] = useCookies();

    const login = async ({ user, pass }) => {
        try {

            const res = await api.post("/auth", {
                username: user,
                pass: pass
            });

            localStorage.clear()

            setCookies('token', res.data.id_user, { path: '/' }); // your token
            setCookies('username', res.data.username, { path: '/' }); // optional data
            setCookies('role', res.data.role, { path: '/' }); // optional data

            const newIronControl = await api.get('/newIronControl')
            // console.table(newIronControl.data)
            localStorage.setItem('lastIronControl', newIronControl.data.ironControl.id_ironControl)
            localStorage.setItem('numberOfPieces', newIronControl.data.ironControl.piecesToday)
            localStorage.setItem('maxCapacity', newIronControl.data.ironingCapacity.pieces)
            // const now = moment()
            // const lastIronControlDate = moment(lastIronControl)
            // const diff = now.diff(lastIronControlDate, 'days');
            // // const diff = 1
            // // console.log(now)
            // // console.log(lastIronControlDate)
            // // console.log(diff)
            // // console.log(lastIronControl.data)
            // if (!lastIronControl || lastIronControl.data.length === 0) {
            //     const res = await api.post("/ironControl", {
            //         piecesToday: 0,
            //     });
            //     localStorage.setItem('lastIronControl', res.data.id_ironControl)
            // } else if (diff > 0) {
            //     const res = await api.post("/ironControl", {
            //         piecesToday: 0,
            //     });
            //     const resDiary = await api.patch(`/diaryIronControl/${res.data.id_ironControl}`);
            //     localStorage.setItem('numberOfPieces', resDiary.data.piecesToday)
            //     localStorage.setItem('lastIronControl', resDiary.data.id_ironControl)
            // } else if (diff === 0) {
            //     // console.log('mismo dia')
            //     // const res = await api.patch(`/diaryIronControl/${lastIronControl.data[0].id_ironControl}`);    
            //     localStorage.setItem('numberOfPieces', lastIronControl.data[0].piecesToday)
            //     localStorage.setItem('lastIronControl', lastIronControl.data[0].id_ironControl)
            // } else {
            //     localStorage.setItem('lastIronControl', lastIronControl.data[0].id_ironControl)
            // }
            navigate('/autoServicio');
        } catch (err) {
            Swal.fire({
                icon: "warning",
                title: "Credenciales Invalidas",
                confirmButtonColor: '#034078'
            });
            console.warn('INVALID CREDENTIALS: ' + err)
        }
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
