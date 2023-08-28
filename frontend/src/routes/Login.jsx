import React from "react";
import { useEffect, useState } from "react";
import Navbar from "../routes/Navbar";
import Axios from "axios";

export default function Login() {
  const auth = (id) => {
    Axios.put("https://localhost:5000/auth", {
      user: user,
      pw: pw,
    }).then((res) => {
      alert(res.data);
    });
  };

  return (
    <div className="bg-white px-10 py-20 rounded-3xl border-2 border-gray-100 mt-11 ml-96 mr-96 ">
          <Navbar></Navbar>
      <h1 className="text-5xl font-semibold">Bienvenido</h1>
      <p className="font-medium text-lg text-gray-500 mt-4">
        Bienvenido devuelta! Por favor ingrese sus credenciales
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
              Recordarme por 30 dias
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
