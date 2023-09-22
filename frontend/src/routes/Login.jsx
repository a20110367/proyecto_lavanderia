import React from "react";
import { useState } from "react";
import { useAuth } from "../hooks/auth/auth";


export default function Login() {

  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [success, setSuccess] = useState(false);
  const { login } = useAuth();

  const loginSubmit = () => {
    if(!!user && !!pass){
      login({ user, pass });
    }else{
      setErr('Rellene los campos vacios')
    }
  }

  return (
    <div className="responsive-bg">
      <div className="login-container">
        <h1 className="title">Bienvenido</h1>
        <p className="subtitle text-gray-500 mt-4">
          Bienvenido de vuelta! Por favor ingrese sus credenciales
        </p>
          <div className="mt-8">
            <div>
              <label className="subtitle" htmlFor="user">Usuario:</label>
              <input
                className="input-prim"
                placeholder="Ingrese su Usuario"
                type="text" name="user" id="user"
                onChange={(e) => setUser(e.target.value)}
                value={user}
              />
            </div>
            <div>
              <label className="subtitle" htmlFor="pass">Contraseña:</label>
              <input
                className="input-prim"
                placeholder="Ingrese su Contraseña"
                type="password" name="pass" id="pass"
                onChange={(e) => setPass(e.target.value)}
                value={pass}
              />
            </div>
            <div className="mt-8 flex justify-between items-center">
              <div>
                <input type={"checkbox"} id="recordar" />
                <label className="ml-2 font-medium text-base" htmlFor="recordar">
                  Recordarme por 12 Horas
                </label>
              </div>
              <button className="link">
                Olvidaste tu Contraseña
              </button>
            </div>
            <div className="mt-8 flex flex-col gap-y-4">
              <button onClick={loginSubmit} className="btn-login">
                Iniciar sesion
              </button>
              <p className="instructions font-black">{err}</p>
            </div>
          </div>
      </div>
    </div>
  );
}