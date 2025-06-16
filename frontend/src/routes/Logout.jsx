import { useAuth } from '../hooks/auth/auth';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'
import api from '../api/api'
import { useEffect } from 'react';

function Logout() {

    const navigate = useNavigate();
    const { cookies, logout } = useAuth();

    useEffect(() => {
        validate()
    }, []);

    const validate = async () => {
        try {
            const res = await api.get("/cashCutStatus")
            if (res.data.cashCutStatus === 'closed') {
                await api.post('/log/write', {
                    logEntry: `INFO AUTH.JSX : ${cookies.username} has logged OUT`
                })
                logout()
            } else if (res.data.cashCutStatus === 'open') {
                Swal.fire({
                    icon: "warning",
                    title: "No se ha realizado el Corte de Caja",
                    text: 'Da click en Corte de Caja.',
                    confirmButtonColor: '#034078'
                });
                navigate('/corteCaja')
            }
        } catch (err) {
            console.log(err)
            console.error('No entiendo como sucedio esto')
        }
    }
}

export default Logout