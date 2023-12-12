import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import api from '../../api/api'

function AddServiceTintoreria() {
  const descriptionRef = useRef();
  const priceRef = useRef();
  const timeRef = useRef();
  const weightRef = useRef();

  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [pieces, setPieces] = useState(0);
  const [time, setTime] = useState(0)
  const [category, setCategory] = useState("Tintoreria");

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const tintoreriaKeywords = ["Tintoreria", "Tintorerias", "tintoreria"];
  const forbiddenKeyword = ["autoservicio", "autoservicios", "auto servicios", "auto servicio", "planchado", "encargo"];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasTintoreriaKeyword = tintoreriaKeywords.some((keyword) =>
      description.toLowerCase().includes(keyword)
    );

    if (!hasTintoreriaKeyword) {
      setErrMsg("Error, solo puedes añadir servicios de tintoreria.");
      return;
    }

    if (description.toLowerCase().includes(forbiddenKeyword)) {
      setErrMsg("Error, no puedes añadir servicios de 'autoservicio, encargo ó lavanderia'.");
      return;
    }

    try {
      await api.post("/servicesDryclean", {
        description: description,
        price: parseFloat(price),
        // cycleTime: parseInt(time),
        pieces: parseInt(pieces),
        category_id: 4,
      });
      setDescription("");
      setPrice(0);
      setCategory("Tintoreria");
      setSuccess(true);

      navigate("/servicesTintoreria");
    } catch (err) {
      console.info(err)
      setErrMsg("Failed to add service.");
    }
  };

  return (
    <div className="signup-form">
      <div className="form-container">
        <div className="HeadContent">
          <h2 className="title text-white">
            <em>Añadir un Servicio de Tintoreria </em>
          </h2>
          <p className="form-lbl text-white">Ingrese los detalles del Servicio.</p>
          <div className="clearBoth"></div>
        </div>
        {success ? (
          <section>
            <h1>Success!</h1>
          </section>
        ) : (
          <section>
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

              {errMsg && (
                <div className="error-message flex items-center mt-2 space-x-2">
                  <AiOutlineExclamationCircle
                    className="text-red-500"
                    style={{ fontSize: "1rem" }}
                  />
                  <p className="errmsg text-red-500 ">
                    {errMsg}
                  </p>
                </div>
              )}

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

              <label className="form-lbl" htmlFor="price">
                Precio Unitario:
              </label>
              <input
                className="form-input"
                type="number"
                step="0.1"
                id="price"
                ref={priceRef}
                onChange={(e) => setPrice(e.target.value)}
                value={price}
                required
              />

              <label className="form-lbl" htmlFor="category">
                Categoría:
              </label>
              <input
                className="form-input"
                type="text"
                id="category"
                value="Tintoreria"
                disabled
              />

              <button className="btn-primary" type="submit">
                Añadir Servicio
              </button>
              <button
                className="btn-cancel"
                onClick={() => navigate("/servicesTintoreria")}
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

export default AddServiceTintoreria;