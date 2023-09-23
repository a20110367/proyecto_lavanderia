import React, { useState, useEffect, useRef } from "react";
import Axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NavBar from "../../routes/Navbar";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[?=!@#$%*]).{8,24}$/;

function EditClient() {
  const nameRef = useRef();
  const userRef = useRef();
  const errRef = useRef();

  const [userName, setUserName] = useState("");
  const [validUserName, setValidUserName] = useState(false);
  const [userNameFocus, setUserNameFocus] = useState(false);

  const [name, setName] = useState("");
  const [validName, setValidName] = useState(false);
  const [nameFocus, setNameFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [validFirstName, setValidFirstName] = useState(false);
  const [firstnameFocus, setFirstNameFocus] = useState(false);

  const [secondName, setSecondName] = useState("");
  const [validSecondName, setValidSecondName] = useState(false);
  const [secondNameFocus, setSecondNameFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    nameRef.current.focus();
  }, []);
  

  useEffect(() => {
    setValidUserName(USER_REGEX.test(userName));
  }, [userName]);



  useEffect(() => {
    setValidName(name.trim().length > 0);
  }, [name]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [name, pwd, matchPwd]);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getClientById = async () => {
      const response = await Axios.get(`http://localhost:5000/clients/${id}`);
      setUserName(response.data.username);
      setName(response.data.name);
      setFirstName(response.data.firstName);
      setSecondName(response.data.secondName);
      setPwd(response.data.pass);
      setEmail(response.data.email);
      setPhone(response.data.phone);
    };
    getClientById();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isNameValid = USER_REGEX.test(name);
    const isPwdValid = PWD_REGEX.test(pwd);

    if (!isNameValid || !isPwdValid) {
      setErrMsg("Entrada inválida");
      return;
    }

    try {
      await Axios.patch(`http://localhost:5000/clients/${id}`, {
        username: userName,
        name: name,
        userName: userName,
        firstName: firstName,
        secondName: secondName,
        email: email,
        phone: phone,
        pass: pwd,
      });
      
      setSuccess(true);
      setName("");
      setPwd("");
      setMatchPwd("");
      navigate("/login");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No hay respuesta del servidor");
      } else if (err.response?.status === 409) {
        setErrMsg("Nombre de usuario ya existente");
      } else {
        setErrMsg("Fallo en la actualización");
      }
      errRef.current.focus();
    }
  };

  return (
    <div className="signup-form">
      <div className="title-container">
        <p className="subtitle">Editando perfil de:</p>   
        <strong className="title-strong">{name}</strong>
      </div>
      {success ? (
        <section>
          <h1>¡Éxito!</h1>
          <p>
            <a href="/clients">Clientes</a>
          </p>
        </section>
      ) : (
        <section className="bg-white px-4 pt-3 pb-4 rounded-md border border-gray-200 flex-1">
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <form onSubmit={handleSubmit}>
            {/* Nombre de usuario */}
            <label className="subtitle mt-0" htmlFor="name">
              Nombre:
              {validName ? (
                <FontAwesomeIcon
                  icon={faCheck}
                  className="ml-3 text-green-500"
                />
              ) : (
                <FontAwesomeIcon icon={faTimes} className="ml-3 text-red-500" />
              )}
            </label>
            <input
              className="input-prim"
              type="text"
              id="name"
              ref={nameRef}
              autoComplete="off"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
              aria-invalid={validName ? "false" : "true"}
              aria-describedby="namenote"
              onFocus={() => setNameFocus(true)}
              onBlur={() => setNameFocus(false)}
            />
            {/**Nombre Usuario */}
            <label className="subtitle" htmlFor="username">
              Nombre de usuario:
              {validUserName ? (
                <FontAwesomeIcon
                  icon={faCheck}
                  className="ml-3 text-green-500"
                />
              ) : (
                <FontAwesomeIcon icon={faTimes} className="ml-3 text-red-500" />
              )}
            </label>
            <input
              className="input-prim"
              type="text"
              id="username"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setUserName(e.target.value)}
              value={userName}
              required
              aria-invalid={validUserName ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setUserNameFocus(true)}
              onBlur={() => setUserNameFocus(false)}
            />
            <div className="group">
              <p
                id="uidnote"
                className={`instructions text-sm text-red-600 ${
                  userNameFocus && userName && !validUserName
                    ? "block"
                    : "hidden"
                }`}
              >
                <FontAwesomeIcon icon={faInfoCircle} />Debe ser de 4 a 24 caracteres.
                <br />
                Debe iniciar con una letra.
                <br />
                Letras, números, guiones y guiones bajos permitidos.
              </p>
            </div>

            <label className="subtitle" htmlFor="firstName">
              Apellido Paterno:
            </label>
            <input
              className="input-prim"
              type="text"
              id="firstName"
              autoComplete="off"
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
              required
              aria-invalid={validFirstName ? "false" : "true"}
              aria-describedby="firstNamenote"
              onFocus={() => setFirstNameFocus(true)}
              onBlur={() => setFirstNameFocus(false)}
            />
          
            <label className="subtitle" htmlFor="secondName">
              Apellido Materno:
              
            </label>
            <input
              className="input-prim"
              type="text"
              id="secondName"
              autoComplete="off"
              onChange={(e) => setSecondName(e.target.value)}
              value={secondName}
              required
              aria-invalid={validSecondName ? "false" : "true"}
              aria-describedby="secondNamenote"
              onFocus={() => setSecondNameFocus(true)}
              onBlur={() => setSecondNameFocus(false)}
            />
            
            {/* Contraseña */}
            <label className="subtitle" htmlFor="password">
              Contraseña:
              {validPwd ? (
                <FontAwesomeIcon
                  icon={faCheck}
                  className="ml-3 text-green-500"
                />
              ) : (
                <FontAwesomeIcon icon={faTimes} className="ml-3 text-red-500" />
              )}
            </label>
            <input
              className="input-prim"
              type="password"
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
              aria-invalid={validPwd ? "false" : "true"}
              aria-describedby="pwdnote"
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
            />
            <div className="group">
              <p
                id="pwdnote"
                className={`instructions text-sm text-red-600 ${
                  pwdFocus && !validPwd ? "block" : "hidden"
                }`}
              >
                <FontAwesomeIcon icon={faInfoCircle} />Debe ser de 8 a 24 caracteres.
                <br />
                Debe incluir letras mayúsculas y minúsculas, un número y un
                carácter especial.
                <br />
                Caracteres especiales permitidos:{" "}
                <span aria-label="exclamation mark">!</span>{" "}
                <span aria-label="at symbol">@</span>{" "}
                <span aria-label="hashtag">#</span>{" "}
                <span aria-label="dollar sign">$</span>{" "}
                <span aria-label="percent">%</span>{" "}
                <span aria-label="question mark">?</span>{" "}
                <span aria-label="equal sign">=</span>{" "}
                <span aria-label="asterisk">*</span>
              </p>
            </div>

            {/* Confirmar contraseña */}
            <label className="subtitle" htmlFor="confirm_pwd">
              Confirmar Contraseña:
              {validMatch && matchPwd ? (
                <FontAwesomeIcon icon={faCheck} className="ml-3 text-green-500" />
              ) : (
                <FontAwesomeIcon icon={faTimes} className="ml-3 text-red-500" />
              )}
            </label>
            <input
              className="input-prim"
              type="password"
              id="confirm_pwd"
              onChange={(e) => setMatchPwd(e.target.value)}
              value={matchPwd}
              required
              aria-invalid={validMatch ? "false" : "true"}
              aria-describedby="confirmnote"
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
            />
            <div className="group">
              <p
                id="confirmnote"
                className={`instructions text-sm text-red-600 ${
                  matchFocus && !validMatch ? "block" : "hidden"
                }`}
              >
                <FontAwesomeIcon icon={faInfoCircle} /> Debe coincidir con la
                primera contraseña ingresada.
              </p>
            </div>
            <div className="mt-3">
              {/* Email */}
              <label className="subtitle mx-2" htmlFor="email">
                Email:
              </label>
              <input
                className="input-2ry"
                type="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />

              {/* Teléfono */}
              <label className="subtitle mx-2" htmlFor="phone">
                Teléfono:
              </label>
              <input
                className="input-2ry"
                type="tel"
                id="phone"
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
                required
                pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
              />
              <div className="float-right">
              {/* Botón para actualizar */}
              <button
                className="btn-edit"
                disabled={!validName || !validPwd || !validMatch ? true : false}
                type='submit'
              >
                Actualizar
              </button>
              <button
                className="btn-cancel"
                onClick={() => navigate("/clients")}
              >
                Cancelar
              </button>
              </div>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}

export default EditClient;
