import Navbar from "../../routes/Navbar"
import { useRef, useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import Axios from "axios";


function AddPlanchado() {

    const planchadoRef = useRef();
    const errpRef = useRef();

    const [precio, setPrecio] = useState('');
    const [validPrecio, setValidPrecio] = useState(false);
    const [PrecioFocus, setPrecioFocus] = useState(false);

    const [tipo, setTipo] = useState('');
    const [validTipo, setValidTipo] = useState(false);
    const [tipoFocus, setTipo_pFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        planchadoRef.current.focus();
    }, [])


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(precio)
        console.log(tipo)

       
        try {
            await Axios.post("http://localhost:5000/planchados", {
                precio: precio,
                tipo: tipo,

                
            });
            //console.log(JSON.stringify(response))
            setSuccess(true);
            //clear state and controlled inputs
            setPrecio('');
            setTipo('');

            navigate('/login')
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('planchadoname Taken');
            } else {
                setErrMsg('Registration Failed')
            }
            errpRef.current.focus();
        }
    }


    return (
        <div className="signup-form">
            <div  className=" bg-white px-4 pt-3 pb-4 rounded-sm border vorder-gray-200 flex-1">
                <strong>Añadir Planchado</strong>
            </div>
            {success ? (
                <section>
                    <h1>Success!</h1>
                    <p>
                        <a href="/login">Sign In</a>
                    </p>
                </section>
            ) : (
                <section className="bg-white px-4 pt-3 pb-4 rounded-sm border vorder-gray-200 flex-1">
                    <p ref={errpRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1 className="font-medium text-lg text-gray-500 mt-4">Por favor añade los datos del Precio</h1>
                    <form onSubmit={handleSubmit}>
                        <label className="text-lg font-medium" htmlFor="precio">
                            Añadir precio
                        </label>
                        <input className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                            type="number"
                            id="precio"
                            ref={planchadoRef}
                            autoComplete="off"
                            onChange={(e) => setPrecio(e.target.value)}
                            value={precio}
                            required
                            onFocus={() => setPrecioFocus(true)}
                            onBlur={() => setPrecioFocus(false)}
                        />


                        <label  className="text-lg font-medium" htmlFor="tio">
                            Tipo
                        </label>
                        <input
                            className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"  
                            type="text"
                            id="tipo"
                            onChange={(e) => setTipo(e.target.value)}
                            value={tipo}
                            required
                            onFocus={() => setTipo_pFocus(true)}
                            onBlur={() => setTipo_pFocus(false)}
                        />

                        <button>Subir planchado</button>
                    </form>
                </section>
            )}
            <Navbar></Navbar>
        </div>
    )
}

export default AddPlanchado