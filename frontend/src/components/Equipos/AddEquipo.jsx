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
      <div className=" bg-white px-4 pt-3 pb-4 rounded-sm border vorder-gray-200 flex-1">
        <strong>Añadir Equipo</strong>
      </div>
      {success ? (
        <section>
          <h1>¡Éxito!</h1>
          <p>
            <a href="/equipos">Ver Equipos</a>
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
            Por favor, complete los datos del equipo
          </h1>
          <form onSubmit={handleSubmit}>
            {/** Tipo de Máquina */}
            <label className="text-lg font-medium" htmlFor="machineType">
              Tipo de Máquina:
            </label>
            <select
              className="w-full border-2 border-gray-500 rounded-xl p-4 mt-1 bg-transparent"
              id="machineType"
              value={machineType}
              onChange={(e) => setMachineType(e.target.value)}
            >
              <option value="lavadora">Lavadora</option>
              <option value="secadora">Secadora</option>
            </select>

            {/** Modelo */}
            <label className="text-lg font-medium" htmlFor="model">
              Modelo:
              {validModel ? (
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
            <label className="text-lg font-medium" htmlFor="cicleTime">
              Tiempo de Ciclo (Horas):
              {validCicleTime ? (
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
            <label className="text-lg font-medium" htmlFor="weight">
              Peso (kg):
              {validWeight ? (
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
            <label className="text-lg font-medium" htmlFor="status">
              Estado:
            </label>
            <select
              className="w-full border-2 border-gray-500 rounded-xl p-4 mt-1 bg-transparent"
              value={status}
              onChange={(e) => setStatus(e.target.value)} 
              name="status"
              id="status"
            >
              <option value="available">Disponible</option>
              <option value="unavailable">No disponible</option>
            </select>

            {/** Notas */}
            <label className="text-lg font-medium" htmlFor="notes">
              Notas:
            </label>
            <textarea
              className="w-full border-2 border-gray-500 rounded-xl p-4 mt-1 bg-transparent"
              id="notes"
              onChange={(e) => setNotes(e.target.value)}
              value={notes}
            />

            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-11"
              disabled={!validModel || !validCicleTime || !validWeight}
            >
              Agregar equipo
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2 ml-3"
              onClick={() => navigate("/equipos")}
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

export default AddEquipo;
