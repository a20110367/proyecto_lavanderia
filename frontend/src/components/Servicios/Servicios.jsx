import Navbar from "../../routes/Navbar"
import { useRef, useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import Axios from "axios";


function Servicios() {

    const servicioRef = useRef();
    const errsRef = useRef();

    const [servicio, setServicio] = useState('');

    const [apellido_p, setApellido_p] = useState('');
    const [validApellido_p, setValidApellido_p] = useState(false);
    const [apellido_pFocus, setApellido_pFocus] = useState(false);
    
    const [apellido_m, setApellido_m] = useState('');
    const [validApellido_m, setValidApellido_m] = useState(false);
    const [apellido_mFocus, setApellido_mFocus] = useState(false);

    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        servicioRef.current.focus();
    }, [])


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(servicio)
        console.log(apellido_p)
        console.log(apellido_m)
        console.log(phone)
        console.log(email)
       
       
        try {
            await Axios.post("http://localhost:5000/servicio", {
                name: servicio,
                apellido_p: apellido_p,
                apellido_m: apellido_m,
                phone: phone,
                email: email,
                
            });
            //console.log(JSON.stringify(response))
            setSuccess(true);
            //clear state and controlled inputs
            setServicio('');
            setApellido_p('');
            setApellido_m('');

            navigate('/login')
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('Clientname Taken');
            } else {
                setErrMsg('Registration Failed')
            }
            errsRef.current.focus();
        }
    }


    return (
        <div className="signup-form">
            <div  className=" bg-white px-4 pt-3 pb-4 rounded-sm border vorder-gray-200 flex-1">
                <strong>Añadir Cliente</strong>
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
                    <p ref={errsRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1 className="font-medium text-lg text-gray-500 mt-4">Por favor añade los datos del Cliente</h1>
                    <form onSubmit={handleSubmit}>
                        <label className="text-lg font-medium" htmlFor="clientname">
                            Nombre Cliente
                        </label>
                        <input className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                            type="text"
                            id="clientname"
                            ref={servicioRef}
                            autoComplete="off"
                            onChange={(e) => setServicio(e.target.value)}
                            value={servicio}
                            required
                            onFocus={() => setClientFocus(true)}
                            onBlur={() => setClientFocus(false)}
                        />


                        <label  className="text-lg font-medium" htmlFor="apellido_p">
                            Apellido Parterno
                        </label>
                        <input
                            className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"  
                            type="text"
                            id="apellido_p"
                            onChange={(e) => setApellido_p(e.target.value)}
                            value={apellido_p}
                            required
                            onFocus={() => setApellido_pFocus(true)}
                            onBlur={() => setApellido_pFocus(false)}
                        />


                        <label  className="text-lg font-medium" htmlFor="apellido_m">
                            Apellido Materno
                        </label>
                        <input
                            className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"  
                            type="text"
                            id="apellido_m"
                            onChange={(e) => setApellido_m(e.target.value)}
                            value={apellido_m}
                            required
                            onFocus={() => setApellido_mFocus(true)}
                            onBlur={() => setApellido_mFocus(false)}
                        />

                        <label className="text-lg font-medium" htmlFor="phone">
                            Telefono
                        </label>
                        <input
                        className=" border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                            type="tel"
                            id="phone"
                            onChange={(e) => setPhone(e.target.value)}
                            value={phone}
                            required
                            pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
                        />

                        <label  className="text-lg font-medium" htmlFor="email">
                            Email
                        </label>
                        <input
                        className=" border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                            type="email"
                            id="email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                        />
                    

                        <button>Sign Up</button>
                    </form>
                </section>
            )}
            <Navbar></Navbar>
        </div>
    )
}

export default Servicios