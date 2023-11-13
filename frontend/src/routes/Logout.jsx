import { useAuth } from '../hooks/auth/auth';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';

function Logout() {

    const navigate = useNavigate();
    const [cashCut, setCashCut] = useState(localStorage.getItem('lastCashCut'))
    const { logout } = useAuth();

    useEffect(() => {
        if (cashCut) {
            logout()
            localStorage.removeItem('lastCashCut')
        } else {
            alert("Es necesario primero cerrar caja antes de poder Cerrar Sesión");
            navigate('/corteCaja')
        }
    }, []);
}

export default Logout