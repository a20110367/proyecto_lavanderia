import { useAuth } from '../hooks/auth/auth';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2'

function Logout() {

    const navigate = useNavigate();
    const [cashCut, setCashCut] = useState()
    const { logout } = useAuth();

    useEffect(() => {
        setCashCut(localStorage.getItem('lastCashCut'))
    }, []);

    if (cashCut) {
        logout()
        localStorage.removeItem('lastCashCut')
    } else {
        Swal.fire({
            icon: "warning",
            title: "No se ha realizado el Corte de Caja",
            text: 'Da click en Corte de Caja.',
            confirmButtonColor: '#034078'
        });
        navigate('/corteCaja')
    }
}

export default Logout