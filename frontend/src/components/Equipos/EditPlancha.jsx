import React, { useState, useEffect, useRef } from "react";
import Axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const WEIGHT_REGEX = /^[0-9]{1,}$/;

function EditEquipo() {

  const errRef = useRef();



  const [machineType, setMachineType] = useState("plancha");


  const [pieces, setPieces] = useState("");
  const [validPieces, setValidPieces] = useState(false);
  const [piecesFocus, serPiecesFocus] = useState(false);

  const [status, setStatus] = useState("available");
  const [notes, setNotes] = useState("");

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);


  useEffect(() => {
    setValidPieces(WEIGHT_REGEX.test(pieces));
  }, [pieces]);

  useEffect(() => {
    setErrMsg("");
  }, [pieces]);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getIronStationsById = async () => {
      const response = await Axios.get(`http://localhost:5000/ironStations/${id}`);
      setMachineType(response.data.machineType);
      setPieces(response.data.pieces.toString());
      setStatus(response.data.status);
      setNotes(response.data.notes);
    };
    getIronStationsById();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const v3 = WEIGHT_REGEX.test(pieces);

    if (!v3) {
      setErrMsg("Entrada no válida");
      return;
    }

    try {
      await Axios.patch(`http://localhost:5000/ironStations/${id}`, {
        machineType: machineType,
        pieces: parseInt(pieces),
        status: status,
        notes: notes,
      });

      setSuccess(true);

      setPieces("");
      setNotes("");
      navigate("/planchas");
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
          <p className="title text-white">Editando la Plancha:</p>
          <strong className="title-strong">{machineType}</strong>
        </div>
        {success ? (
          <section>
            <h1>¡Éxito!</h1>
            <p>
              <a href="/planchas">Volver a Planchas</a>
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
                className="form-input"
                value={machineType}
                onChange={(e) => setMachineType(e.target.value)}
                name="machineType"
                id="machineType"
              >
                <option value="Plancha">Plancha</option>
              </select>

              {/* Peso */}
              <label className="form-lbl" htmlFor="weight">
                Piezas:
                {validPieces ? (
                  <FontAwesomeIcon icon={faCheck} className="ml-3 text-green-500" />
                ) : (
                  <FontAwesomeIcon icon={faTimes} className="ml-3 text-red-500" />
                )}
              </label>
              <input
                className="form-input"
                type="text"
                id="weight"
                onChange={(e) => setPieces(e.target.value)}
                value={pieces}
                required
                aria-invalid={validPieces ? "false" : "true"}
                onFocus={() => serPiecesFocus(true)}
                onBlur={() => serPiecesFocus(false)}
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
                disabled={!validPieces}
              >
                Actualizar
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

export default EditEquipo;
