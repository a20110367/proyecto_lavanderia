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

function EditUser() {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

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

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setValidName(USER_REGEX.test(user));
  }, [user]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd, matchPwd]);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getUserById = async () => {
      const response = await Axios.get(`http://localhost:5000/users/${id}`);
      setUser(response.data.name);
      setPwd(response.data.pass);
      setEmail(response.data.email);
      setPhone(response.data.phone);
      setRol(response.data.rol);
    };
    getUserById();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(user);
    console.log(pwd);
    console.log(email);
    console.log(phone);
    console.log(accessToken);
    console.log(rol);

    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      await Axios.patch(`http://localhost:5000/users/${id}`, {
        name: user,
        email: email,
        accessToken: "afefeg5gs656fsdf67",
        phone: phone,
        rol: rol,
        pass: pwd,
      });

      setSuccess(true);

      setUser("");
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
      <div className=" bg-white px-4 pt-3 pb-4 rounded-md border vorder-gray-200 flex-1">
        <strong>Actualizar Datos Usuario</strong>
      </div>
      {success ? (
        <section>
          <h1>Success!</h1>
          <p>
            <a href="/login">Sign In</a>
          </p>
        </section>
      ) : (
        <section className="bg-white px-4 pt-3 pb-4 rounded-md border vorder-gray-200 flex-1">
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1 className="font-medium text-lg text-gray-500 ">
            Actualizando perfil de: {user}
          </h1>
          <form onSubmit={handleSubmit}>
            <label className="text-lg font-medium" htmlFor="username">
              Username:
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
              id="username"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              value={user}
              required
              aria-invalid={validName ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
            />
            <div className="group">
              <p
                id="uidnote"
                className={`instructions text-sm text-red-600 ${
                  userFocus && user && !validName ? "block" : "hidden"
                }`}
              >
                <FontAwesomeIcon icon={faInfoCircle} /> 4 to 24 characters.
                <br />
                Must begin with a letter.
                <br />
                Letters, numbers, underscores, hyphens allowed.
              </p>
            </div>
            <label className="text-lg font-medium" htmlFor="password">
              Password:
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
              type="text"
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
              Confirm Password:
              {validMatch && matchPwd ? (
                <FontAwesomeIcon icon={faCheck} className="ml-3 text-green-500" />
              ) : (
                <FontAwesomeIcon icon={faTimes} className="ml-3 text-red-500" />
              )}
            </label>
            <input
              className="w-full border-2 border-gray-500 rounded-xl p-4 mt-1 bg-transparent"
              type="text"
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
              <label className="pl-5 pr-2 text-lg font-medium" htmlFor="email">
                Email:
              </label>
              <input
                className=" border-2 border-gray-500 rounded-xl p-4 mt-1 bg-transparent"
                type="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />

              <label className="pl-5 pr-2 text-lg font-medium" htmlFor="phone">
                Telefono:
              </label>
              <input
                className="border-2 border-gray-500 rounded-xl p-4 mt-1 bg-transparent"
                type="tel"
                id="phone"
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
                required
                pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
              />

              <label className="pl-5 pr-2 text-lg font-medium" htmlFor="rol">
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
              disabled={!validName || !validPwd || !validMatch ? true : false}
            >
              Actualizar
            </button>
          </form>
        </section>
      )}
      <NavBar></NavBar>
    </div>
  );
}

export default EditUser;
