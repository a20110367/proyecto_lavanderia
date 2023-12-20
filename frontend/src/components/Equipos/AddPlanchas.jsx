import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

const WEIGHT_REGEX = /^[0-9]{1,}$/;
const DESCRIPTION_REGEX = /^[A-z0-9-_ ]{1,191}$/;

function AddPlancha() {
  const errRef = useRef();
  const descriptionRef = useRef();

  const [description, setDescription] = useState("");
  const [validDescription, setValidDescription] = useState(false);
  const [descriptionFocus, setDescriptionFocus] = useState(false);

  const [machineType, setMachineType] = useState("plancha");

  const [pieces, setPieces] = useState("");
  const [validPieces, setValidPieces] = useState(false);
  const [piecesFocus, setPiecesFocus] = useState(false);

  const [status, setStatus] = useState("available");
  const [notes, setNotes] = useState("");

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    descriptionRef.current.focus();
  }, []);

  useEffect(() => {
    setValidDescription(DESCRIPTION_REGEX.test(description));
  }, [description]);

  useEffect(() => {
    setValidPieces(WEIGHT_REGEX.test(pieces));
  }, [pieces]);

  useEffect(() => {
    setErrMsg("");
  }, [pieces, description]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de campos
    if (!validDescription || !validPieces) {
      setErrMsg("Por favor, complete los campos correctamente.");
      return;
    }

    try {
      await api.post("/ironStations", {
        machineType: machineType,
        description: description,
        pieces: parseInt(pieces),
        status: status,
        notes: notes,
      });

      setSuccess(true);

      // Limpiar los campos después de enviar el formulario
      setDescription("");
      setPieces("");
      setNotes("");
      navigate("/planchas");
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
    <div className="signup-form">
      <div className="form-container">
        <div className="HeadContent">
          <h2 className="title text-white">
            <em>Añadir una Plancha</em>
          </h2>
          <p className="form-lbl text-white">
            Ingrese los detalle de la Plancha.
          </p>
          <div className="clearBoth"></div>
        </div>
        {success ? (
          <section>
            <h1>¡Éxito!</h1>
            <p>
              <a href="/planchas">Ver Equipos</a>
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
              {/** Tipo de Máquina */}
              <label className="form-lbl" htmlFor="machineType">
                Tipo de Máquina:
              </label>
              <select
                className="form-input"
                id="machineType"
                value={machineType}
                onChange={(e) => setMachineType(e.target.value)}
              >
                <option value="plancha">Plancha</option>
              </select>

              {/** Modelo */}
              <label className="form-lbl" htmlFor="model">
                Modelo:
                {validDescription ? (
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
                id="model"
                ref={descriptionRef}
                autoComplete="off"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                required
                aria-invalid={validDescription ? "false" : "true"}
                onFocus={() => setDescriptionFocus(true)}
                onBlur={() => setDescriptionFocus(false)}
              />

              {/** Piezas */}
              <label className="form-lbl" htmlFor="weight">
                Piezas:
                {validPieces ? (
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
                type="number"
                id="weight"
                onChange={(e) => setPieces(e.target.value)}
                value={pieces}
                required
                aria-invalid={validPieces ? "false" : "true"}
                onFocus={() => setPiecesFocus(true)}
                onBlur={() => setPiecesFocus(false)}
              />

              {/** Estado */}
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

              {/** Notas */}
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
                className="btn-primary"
                disabled={!validPieces || !validDescription}
              >
                Registrar Equipo
              </button>
              <button
                className="btn-cancel"
                onClick={() => navigate("/planchas")}
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

export default AddPlancha;
