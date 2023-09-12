import React from "react";
import { useEffect, useState, useRef, useContext } from "react";
import PropTypes from 'prop-types'
import Navbar from "../routes/Navbar"
import Axios from "axios";
import useSWR, { useSWRConfig } from "swr";

export default function Login() {

  const [username, setUsername] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErr] = useState('');
  const [success, setSuccess] = useState(false);

      // const navigate = useNavigate();
    // const location = useLocation();
    const from = location.state?.from?.pathname || "/linkpage";
    // const { auth, setAuth } = useAuth();

  const handleSubmit = async e => {
    e.preventDefault()
    const token = await loginUser({
      user,
      pwd
    })
    setToken(token)
  }

  async function loginUser (credentials) {
    try {
      const response = await Axios.get("http://localhost:5000/authEmployee/login",
      JSON.stringify({name, pass}),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      )
      const accessToken = response?.data?.accessToken
      const rol = response?.data?.rol
      setUsername('')
      setPwd('')
      setSuccess(true)
    }catch(err){
      if(!err?.response){
        setErr('No Server Response')
      }else if (err.response?.status === 400) {
        setErr('Missing Username or Pwd')
      }else if (err.response?.status === 401) {
        setErr('Unauthorized')
      }else{
        setErr('Login Failed')
      }
    }
  }

  const { mutate } = useSWRConfig();
  const fetcher = async () => {
    const response = await Axios.get("http://localhost:5000/users");
    return response.data;
  };

  const { data } = useSWR("clients", fetcher);
  if (!data) return <h2>Loading...</h2>;

  function auth(e) {
    e.preventDefault();
    Axios.put("https://localhost:5000/auth", {
      user: user,
      pw: pw,
    }).then((res) => {
      alert(res.data);
    });
  }

  return (
    <div className="bg-white px-10 py-20 rounded-3xl border-2 border-gray-100 mt-11 ml-96 mr-96 ">
          <Navbar></Navbar>
      <h1 className="text-5xl font-semibold">Bienvenido</h1>
      <p className="font-medium text-lg text-gray-500 mt-4">
        Bienvenido de vuelta! Por favor ingrese sus credenciales
      </p>
      <div className="mt-8">
        <div>
          <label className="text-lg font-medium">Email</label>
          <input
            className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
            placeholder="Correo electronico"
            type="text" name="user" id="user"
          />
        </div>
        <div>
          <label className="text-lg font-medium">Contraseña</label>
          <input
            className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
            placeholder="Contraseña"
            type="password" name="pass" id="pass"
          />
        </div>
        <div className="mt-8 flex justify-between items-center">
          <div>
            <input type={"checkbox"} id="recordar" />
            <label className="ml-2 font-medium text-base" for="recordar">
              Recordarme por 3 Horas
            </label>
          </div>
          <button className="font-medium text-base text-violet-500">
            Olvidaste tu Contraseña
          </button>
        </div>
        <div className="mt-8 flex flex-col gap-y-4">
          <button className="active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all py-4 rounded-xl bg-violet-500 text-white text-lg font-bold">
            Iniciar sesion
          </button>
          <button type="submit" value="signup" className="active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all py-4 rounded-xl bg-violet-500 text-white text-lg font-bold">
            Registrarse
          </button>
        </div>
      </div>
    </div>
  );
}
