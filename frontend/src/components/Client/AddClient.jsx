import { useRef, useState, useEffect } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import api from '../../api/api'

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[?=!@#$*]).{8,24}$/;

function AddClient() {
  const userRef = useRef();
  const errRef = useRef();

  const [userName, setUserName] = useState("");
  const [validUserName, setValidUserName] = useState(false);
  const [userNameFocus, setUserNameFocus] = useState(false);

  const [name, setName] = useState("");
  const [firstLN, setFirstLN] = useState("");
  const [secondLN, setSecondLN] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pass, setPass] = useState("");
  const [validName, setValidName] = useState(false);
  const [nameFocus, setNameFocus] = useState(false);

  const [validFirstName, setValidFirstName] = useState(false);
  const [firstNameFocus, setFirstNameFocus] = useState(false);

  const [validSecondName, setValidSecondName] = useState(false);
  const [secondNameFocus, setSecondNameFocus] = useState(false);

  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setValidUserName(USER_REGEX.test(userName));
  }, [userName]);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setValidName(name.trim().length > 0);
  }, [name]);

  useEffect(() => {
    setValidFirstName(firstLN.trim().length > 0);
  }, [firstLN]);

  useEffect(() => {
    setValidSecondName(secondLN.trim().length > 0);
  }, [secondLN]);

  useEffect(() => {
    setValidEmail(email.trim().length > 0);
  }, [email]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pass));
  }, [pass]);

  useEffect(() => {
    setErrMsg("");
  }, [name, firstLN, secondLN, email, pass]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !validName ||
      !validFirstName ||
      !validSecondName ||
      !validEmail ||
      !validPwd
    ) {
      setErrMsg("Invalid Entry");
      return;
    }

    try {
      await api.post("/clients", {
        username: userName,
        name: name,
        firstLN: firstLN,
        secondLN: secondLN,
        email: email,
        phone: phone,
        pass: pass,
      });

      setSuccess(true);
      setName("");
      setFirstName("");
      setSecondName("");
      setEmail("");
      setPhone("");
      setPass("");
      navigate("/clients");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 409) {
        setErrMsg("Email Address Already Exists");
      } else {
        setErrMsg("Registration Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <div className="signup-form">
      <div className="form-container">
        <div className="HeadContent">
          <h2 className="title text-white"><em>Añadir a un Cliente</em></h2>
          <p className="form-lbl text-white">Ingrese los detalle del cliente.</p>
          <div className="clearBoth"></div>
        </div>
        {success ? (
          <section>
            <h1>Success!</h1>
            <p>
              <a href="/clients">Clientes</a>
            </p>
          </section>
        ) : (
          <section>
            <p
              ref={errRef}
              className={errMsg ? "errmsg" : "offscreen"}
              aria-live="assertive"
            >
              {errMsg}
            </p>
            <form onSubmit={handleSubmit}>
              {/* Name */}
              <label className="form-lbl" htmlFor="name">
                Nombre:
                {validName ? (
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="ml-3 text-green-500"
                  />
                ) : (
                  <FontAwesomeIcon icon={faTimes} className="err-icon" />
                )}
              </label>
              <input
                className="form-input"
                type="text"
                id="name"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
                aria-invalid={validName ? "false" : "true"}
                onFocus={() => setNameFocus(true)}
                onBlur={() => setNameFocus(false)}
              />
              {/**Nombre Usuario */}
              <label className="form-lbl" htmlFor="username">
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
                className="form-input"
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
                  className={`instructions ${userNameFocus && userName && !validUserName ? "block" : "hidden"
                    }`}
                >
                  <FontAwesomeIcon icon={faInfoCircle} />De 4 a 24 caracteres.
                  <br />
                  Debera iniciar con una letra.
                  <br />
                  Caracteres Permitidos:
                  <br />
                  Letras, p. ej. L
                  <br />
                  Números, p. ej. 4
                  <br />
                  Guiones, p. ej. -
                  <br />
                  Guiones Bajos p. ej. _
                  <br />
                </p>
              </div>

              {/* First Name */}
              <label className="form-lbl" htmlFor="firstName">
                Apellido Paterno:
                {validFirstName ? (
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="ml-3 text-green-500"
                  />
                ) : (
                  <FontAwesomeIcon icon={faTimes} className="ml-3 text-red-500" />
                )}
              </label>
              <input
                className="form-input"
                type="text"
                id="firstName"
                autoComplete="off"
                onChange={(e) => setFirstLN(e.target.value)}
                value={firstLN}
                required
                aria-invalid={validFirstName ? "false" : "true"}
                onFocus={() => setFirstNameFocus(true)}
                onBlur={() => setFirstNameFocus(false)}
              />
              {/* Second Name */}
              <label className="form-lbl" htmlFor="secondName">
                Apellido Materno:
                {validSecondName ? (
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="ml-3 text-green-500"
                  />
                ) : (
                  <FontAwesomeIcon icon={faTimes} className="ml-3 text-red-500" />
                )}
              </label>
              <input
                className="form-input"
                type="text"
                id="secondName"
                autoComplete="off"
                onChange={(e) => setSecondLN(e.target.value)}
                value={secondLN}
                required
                aria-invalid={validSecondName ? "false" : "true"}
                onFocus={() => setSecondNameFocus(true)}
                onBlur={() => setSecondNameFocus(false)}
              />
              {/* Email */}
              <label className="form-lbl" htmlFor="email">
                Email:
              </label>
              <input
                className="form-input"
                type="email"
                id="email"
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
                aria-invalid={validEmail ? "false" : "true"}
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
              />
              {/* Password */}
              <label className="form-lbl" htmlFor="password">
                Contraseña:
                {validPwd ? (
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="ml-3 text-green-500"
                  />
                ) : (
                  <FontAwesomeIcon icon={faTimes} className="err-icon" />
                )}
              </label>
              <input
                className="form-input"
                type="password"
                id="password"
                onChange={(e) => setPass(e.target.value)}
                value={pass}
                required
                aria-invalid={validPwd ? "false" : "true"}
                onFocus={() => setPwdFocus(true)}
                onBlur={() => setPwdFocus(false)}
              />
              <div className="group">
                <p
                  id="pwdnote"
                  className={`instructions text-sm text-red-600 ${pwdFocus && !validPwd ? "block" : "hidden"
                    }`}
                >
                  <FontAwesomeIcon icon={faInfoCircle} />Debera ser de 8 a 24 characters.
                  <br />
                  Debera incluir al menos una 
                  <br />
                  Mayuscula, Minuscula,
                  <br />
                  un Número y un caracter Especial
                  <br />
                  Caracteres Especiales Permitidos:{" "}
                  <span aria-label="exclamation mark">!</span>{" "}
                  <span aria-label="at symbol">@</span>{" "}
                  <span aria-label="hashtag">#</span>{" "}
                  <span aria-label="dollar sign">$</span>{" "}
                  <span aria-label="percent">%</span>
                  <span aria-label="percent">?</span>
                  <span aria-label="percent">=</span>
                  <span aria-label="percent">*</span>
                </p>
                {/* Phone */}
                <label className="form-lbl" htmlFor="phone">
                  Telefono:
                </label>
                <input
                  className="form-input"
                  type="tel"
                  id="phone"
                  onChange={(e) => setPhone(e.target.value)}
                  value={phone}
                  required
                  pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
                />
                <div className="float-right">
                  <button
                    className="btn-primary"
                    type='submit'
                    disabled={
                      !validName ||
                      !validFirstName ||
                      !validSecondName ||
                      !validEmail ||
                      !validPwd
                    }
                  >
                    Registrar Cliente
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
    </div>
  );
}

export default AddClient;
