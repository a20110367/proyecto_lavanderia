import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api from '../../api/api'


function EditClient() {
  const nameRef = useRef();
  const userRef = useRef();
  const errRef = useRef();


  const [name, setName] = useState("");
  const [validName, setValidName] = useState(false);
  const [nameFocus, setNameFocus] = useState(false);


  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [firstLN, setFirstLN] = useState("");
  const [validFirstName, setValidFirstName] = useState(false);
  const [firstnameFocus, setFirstNameFocus] = useState(false);

  const [secondLN, setSecondLN] = useState("");
  const [validSecondName, setValidSecondName] = useState(false);
  const [secondNameFocus, setSecondNameFocus] = useState(false);


  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    nameRef.current.focus();
  }, []);





  useEffect(() => {
    setValidName(name.trim().length > 0);
  }, [name]);



  useEffect(() => {
    setErrMsg("");
  }, [name]);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getClientById = async () => {
      const response = await api.get(`/clientsById/${id}`);

      setName(response.data.name);
      setFirstLN(response.data.firstLN);
      setSecondLN(response.data.secondLN);

      setEmail(response.data.email);
      setPhone(response.data.phone);
    };
    getClientById();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();



    try {
      await api.patch(`/clients/${id}`, {
        name: name,
        firstLN: firstLN,
        secondLN: secondLN,
        email: email,
        phone: phone,
        pass: "",
      });

      setSuccess(true);
      setName("");

      navigate("/clients");
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
      <div className="form-container">
        <div className="HeadContent">
          <p className="title text-white">Editando a el cliente:</p>
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
          <section>
            <p
              ref={errRef}
              className={errMsg ? "errmsg" : "offscreen"}
              aria-live="assertive"
            >
              {errMsg}
            </p>
            <form onSubmit={handleSubmit}>
              {/* Nombre de usuario */}
              <label className="form-lbl" htmlFor="name">
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
                className="form-input"
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

              <label className="form-lbl" htmlFor="firstName">
                Apellido Paterno:
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
                aria-describedby="firstNamenote"
                onFocus={() => setFirstNameFocus(true)}
                onBlur={() => setFirstNameFocus(false)}
              />

              <label className="form-lbl" htmlFor="secondName">
                Apellido Materno:

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
                aria-describedby="secondNamenote"
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


              {/* Teléfono */}
              <label className="form-lbl" htmlFor="phone">
                Teléfono:
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
                {/* Botón para actualizar */}
                <button
                  className="btn-edit"
                  disabled={!validName ? true : false}
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
            </form>
          </section>
        )}
      </div>
    </div>
  );
}

export default EditClient;
