import { useRef, useState, useEffect } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
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

  const [firstLN, setFirstLN] = useState("");
  const [validFirstName, setValidFirstName] = useState(false);
  const [firstNameFocus, setFirstNameFocus] = useState(false);

  const [secondLN, setSecondLN] = useState("");
  const [validSecondName, setValidSecondName] = useState(false);
  const [secondNameFocus, setSecondNameFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [rol, setRol] = useState("employee");

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
    setValidFirstName(firstLN.trim().length > 0);
  }, [firstLN]);

  useEffect(() => {
    setValidSecondName(secondLN.trim().length > 0);
  }, [secondLN]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if button enabled with JS hack
    // const v1 = USER_REGEX.test(userName);
    // const v2 = PWD_REGEX.test(pwd);
    // if (!v1 || !v2) {
    //   setErrMsg("Invalid Entry");
    //   return;
    // }
    try {
      const res = await Axios.post("http://localhost:5000/users", {
        name: name,
        username: userName,
        firstLN: firstLN,
        secondLN: secondLN,
        email: email,
        phone: phone,
        role: rol,
        pass: pwd,
      });
      if(res.status === 201){
        setSuccess(true);
        setUserName("");
        setPwd("");
        setMatchPwd("");
        Swal.fire("Usuario Creado con Exito", "", "success")
        navigate("/users");
      }
    } catch (err) {
      console.log(err)
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 409) {
        err.response.data.p && err.response.data.m 
        ? Swal.fire("Ese número de telefono y correo estan en uso", "Intenta con uno diferente", "warning")
        : err.response.data.p
        ? Swal.fire("Ese número de telefono esta en uso", "Intenta con uno diferente", "warning")
        : err.response.data.m
        ? Swal.fire("Ese correo electronico esta en uso", "Intenta con uno diferente", "warning")
        : console.log("Como llego aqui")
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
          <h2 className="title text-white"><em>Añadir un Empleado</em></h2>
          <p className="form-lbl text-white">Ingrese los detalle del empleado.</p>
          <div className="clearBoth"></div>
        </div>
        {success ? (
          <section >
            <h1>Success!</h1>
            <p>
              <a href="/users">Usuarios</a>
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
              {/**Nombre empleado */}
              <label className="form-lbl" htmlFor="name">
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
                  <FontAwesomeIcon icon={faTimes} className="err-icon" />
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
                  <FontAwesomeIcon icon={faTimes} className="err-icon" />
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

              <label className="form-lbl" htmlFor="username">
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

              <label className="form-lbl" htmlFor="password">
                Contraseña:
                {/* {validPwd ? (
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="ml-3 text-green-500"
                  />
                ) : (
                  <FontAwesomeIcon icon={faTimes} className="err-icon" />
                )} */}
              </label>
              <input
                className="form-input"
                type="password"
                id="password"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                required
                // aria-invalid={validPwd ? "false" : "true"}
                aria-describedby="pwdnote"
                onFocus={() => setPwdFocus(true)}
                onBlur={() => setPwdFocus(false)}
              />

              {/* <div className="group">
                <p
                  id="pwdnote"
                  className={`instructions ${pwdFocus && !validPwd ? "block" : "hidden"
                    }`}
                >
                  <FontAwesomeIcon icon={faInfoCircle} />De 8 a 24 caracteres.
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
              </div> */}

              <label className="form-lbl" htmlFor="confirm_pwd">
                Confirmar Contraseña:
                {/* {validMatch && matchPwd ? (
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="ml-3 text-green-500"
                  />
                ) : (
                  <FontAwesomeIcon icon={faTimes} className="err-icon" />
                )} */}
              </label>
              <input
                className="form-input"
                type="password"
                id="confirm_pwd"
                onChange={(e) => setMatchPwd(e.target.value)}
                value={matchPwd}
                required
                // aria-invalid={validMatch ? "false" : "true"}
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
              <label className="form-lbl" htmlFor="email">
                Email:
              </label>
              <input
                className="form-input"
                type="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />

              <label
                className="form-lbl"
                htmlFor="phone"
              >
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

              <label className="form-lbl" htmlFor="rol">
                Rol:
              </label>

              <select
                className="form-input"
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                name="rol"
                id="rol"
              >
                <option value="employee">Cajero</option>
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
            </form>
          </section>
        )}
      </div>
    </div>
  );
}

export default Signup;
