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
      <div className="signup-form">
        <div className=" basic-container w-5/12">
          <strong className="input-label">Por favor añada los detalles del cliente</strong>
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
              <label className="input-label" htmlFor="name">
                Name
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
              <label className="input-label" htmlFor="username">
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
                  <FontAwesomeIcon icon={faInfoCircle} /> 4 to 24 characters.
                  <br />
                  Must begin with a letter.
                  <br />
                  Letters, numbers, underscores, hyphens allowed.
                </p>
              </div>

              {/* First Name */}
              <label className="input-label" htmlFor="firstName">
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
              <label className="input-label" htmlFor="secondName">
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
              <label className="input-label" htmlFor="email">
                Email
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
              {/* Phone */}
              <label className="input-label" htmlFor="phone">
                Telefono
              </label>
              <input
                className="input-prim"
                type="tel"
                id="phone"
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
                required
                pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
              />
              {/* Password */}
              <label className="input-label" htmlFor="password">
                Password
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
            </form>
          </section>
        )}
      </div>
    );
  }

  export default AddClient;
