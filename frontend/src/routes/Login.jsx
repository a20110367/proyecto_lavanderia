import React from "react";
import { useState } from "react";
import Navbar from "../routes/Navbar"
import { useAuth } from "../hooks/auth/auth";


export default function Login() {

  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [err, setErr] = useState('');
  const [success, setSuccess] = useState(false);
  const { login } = useAuth();

  const loginSubmit = () => {
    login({user, pwd});
  }

  return (
    <div className="bg-white px-10 py-20 rounded-3xl border-2 border-gray-100 mt-11 ml-96 mr-96 ">
      <h1 className="text-5xl font-semibold">Bienvenido</h1>
      <p className="font-medium text-lg text-gray-500 mt-4">
        Bienvenido de vuelta! Por favor ingrese sus credenciales
      </p>
        <div className="mt-8">
          <div>
            <label className="text-lg font-medium" htmlFor="user">Usuario</label>
            <input
              className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
              placeholder="Usuario"
              type="text" name="user" id="user"
              onChange={(e) => setUser(e.target.value)}
              value={user}
            />
          </div>
          <div>
            <label className="text-lg font-medium" htmlFor="pass">Contraseña</label>
            <input
              className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
              placeholder="Contraseña"
              type="password" name="pass" id="pass"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
            />
          </div>
          <div className="mt-8 flex justify-between items-center">
            <div>
              <input type={"checkbox"} id="recordar" />
              <label className="ml-2 font-medium text-base" htmlFor="recordar">
                Recordarme por 12 Horas
              </label>
            </div>
            <button className="font-medium text-base text-violet-500">
              Olvidaste tu Contraseña
            </button>
          </div>
          <div className="mt-8 flex flex-col gap-y-4">
            <button onClick={loginSubmit} className="active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all py-4 rounded-xl bg-violet-500 text-white text-lg font-bold">
              Iniciar sesion
            </button>
          </div>
        </div>
    </div>
  );
}