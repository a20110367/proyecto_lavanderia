import React, { useRef, useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

function AddServicio() {
  const descriptionRef = useRef();
  const priceRef = useRef();
  const timeRef = useRef();
  const weightRef = useRef();

  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [time, setTime] = useState(0);
  const [weight, setWeight] = useState();
  const [pieces, setPieces] = useState();

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description || !price || !time) {
      setErrMsg("All fields are required.");
      return;
    }

    try {
      await Axios.post("http://localhost:5000/services", {
        description: description,
        price: parseFloat(price),
        fk_category: 2,
        time: Number(time),
        weight: Number(weight),
        pieces: Number(pieces),
      });
      setDescription("");
      setPrice("");
      setTime("");
      setWeight("");
      setSuccess(true);

      navigate("/services");
    } catch (err) {
      setErrMsg("Failed to add service.");
    }
  };

  return (
    <div className="signup-form">
      <div className="form-container">
        <div className="HeadContent">
          <h2 className="title text-white"><em>Añadir a un Servicio</em></h2>
          <p className="form-lbl text-white">Ingrese los detalle del Servicio.</p>
          <div className="clearBoth"></div>
        </div>
        {success ? (
          <section>
            <h1>Success!</h1>
          </section>
        ) : (
          <section>
            <p className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
              {errMsg}
            </p>
            <form onSubmit={handleSubmit}>
              <label className="form-lbl" htmlFor="description">
                Descripción:
              </label>
              <input
                className="form-input"
                type="text"
                id="description"
                ref={descriptionRef}
                autoComplete="off"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                required
              />

              <label className="form-lbl" htmlFor="price">
                Precio Unitario:
              </label>
              <input
                className="form-input"
                type="number"
                step='0.1'
                id="price"
                ref={priceRef}
                onChange={(e) => setPrice(e.target.value)}
                value={price}
                required
              />

              <label className="form-lbl" htmlFor="time">
                Tiempo (minutos):
              </label>
              <input
                className="form-input"
                type="number"
                id="time"
                ref={timeRef}
                onChange={(e) => setTime(e.target.value)}
                value={time}
                required
              />

              <label className="form-lbl" htmlFor="weight">
                Peso (Kilogramos):
              </label>
              <input
                className="form-input"
                type="number"
                id="weight"
                ref={weightRef}
                onChange={(e) => setWeight(e.target.value)}
                value={weight}
              />
              <label className="form-lbl" htmlFor="pieces">
                Piezas
              </label>
              <input
                className="form-input"
                type="number"
                id="pieces"
                onChange={(e) => setPieces(e.target.value)}
                value={pieces}
              />
              <button
                className="btn-primary"
                type="submit"
              >
                Añadir Servicio
              </button>
              <button
                className="btn-cancel"
                onClick={() => navigate("/services")}
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

export default AddServicio;
