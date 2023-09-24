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

const MODEL_REGEX = /^[A-z0-9-_]{1,191}$/;
const TIME_REGEX = /^[0-9]{1,}$/;
const WEIGHT_REGEX = /^[0-9]{1,}$/;

function AddEquipo() {
  const modelRef = useRef();
  const errRef = useRef();

  const [model, setModel] = useState("");
  const [validModel, setValidModel] = useState(false);
  const [modelFocus, setModelFocus] = useState(false);

  const [machineType, setMachineType] = useState("lavadora");
  const [cicleTime, setCicleTime] = useState("");
  const [validCicleTime, setValidCicleTime] = useState(false);
  const [cicleTimeFocus, setCicleTimeFocus] = useState(false);

  const [weight, setWeight] = useState("");
  const [validWeight, setValidWeight] = useState(false);
  const [weightFocus, setWeightFocus] = useState(false);

  const [status, setStatus] = useState("available");
  const [notes, setNotes] = useState("");

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    modelRef.current.focus();
  }, []);

  useEffect(() => {
    setValidModel(MODEL_REGEX.test(model));
  }, [model]);

  useEffect(() => {
    setValidCicleTime(TIME_REGEX.test(cicleTime));
  }, [cicleTime]);

  useEffect(() => {
    setValidWeight(WEIGHT_REGEX.test(weight));
  }, [weight]);

  useEffect(() => {
    setErrMsg("");
  }, [model, cicleTime, weight]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de campos
    if (!validModel || !validCicleTime || !validWeight) {
      setErrMsg("Por favor, complete los campos correctamente.");
      return;
    }

    try {
      await Axios.post("http://localhost:5000/machines", {
        machineType: machineType,
        model: model,
        cicleTime: parseInt(cicleTime),
        weight: parseInt(weight),
        status: status,
        notes: notes,
      });

      setSuccess(true);

      // Limpiar los campos después de enviar el formulario
      setModel("");
      setCicleTime("");
      setWeight("");
      setNotes("");
      navigate("/equipos");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No hay respuesta del servidor.");
      } else {
        setErrMsg("Error al agregar el equipo.");
      }
      errRef.current.focus();
    }
  };

  return (
    <div className="add-equipo-form">
      <div className="basic-container w-5/12">
        <strong className="subtitle">Por favor, complete los datos del equipo</strong>
      </div>
      {success ? (
        <section>
          <h1>¡Éxito!</h1>
          <p>
            <a href="/equipos">Ver Equipos</a>
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
            {/** Tipo de Máquina */}
            <label className="subtitle mt-0" htmlFor="machineType">
              Tipo de Máquina:
            </label>
            <select
              className="select-2ry"
              id="machineType"
              value={machineType}
              onChange={(e) => setMachineType(e.target.value)}
            >
              <option value="lavadora">Lavadora</option>
              <option value="secadora">Secadora</option>
            </select>

            {/** Modelo */}
            <label className="subtitle" htmlFor="model">
              Modelo:
              {validModel ? (
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
              id="model"
              ref={modelRef}
              autoComplete="off"
              onChange={(e) => setModel(e.target.value)}
              value={model}
              required
              aria-invalid={validModel ? "false" : "true"}
              onFocus={() => setModelFocus(true)}
              onBlur={() => setModelFocus(false)}
            />

            {/** Tiempo de Ciclo */}
            <label className="subtitle" htmlFor="cicleTime">Tiempo de Ciclo (Minutos):
              {validCicleTime ? (
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
              type="number"
              id="cicleTime"
              onChange={(e) => setCicleTime(e.target.value)}
              value={cicleTime}
              required
              aria-invalid={validCicleTime ? "false" : "true"}
              onFocus={() => setCicleTimeFocus(true)}
              onBlur={() => setCicleTimeFocus(false)}
            />

            {/** Peso */}
            <label className="subtitle" htmlFor="weight">
              Peso (kg):
              {validWeight ? (
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
              type="number"
              id="weight"
              onChange={(e) => setWeight(e.target.value)}
              value={weight}
              required
              aria-invalid={validWeight ? "false" : "true"}
              onFocus={() => setWeightFocus(true)}
              onBlur={() => setWeightFocus(false)}
            />

            {/** Estado */}
            <label className="subtitle" htmlFor="status">
              Estado:
            </label>
            <select
              className="select-2ry"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              name="status"
              id="status"
            >
              <option value="available">Disponible</option>
              <option value="unavailable">No disponible</option>
            </select>

            {/** Notas */}
            <label className="subtitle" htmlFor="notes">
              Notas:
            </label>
            <textarea
              className="input-lg"
              id="notes"
              onChange={(e) => setNotes(e.target.value)}
              value={notes}
            />
              <button
                className="btn-primary"
                disabled={!validModel || !validCicleTime || !validWeight}
              >
                Registrar Equipo
              </button>
              <button
                className="btn-cancel"
                onClick={() => navigate("/equipos")}
              >
                Cancelar
              </button>
          </form>
        </section>
      )}
    </div>
  );
}

export default AddEquipo;
