import React from "react";
import { useState } from "react";
import { useAuth } from "../hooks/auth/auth";


export default function Login() {

  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [success, setSuccess] = useState(false);
  const { login } = useAuth();

  const loginSubmit = (e) => {
    e.preventDefault();
    if (!!user && !!pass) {
      login({ user, pass });
      localStorage.clear()
    } else {
      setErr('Rellene los campos vacios')
    }
  }
  

  return (
    // <div className="responsive-bg">
    <div className="login-container">
      {/* <div className="login-container"> */}
      <div className="svg-container">
        <svg className='svg-container' version="1.1" id="vis_p1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 1280 1024" styles="enable-background:new 0 0 1280 1024">
          <path className="st0" d="M0 0h918.9v183.8H0z"></path>
          <path className="st1" d="M86 183.8H0V0h86l97.8 91.9z"></path>
          <path className="st2" d="M269.8 183.8h-86V0h86l97.8 91.9z"></path>
          <path className="st3" d="M453.5 183.8h-85.9V0h85.9l97.8 91.9z"></path>
          <circle className="st4" cx="643.2" cy="91.9" r="91.9"></circle>
          <circle className="st5" cx="643.2" cy="91.9" r="38.2"></circle>
          <circle className="st4" cx="827" cy="91.9" r="91.9"></circle>
          <circle className="st5" cx="827" cy="91.9" r="38.2"></circle>
          <path className="st6" d="M918.9 0h51.6v183.8h-51.6z"></path>
          <path className="st7" d="M970.5 0h51.6v183.8h-51.6z"></path>
          <path className="st6" d="M1022.1 0h51.6v183.8h-51.6z"></path>
          <path className="st7" d="M1073.7 0h51.6v183.8h-51.6z"></path>
          <path className="st6" d="M1125.2 0h51.6v183.8h-51.6z"></path>
          <path className="st7" d="M1176.8 0h51.6v183.8h-51.6z"></path>
          <path className="st6" d="M1228.4 0h51.6v183.8h-51.6zM0 183.8h367.6v46.5H0z"></path>
          <path className="st1" d="M0 230.3h367.6v46.5H0z"></path>
          <path className="st6" d="M0 276.8h367.6v46.5H0z"></path>
          <path className="st1" d="M0 323.2h367.6v46.5H0z"></path>
          <path className="st6" d="M0 369.7h367.6v46.5H0z"></path>
          <path className="st1" d="M0 416.2h367.6v46.5H0z"></path>
          <path className="st6" d="M0 462.7h367.6v46.5H0z"></path>
          <path className="st5" d="M668 509.2H367.6V183.8z"></path>
          <path className="st2" d="M668 509.2 367.6 183.8H668z"></path>
          <path className="st8" d="M668 183.8h612v172.3H668z"></path>
          <path className="st5" d="M668 356h612v160.3H668z"></path>
          <path className="st9" d="M821 356H668l76.5-172.2z"></path>
          <path className="st0" d="M974 356H821l76.5-172.2z"></path>
          <path className="st10" d="M1127 356H974l76.5-172.2z"></path>
          <path className="st4" d="M1280 356h-153l76.5-172.2z"></path>
          <circle className="st1" cx="744.5" cy="432.6" r="76.5"></circle>
          <circle className="st2" cx="897.7" cy="432.6" r="76.5"></circle>
          <circle className="st3" cx="1050.7" cy="432.6" r="76.5"></circle>
          <circle className="st8" cx="1203.9" cy="432.6" r="76.5"></circle>
          <path className="st3" d="M0 522.3v298.4c110.7 0 200.4 91 200.4 203.2V725.6C89.7 725.6 0 634.6 0 522.3z"></path>
          <path className="st9" d="M.4 509.2c-.3 4.4-.4 8.7-.4 13.2 0 112.3 89.7 203.2 200.4 203.2V509.2H.4z"></path>
          <path className="st0" d="M0 820.8V1024h200.4c0-112.3-89.7-203.2-200.4-203.2z"></path>
          <path className="st6" d="M668.3 509.2h317.4v321.9H668.3z"></path>
          <path className="st3" d="M668.3 509.2V831h317.4c0-177.7-142.1-321.8-317.4-321.8z"></path>
          <path className="st1" d="M200.4 509.2h317.4v321.9H200.4z"></path>
          <ellipse className="st5" cx="359.1" cy="670.1" rx="91.9" ry="93.2"></ellipse>
          <ellipse className="st10" cx="359.1" cy="670.1" rx="38.2" ry="38.7"></ellipse>
          <path className="st6" d="M517.8 509.2h21.4V1024h-21.4z"></path>
          <path className="st5" d="M539.3 509.2h21.4V1024h-21.4z"></path>
          <path className="st6" d="M560.7 509.2h21.4V1024h-21.4z"></path>
          <path className="st5" d="M582.2 509.2h21.4V1024h-21.4z"></path>
          <path className="st6" d="M603.7 509.2h21.4V1024h-21.4z"></path>
          <path className="st5" d="M625.2 509.2h21.4V1024h-21.4z"></path>
          <path className="st6" d="M646.6 509.2H668V1024h-21.4z"></path>
          <path className="st5" d="M668 831h164.4c0-92.1-73.6-166.7-164.4-166.7V831z"></path>
          <path className="st9" d="M985.7 509.2h294.7v321.9H985.7z"></path>
          <path className="st5" d="m1133.3 573.9 94.8 96.2-94.8 96.2-94.8-96.2z"></path>
          <path className="st10" d="M668 831h612.4v193H668z"></path>
          <path className="st1" d="m668 1024 204-191.6V1024z"></path>
          <path className="st3" d="m872 1024 204-191.6V1024z"></path>
          <path className="st4" d="m1076 1024 204-191.6V1024zM200.4 831h317.4v193H200.4z"></path>
          <path className="st6" d="M390.8 975.7v-48.1h-63.5v-48.3h-63.5V831h-63.4v193h253.9v-48.3z"></path>
        </svg>
      </div>
      <div className="bg-white w-1/2 rounded-lg shadow-lg p-6">
        <h1 className="title">Bienvenido</h1>
        <p className="subtitle text-gray-500 mt-4">
          Bienvenido de vuelta! Por favor ingrese sus credenciales
        </p>
        <div className="mt-8">
          <form onSubmit={loginSubmit}>
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
              <button type="submit" className="btn-login">
                Iniciar sesion
              </button>
              <p className="instructions font-black">{err}</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}