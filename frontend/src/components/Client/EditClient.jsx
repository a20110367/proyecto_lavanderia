import React, { useState, useEffect, useRef } from "react";
import Axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NavBar from '../../routes/Navbar'


function EditClient() {
    
    const clientRef = useRef();
    const errRef = useRef();

    const [client, setClient] = useState('');
    const [validName, setValidName] = useState(false);
    const [clientFocus, setClientFocus] = useState(false);

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

    useEffect(() => {
        clientRef.current.focus();
    }, [])

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const getUserById = async () => {
            const response = await Axios.get(`http://localhost:5000/clients/${id}`);
            setClient(response.data.name);
            setApellido_p(response.data.apellido_p);
            setApellido_m(response.data.apellido_m)
            setPhone(response.data.phone);
            setEmail(response.data.email);

        };
        getUserById();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(client)
        console.log(apellido_p)
        console.log(apellido_m)
        console.log(phone)
        console.log(email)
        
        try {
            await Axios.patch(`http://localhost:5000/clients/${id}`, {
                name: client,
                apellido_p: apellido_p,
                apellido_m: apellido_m,
                phone: phone,
                email: email,
            });
            //console.log(JSON.stringify(response))
            setSuccess(true);
            //clear state and controlled inputs
            setClient('');
            setApellido_p('');
            setApellido_m('');
            navigate('/login')
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('Username Taken');
            } else {
                setErrMsg('Registration Failed')
            }
            errRef.current.focus();
        }
    }

    return (
        <div className="signup-form">
            {success ? (
                <section>
                    <h1>Success!</h1>
                    <p>
                        <a href="/login">Sign In</a>
                    </p>
                </section>
            ) : (
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1>Actualizando perfil de: {client}</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username">
                            Nombre
                        </label>
                        <input
                            type="text"
                            id="clientname"
                            ref={clientRef}
                            autoComplete="off"
                            onChange={(e) => setClient(e.target.value)}
                            value={client}
                            required
                            onFocus={() => setClientFocus(true)}
                            onBlur={() => setClientFocus(false)}
                        />


                        <label htmlFor="apellido_p">
                            Apellido Parterno
                           
                        </label>
                        <input
                            type="text"
                            id="apellido_p"
                            onChange={(e) => setApellido_p(e.target.value)}
                            value={apellido_p}
                            required
                            onFocus={() => setApellido_pFocus(true)}
                            onBlur={() => setApellido_pFocus(false)}
                        />

                        <label htmlFor="apellido_m">
                            Apellido Materno
                           
                        </label>
                        <input
                            type="text"
                            id="apellido_m"
                            onChange={(e) => setApellido_m(e.target.value)}
                            value={apellido_m}
                            required
                            onFocus={() => setApellido_mFocus(true)}
                            onBlur={() => setApellido_mFocus(false)}
                        />

                        <label htmlFor="phone">
                            Telefono:
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            onChange={(e) => setPhone(e.target.value)}
                            value={phone}
                            required
                            pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
                        />

                        <label htmlFor="email">
                            Email:
                        </label>
                        <input
                            type="email"
                            id="email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                        />

                    

                        <button disabled={!validName || !validApellido_p ? true : false}>Actualizar</button>
                    </form>
                </section>
            )}
            <NavBar></NavBar>
        </div>
    )
};

export default EditClient