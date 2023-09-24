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

function Signup() {
  const userRef = useRef();
  const errRef = useRef();

  const [userName, setUserName] = useState("");
  const [validUserName, setValidUserName] = useState(false);
  const [userNameFocus, setUserNameFocus] = useState(false);

  const [name, setName] = useState("");
  const [validName, setValidName] = useState(false);
  const [nameFocus, setNameFocus] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [validFirstName, setValidFirstName] = useState(false);
  const [firstNameFocus, setFirstNameFocus] = useState(false);

  const [secondName, setSecondName] = useState("");
  const [validSecondName, setValidSecondName] = useState(false);
  const [secondNameFocus, setSecondNameFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [rol, setRol] = useState("cajero");

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setValidUserName(USER_REGEX.test(userName));
  }, [userName]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [userName, pwd, matchPwd]);

  useEffect(() => {
    setValidName(USER_REGEX.test(name));
  }, [name]);

  useEffect(() => {
    setValidFirstName(firstName.trim().length > 0);
  }, [firstName]);

  useEffect(() => {
    setValidSecondName(secondName.trim().length > 0);
  }, [secondName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if button enabled with JS hack
    const v1 = USER_REGEX.test(userName);
    const v2 = PWD_REGEX.test(pwd);
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      await Axios.post("http://localhost:5000/users", {
        username: userName,
        name: name,
        userName: userName,
        firstName: firstName,
        secondName: secondName,
        email: email,
        phone: phone,
        rol: rol,
        pass: pwd,
      });
      //console.log(JSON.stringify(response))
      setSuccess(true);
      //clear state and controlled inputs
      setUserName("");
      setPwd("");
      setMatchPwd("");
      navigate("/dashboard");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 409) {
        setErrMsg("Username Taken");
      } else {
        setErrMsg("Registration Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <div className="signup-form">
      <div className=" basic-container w-5/12">
        <strong className="subtitle">Favor de rellenar los campos solicitados
          para añadir el usuario</strong>
      </div>
      {success ? (
        <section>
          <h1>Success!</h1>
          <p>
            <a href="/users">Usuarios</a>
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
            {/**Nombre empleado */}
            <label className="subtitle mt-0" htmlFor="name">
              Nombre del empleado:
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
            <label className="subtitle" htmlFor="username">
              Nombre de usuario:
              {validUserName ? (
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
                Letras, numeros, guiones y guiones bajos estan permitidos.
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
                <FontAwesomeIcon icon={faTimes} className="err-icon" />
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
                <FontAwesomeIcon icon={faTimes} className="err-icon" />
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
                className={`instructions ${pwdFocus && !validPwd ? "block" : "hidden"
                  }`}
              >
                <FontAwesomeIcon icon={faInfoCircle} />De 8 a 24 caracteres.
                <br />
                Debera incluir al menos una Mayuscula, Minuscula,
                un Número y un caracter Especial
                <br />
                Caracteres Especiale Permitidos:{" "}
                <span aria-label="exclamation mark">!</span>{" "}
                <span aria-label="at symbol">@</span>{" "}
                <span aria-label="hashtag">#</span>{" "}
                <span aria-label="dollar sign">$</span>{" "}
                <span aria-label="percent">%</span>
                <span aria-label="percent">?</span>
                <span aria-label="percent">=</span>
                <span aria-label="percent">*</span>
              </p>
            </div>

            <label className="subtitle" htmlFor="confirm_pwd">
              Confirmar Contraseña:
              {validMatch && matchPwd ? (
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
                className={`instructions ${matchFocus && !validMatch ? "block" : "hidden"
                  }`}
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                Debe coindicir con el primer campo de la contraseña.
              </p>
            </div>
            <div className="mt-3">
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

              <label
                className="subtitle mx-2"
                htmlFor="phone"
              >
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

              <label className="subtitle mx-2" htmlFor="rol">
                Rol:
              </label>

              <select
                className="select-prim"
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                name="rol"
                id="rol"
              >
                <option value="cajero">Cajero</option>
                <option value="admin">Administrador</option>
              </select>
              <div className="float-right">
                <button
                  className="btn-primary mx-2"
                  disabled={
                    !validUserName || !validPwd || !validMatch ? true : false
                  }
                >
                  Añadir Empleado
                </button>
                <button
                  className="btn-cancel mx-2"
                  onClick={() => navigate("/users")}
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

export default Signup;
