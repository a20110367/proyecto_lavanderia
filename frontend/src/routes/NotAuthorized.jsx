import React from 'react'
import { useNavigate } from 'react-router-dom'

function NotAuthorized() {
    const navigate = useNavigate()
    return (
        <div>
            <p className='title'>No Estas Autorizado</p>
            <div>
                <p className='err text-justify mt-10'>No tienes autorización para entrar a esta sección</p>
                <button className='btn-primary  w-2/12 mt-10' onClick={() => navigate('/menuPuntoVenta')}>
                    Regresar
                </button>
            </div>
        </div>

    )
}

export default NotAuthorized