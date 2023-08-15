import React from "react";
import { useEffect, useState } from "react";
import DefaultLayout from "../layout/DefaultLayout"
import Axios from "axios";

export default function Login() {
  
  const auth = (id) => {
    Axios.put("https://localhost:5000/auth",{
      user: user,
      pw: pw,
    }).then((res) => {
      alert(res.data);
    });
  };

  return (
    <div class="login-form">
        <DefaultLayout></DefaultLayout>
        <form action="auth" method="POST">
            <h1 className="text-sky-300"> Autentiquese, SI </h1>
            <input type="text" name="user" id="user" placeholder="Usuario"/>
            <input type="password" name="pass" id="pass" placeholder="Contraseña"/>
            <input type="submit" class="btn-login" value="Login"/>
        </form>
    </div>
  );
}