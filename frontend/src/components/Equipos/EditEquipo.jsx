import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api from '../../api/api'

const MODEL_REGEX = /^[A-z0-9-_ ]{1,191}$/;
const TIME_REGEX = /^[0-9]{1,}$/;
const WEIGHT_REGEX = /^[0-9]{1,}$/;

function EditEquipo() {
  const modelRef = useRef();
  const errRef = useRef();

  const [model, setModel] = useState("");
  const [ipAddress, setIpAddress] = useState('')
  const [validModel, setValidModel] = useState(false);
  const [modelFocus, setModelFocus] = useState(false);

  const [machineType, setMachineType] = useState("lavadora");
  const [noMachine, setNoMachine] = useState();
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

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getMachineById = async () => {
      const response = await api.get(`/machines/${id}`);
      setModel(response.data.model);
      setNoMachine(response.data.machineNumber)
      setMachineType(response.data.machineType);
      setCicleTime(response.data.cicleTime.toString());
      setWeight(response.data.weight.toString());
      setIpAddress(response.data.ipAddress)
      setStatus(response.data.status);
      setNotes(response.data.notes);
    };
    getMachineById();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const v1 = MODEL_REGEX.test(model);
    const v2 = TIME_REGEX.test(cicleTime);
    const v3 = WEIGHT_REGEX.test(weight);

    if (!v1 || !v2 || !v3) {
      setErrMsg("Entrada no válida");
      return;
    }

    try {
      await api.patch(`/machines/${id}`, {
        model: model,
        machineNumber: noMachine,
        machineType: machineType,
        cicleTime: parseInt(cicleTime),
        weight: parseInt(weight),
        status: status,
        ipAddress: ipAddress ? ipAddress : null,
        notes: notes,
      });

      setSuccess(true);

      setModel("");
      setCicleTime("");
      setWeight("");
      setNotes("");
      navigate("/equipos");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("Sin respuesta del servidor");
      } else {
        setErrMsg("Fallo al actualizar el equipo");
      }
      errRef.current.focus();
    }
  };

  return (
    <div className="signup-form">
      <div className="form-container">
        <div className="HeadContent">
          <p className="title text-white">Editando a el Equipo:</p>
          <strong className="title-strong">{model}</strong>
        </div>
        {success ? (
          <section>
            <h1>¡Éxito!</h1>
            <p>
              <a href="/equipos">Volver a Equipos</a>
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

              {/* Tipo de Máquina */}
              <label className="form-lbl" htmlFor="machineType">
                Tipo de Máquina:
              </label>
              <select
                className="form-input bg-gray-100"
                value={machineType}
                onChange={(e) => setMachineType(e.target.value)}
                name="machineType"
                id="machineType"
                disabled
              >
                <option value="lavadora">Lavadora</option>
                <option value="secadora">Secadora</option>
              </select>

              {/** Número de Equipo */}
              <label className="form-lbl" htmlFor="noMachine">
                No. de Equipo:
              </label>
              <input
                className="form-input bg-gray-100"
                type="number"
                id="noMachine"
                onChange={(e) => setNoMachine(e.target.value)}
                value={noMachine}
                required
                disabled
              />

              {/* Modelo */}
              <label className="form-lbl" htmlFor="model">
                Modelo:
                {validModel ? (
                  <FontAwesomeIcon icon={faCheck} className="ml-3 text-green-500" />
                ) : (
                  <FontAwesomeIcon icon={faTimes} className="err-icon" />
                )}
              </label>
              <input
                className="form-input"
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

              {/* Tiempo de Ciclo */}
              <label className="form-lbl" htmlFor="cicleTime">
                Tiempo de Ciclo (Horas):
                {validCicleTime ? (
                  <FontAwesomeIcon icon={faCheck} className="ml-3 text-green-500" />
                ) : (
                  <FontAwesomeIcon icon={faTimes} className="err-icon" />
                )}
              </label>
              <input
                className="form-input"
                type="text"
                id="cicleTime"
                onChange={(e) => setCicleTime(e.target.value)}
                value={cicleTime}
                required
                aria-invalid={validCicleTime ? "false" : "true"}
                onFocus={() => setCicleTimeFocus(true)}
                onBlur={() => setCicleTimeFocus(false)}
              />

              {/* Peso */}
              <label className="form-lbl" htmlFor="weight">
                Peso (Kg):
                {validWeight ? (
                  <FontAwesomeIcon icon={faCheck} className="ml-3 text-green-500" />
                ) : (
                  <FontAwesomeIcon icon={faTimes} className="ml-3 text-red-500" />
                )}
              </label>
              <input
                className="form-input"
                type="text"
                id="weight"
                onChange={(e) => setWeight(e.target.value)}
                value={weight}
                required
                aria-invalid={validWeight ? "false" : "true"}
                onFocus={() => setWeightFocus(true)}
                onBlur={() => setWeightFocus(false)}
              />

              {/* Dirección IP */}
              <label className="form-lbl" htmlFor="weight">
                Dirección IP:
              </label>
              <input
                className="form-input"
                type="text"
                id="ipAddress"
                onChange={(e) => setIpAddress(e.target.value)}
                value={ipAddress}
              />

              {/* Estado */}
              <label className="form-lbl" htmlFor="status">
                Estado:
              </label>
              <select
                className="form-input"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                name="status"
                id="status"
              >
                <option value="available">Disponible</option>
                <option value="unavailable">No disponible</option>
              </select>

              {/* Notas */}
              <label className="form-lbl" htmlFor="notes">
                Notas:
              </label>
              <textarea
                className="form-input"
                id="notes"
                onChange={(e) => setNotes(e.target.value)}
                value={notes}
              />
              <button
                className="btn-edit"
                disabled={!validModel || !validCicleTime || !validWeight}
              >
                Actualizar
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
    </div>
  );
}

export default EditEquipo;
