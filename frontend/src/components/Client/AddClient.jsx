import Navbar from "../../routes/Navbar";
import { useRef, useState, useEffect } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[?=!@#$*]).{8,24}$/;

function AddClient() {
  const userRef = useRef();
  const errRef = useRef();

  const [userName, setUserName] = useState("");
  const [validUserName, setValidUserName] = useState(false);
  const [userNameFocus, setUserNameFocus] = useState(false);

  const [name, setName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
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
    setValidFirstName(firstName.trim().length > 0);
  }, [firstName]);

  useEffect(() => {
    setValidSecondName(secondName.trim().length > 0);
  }, [secondName]);

  useEffect(() => {
    setValidEmail(email.trim().length > 0);
  }, [email]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pass));
  }, [pass]);

  useEffect(() => {
    setErrMsg("");
  }, [name, firstName, secondName, email, pass]);

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
      await Axios.post("http://localhost:5000/clients", {
        username: userName,
        name: name,
        firstName: firstName,
        secondName: secondName,
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
    <div>
      <div className=" basic-container w-5/12">
        <strong className="subtitle">Por favor añada los detalles del cliente</strong>
      </div>
      {success ? (
        <section>
          <h1>Success!</h1>
          <p>
            <a href="/clients">Clientes</a>
          </p>
        </section>
      ) : (
        <section className="basic-container">
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <label className="subtitle mt-0" htmlFor="name">
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
              className="input-prim"
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
                className={`instructions text-sm text-red-600 ${userNameFocus && userName && !validUserName
                  ? "block"
                  : "hidden"
                  }`}
              >
                <FontAwesomeIcon icon={faInfoCircle} />Debera ser de 4 a 24 caracteres.
                <br />
                Debera iniciar con una letra.
                <br />
                Letras, números, guiones y guiones bajos permitidos.
              </p>
            </div>

            {/* First Name */}
            <label className="subtitle" htmlFor="firstName">
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
              className="input-prim"
              type="text"
              id="firstName"
              autoComplete="off"
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
              required
              aria-invalid={validFirstName ? "false" : "true"}
              onFocus={() => setFirstNameFocus(true)}
              onBlur={() => setFirstNameFocus(false)}
            />
            {/* Second Name */}
            <label className="subtitle" htmlFor="secondName">
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
              className="input-prim"
              type="text"
              id="secondName"
              autoComplete="off"
              onChange={(e) => setSecondName(e.target.value)}
              value={secondName}
              required
              aria-invalid={validSecondName ? "false" : "true"}
              onFocus={() => setSecondNameFocus(true)}
              onBlur={() => setSecondNameFocus(false)}
            />
            {/* Email */}
            <label className="subtitle" htmlFor="email">
              Email:
            </label>
            <input
              className="input-prim"
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
            <label className="subtitle" htmlFor="password">
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
              className="input-prim"
              type="password"
              id="password"
              onChange={(e) => setPass(e.target.value)}
              value={pass}
              required
              aria-invalid={validPwd ? "false" : "true"}
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
            />
            <div className="group mt-3">
              <p
                id="pwdnote"
                className={`instructions text-sm text-red-600 ${pwdFocus && !validPwd ? "block" : "hidden"
                  }`}
              >
                <FontAwesomeIcon icon={faInfoCircle} />Debera ser de 8 a 24 characters.
                <br />
                Debera incluir una Mayuscula, una Minuscula, un Número y un Caracter Especial
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
              <label className="subtitle mx-2" htmlFor="phone">
                Telefono:
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
  );
}

export default AddClient;
