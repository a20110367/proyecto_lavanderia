import React from "react";
import { useEffect, useState, useRef, useContext } from "react";
import PropTypes from 'prop-types'
import Navbar from "../routes/Navbar"
import Axios from "axios";
import useSWR, { useSWRConfig } from "swr";

export default function Login() {

  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErr] = useState('');
  const [success, setSuccess] = useState(false);

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
      const response = await Axios.post("http://localhost:5000/users",
      JSON.stringify({name, pass}),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      )
      const accessToken = response?.data?.accessToken
      const rol = response?.data?.rol
      setUser('')
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

  const { data } = useSWR("users", fetcher);
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
    <div className="login-form">
      <Navbar></Navbar>
      <form onSubmit={handleSubmit}>
        <h1 className="text-sky-300"> Autentiquese, SI </h1>
        <input 
          type="text" 
          name="user" 
          id="user" 
          autoComplete="off"
          onChange={(e) => setUser(e.target.value)}
          value={user}
          required
          placeholder="Usuario" />
        <input 
          type="password" 
          name="pwd"
          id="pwd"
          required
          onChange={(e) => setPwd(e.target.value)}
          value={pwd}
          placeholder="Contraseña" />
        <input type="submit" className="btn-login" value="Login" />
      </form>
      {data?.length
        ? (
        <ul>
          {data.map((user,i) => 
            <li key={i}> {user?.name} | {user?.email}</li>)
          }
        </ul>
        ) : <p>No users</p>
      }
    </div>
  );
}
