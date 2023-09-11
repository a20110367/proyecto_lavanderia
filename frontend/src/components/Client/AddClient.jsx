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
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setValidName(USER_REGEX.test(name));
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
    <div className="signup-form">
      <div className="bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1">
        <strong>Añadir Cliente</strong>
      </div>
      {success ? (
        <section>
          <h1>Success!</h1>
          <p>
            <a href="/login">Sign In</a>
          </p>
        </section>
      ) : (
        <section className="bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1">
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1 className="font-medium text-lg text-gray-500 mt-4">
            Por favor añada los detalles del cliente
          </h1>
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <label className="text-lg font-medium" htmlFor="name">
              Name
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
            {/* Email */}
            <label className="text-lg font-medium" htmlFor="email">
              Email
            </label>
            <input
              className="w-full border-2 border-gray-500 rounded-xl p-4 mt-1 bg-transparent"
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
            {/* Phone */}
            <label className="text-lg font-medium" htmlFor="phone">
              Telefono
            </label>
            <input
              className="w-full border-2 border-gray-500 rounded-xl p-4 mt-1 bg-transparent"
              type="tel"
              id="phone"
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
              required
              pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
            />
            {/* Password */}
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

            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-11"
              disabled={
                !validName ||
                !validFirstName ||
                !validSecondName ||
                !validEmail ||
                !validPwd
              }
            >
              Sign Up
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2 ml-3"
              onClick={() => navigate("/clients")}
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

export default AddClient;
