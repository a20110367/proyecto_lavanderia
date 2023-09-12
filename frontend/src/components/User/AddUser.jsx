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
  const [accessToken, setAccessToken] = useState("");
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
    console.log(userName);
    console.log(pwd);
    console.log(email);
    console.log(phone);
    console.log(accessToken);
    console.log(rol);
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
        email: email,
        accessToken: "afefeg5gs656fsdf67",
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
      navigate("/login");
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
      <div className=" bg-white px-4 pt-3 pb-4 rounded-sm border vorder-gray-200 flex-1">
        <strong>Añadir Usuario</strong>
      </div>
      {success ? (
        <section>
          <h1>Success!</h1>
          <p>
            <a href="/login">Sign In</a>
          </p>
        </section>
      ) : (
        <section className="bg-white px-4 pt-3 pb-4 rounded-sm border vorder-gray-200 flex-1">
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1 className="font-medium text-lg text-gray-500 mt-4">
            Por favor añade los datos de Registro
          </h1>
          <form onSubmit={handleSubmit}>
            {/**Nombre empleado */}
            <label className="text-lg font-medium" htmlFor="name">
              Nombre del empleado
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
              className="w-full border-2 border-gray-500 rounded-xl p-4 mt-1 bg-transparent"
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
            <label className="text-lg font-medium" htmlFor="username">
              Nombre de usuario
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
              className="w-full border-2 border-gray-500 rounded-xl p-4 mt-1 bg-transparent"
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
                <FontAwesomeIcon icon={faInfoCircle} /> 4 to 24 characters.
                <br />
                Must begin with a letter.
                <br />
                Letters, numbers, underscores, hyphens allowed.
              </p>
            </div>

            {/* First Name */}
            <label className="text-lg font-medium" htmlFor="firstName">
              Apellido Paterno
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
              className="w-full border-2 border-gray-500 rounded-xl p-4 mt-1 bg-transparent"
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
            <label className="text-lg font-medium" htmlFor="secondName">
              Apellido Materno
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
              className="w-full border-2 border-gray-500 rounded-xl p-4 mt-1 bg-transparent"
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
            <label className="text-lg font-medium" htmlFor="password">
              Password
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
              className="w-full border-2 border-gray-500 rounded-xl p-4 mt-1 bg-transparent"
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
                <FontAwesomeIcon icon={faInfoCircle} /> 8 to 24 characters.
                <br />
                Must include uppercase and lowercase letters, a number and a
                special character.
                <br />
                Allowed special characters:{" "}
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
            <label className="text-lg font-medium" htmlFor="confirm_pwd">
              Confirm Password
              {validMatch && matchPwd ? (
                <FontAwesomeIcon
                  icon={faCheck}
                  className="ml-3 text-green-500"
                />
              ) : (
                <FontAwesomeIcon icon={faTimes} className="ml-3 text-red-500" />
              )}
            </label>
            <input
              className="w-full border-2 border-gray-500 rounded-xl p-4 mt-1 bg-transparent"
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
                <FontAwesomeIcon icon={faInfoCircle} /> Must match the first
                password input field.
              </p>
            </div>
            <div className="mt-3">
              <label className=" pl-5 pr-2 text-lg font-medium" htmlFor="email">
                Email
              </label>
              <input
                className=" border-2 border-gray-500 rounded-xl p-4 mt-1 bg-transparent"
                type="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />

              <label
                className="  pl-5 pr-2 text-lg font-medium"
                htmlFor="phone"
              >
                Telefono
              </label>
              <input
                className=" border-2 border-gray-500 rounded-xl p-4 mt-1 bg-transparent"
                type="tel"
                id="phone"
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
                required
                pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
              />

              <label className=" pl-5 pr-2 text-lg font-medium" htmlFor="rol">
                Rol:
              </label>

              <select
                className=" appearance-none bg-white border-2 border-gray-300 rounded-lg py-3 px-4 pr-8 leading-tight focus:outline-none focus:border-green-500 focus:shadow-outline-green"
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                name="rol"
                id="rol"
              >
                <option value="cajero">Cajero</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-11"
              disabled={
                !validUserName || !validPwd || !validMatch ? true : false
              }
            >
              Sign Up
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2 ml-3"
              onClick={() => navigate("/users")}
            >
              Cancelar
            </button>
          </form>
        </section>
      )}
      <Navbar></Navbar>
    </div>
  );
}

export default Signup;
