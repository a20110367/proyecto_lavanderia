import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api from "../../api/api";

const WEIGHT_REGEX = /^[0-9]{1,}$/;
const DESCRIPTION_REGEX = /^[A-z0-9-_ ]{1,191}$/;

function EditEquipo() {
  const errRef = useRef();
  const descriptionRef = useRef();

  const [description, setDescription] = useState("");
  const [validDescription, setValidDescription] = useState(false);
  const [descriptionFocus, setDescriptionFocus] = useState(false);

  const [machineType, setMachineType] = useState("plancha");

  const [pieces, setPieces] = useState("");
  const [validPieces, setValidPieces] = useState(false);
  const [piecesFocus, serPiecesFocus] = useState(false);
  const [freeForUse, setFreeForUse] = useState();

  const [status, setStatus] = useState("available");
  const [notes, setNotes] = useState("");

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

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

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getIronStationsById = async () => {
      const response = await api.get(`/ironStations/${id}`);
      setDescription(response.data.description);
      setMachineType(response.data.machineType);
      setFreeForUse(response.data.freeForUse)
      setPieces(response.data.pieces.toString());
      setStatus(response.data.status);
      setNotes(response.data.notes);
    };
    getIronStationsById();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const v3 = WEIGHT_REGEX.test(pieces);
    const v1 = DESCRIPTION_REGEX.test(description);

    if (!v1 || !v3) {
      setErrMsg("Entrada no válida");
      return;
    }

    if (freeForUse) {
      try {
        await api.patch(`/ironStations/${id}`, {
          description: description,
          machineType: machineType,
          pieces: parseInt(pieces),
          status: status,
          notes: notes,
        });

        setSuccess(true);

        setDescription("");
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
    }else{
      Swal.fire("No se puede modificar La estación mientras este en uso", "", "warning")
    }
  };

  return (
    <div className="signup-form">
      <div className="form-container">
        <div className="HeadContent">
          <p className="title text-white">Editando la Plancha:</p>
          <strong className="title-strong">{description}</strong>
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

              {/* Modelo */}
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

              {/* Piezas */}
              <label className="form-lbl" htmlFor="weight">
                Piezas:
                {validPieces ? (
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
              <button className="btn-edit" disabled={!validPieces}>
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
