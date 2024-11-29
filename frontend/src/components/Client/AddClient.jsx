import { useRef, useState, useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../api/api";

function AddClient() {
  const userRef = useRef();
  const errRef = useRef();

  const [name, setName] = useState("");
  const [firstLN, setFirstLN] = useState("");
  const [secondLN, setSecondLN] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [validName, setValidName] = useState(false);
  const [nameFocus, setNameFocus] = useState(false);

  const [validFirstName, setValidFirstName] = useState(false);
  const [firstNameFocus, setFirstNameFocus] = useState(false);

  const [validSecondName, setValidSecondName] = useState(false);
  const [secondNameFocus, setSecondNameFocus] = useState(false);

  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

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
    setErrMsg("");
  }, [name, firstLN, secondLN, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validName || !validFirstName || !validSecondName || !validEmail) {
      setErrMsg("Invalid Entry");
      return;
    }

    try {
      const res = await api.post("/clients", {
        name: name,
        firstLN: firstLN,
        secondLN: secondLN,
        email: email,
        phone: phone,
        pass: "",
      });
      if(res.status === 201){
        setSuccess(true);
        setName("");
        setFirstLN("");
        setSecondLN("");
        setEmail("");
        setPhone("");
      }

      const source = new URLSearchParams(location.search).get("source");

      if (source === "encargo") {
        navigate(`/recepcionLavanderia?serviceType=${source}`);
      } else if (source === "autoservicio") {
        navigate(`/autoservicio?serviceType=${source}`);
      } else if (source === "planchado") {
        navigate(`/recepcionPlanchado?serviceType=${source}`);
      } else if (source === "tintoreria") {
        navigate(`/recepcionTintoreria?serviceType=${source}`);
      } else if (source === "varios") {
        navigate(`/recepcionVarios?serviceType=${source}`);
      } else if (source === "productos") {
        navigate(`/recepcionProductos?serviceType=${source}`);
      } else {
        navigate("/clients");
      }
    } catch (err) {
      console.log(err);
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
  const handleCancel = () => {
    const source = new URLSearchParams(location.search).get("source");
    console.log("Source:", source);

    if (source === "encargo") {
      navigate(`/recepcionLavanderia?serviceType=${source}`);
    } else if (source === "autoservicio") {
      navigate(`/autoservicio?serviceType=${source}`);
    } else if (source === "planchado") {
      navigate(`/recepcionPlanchado?serviceType=${source}`);
    } else if (source === "tintoreria") {
      navigate(`/recepcionTintoreria?serviceType=${source}`);
    } else if (source === "varios") {
      navigate(`/recepcionVarios?serviceType=${source}`);
    } else if (source === "productos") {
      navigate(`/recepcionProductos?serviceType=${source}`);
    } else {
      navigate("/clients");
    }
  };

  return (
    <div className="signup-form">
      <div className="form-container">
        {/* <button className="flex-none px-2 py-2 rounded-rtn shadow-md bg-NonPhotoblue hover:text-white"><IoIosArrowBack size={30}/></button> */}
        <div className="HeadContent">
          <h2 className="title text-white">
            <em>Añadir a un Cliente</em>
          </h2>
          <p className="form-lbl text-white">
            Ingrese los detalle del cliente.
          </p>
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

              {/* First Name */}
              <label className="form-lbl" htmlFor="firstName">
                Apellido Paterno:
                {validFirstName ? (
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="ml-3 text-green-500"
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faTimes}
                    className="ml-3 text-red-500"
                  />
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
                  <FontAwesomeIcon
                    icon={faTimes}
                    className="ml-3 text-red-500"
                  />
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
                  type="submit"
                  disabled={
                    !validName ||
                    !validFirstName ||
                    !validSecondName ||
                    !validEmail
                  }
                >
                  Registrar Cliente
                </button>
                <button className="btn-cancel" onClick={handleCancel}>
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

export default AddClient;
