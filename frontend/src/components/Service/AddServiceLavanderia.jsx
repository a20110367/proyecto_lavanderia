import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import api from '../../api/api'

function AddServiceLavanderia() {
  const descriptionRef = useRef();
  const priceRef = useRef();
  const timeRef = useRef();
  const weightRef = useRef();

  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [time, setTime] = useState(0);
  const [weight, setWeight] = useState("");
  const [pieces, setPieces] = useState("");
  const [category, setCategory] = useState("lavado");

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const lavanderiaKeywords = ["lavado", "lavados", "lavandería"];
  const forbiddenKeyword = "autoservicio";

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasLavanderiaKeyword = lavanderiaKeywords.some((keyword) =>
      description.toLowerCase().includes(keyword)
    );

    if (!hasLavanderiaKeyword) {
      setErrMsg("Error, solo puedes añadir servicios de lavandería.");
      return;
    }

    if (description.toLowerCase().includes(forbiddenKeyword)) {
      setErrMsg("Error, no puedes añadir servicios de 'autoservicio'.");
      return;
    }

    try {
      await api.post("/servicesLaundry", {
          description: description,
          price: parseFloat(price),
          washWeight: weight,
          washCycleTime: time,
          category_id: 2,
          dryWeight: weight,
          dryCycleTime: time
      });
      setDescription("");
      setPrice(0);
      setTime(0);
      setWeight("");
      setPieces("");
      setCategory("Lavado");
      setSuccess(true);

      navigate("/servicesLavanderia");
    } catch (err) {
      setErrMsg("Failed to add service.");
    }
  };

  return (
    <div className="signup-form">
      <div className="form-container">
        <div className="HeadContent">
          <h2 className="title text-white">
            <em>Añadir un Servicio de Lavanderia </em>
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

          

              <label className="form-lbl" htmlFor="category">
                Categoría:
              </label>
              <input
                className="form-input"
                type="text"
                id="category"
                value="Lavandería"
                disabled
              />

              <button className="btn-primary" type="submit">
                Añadir Servicio
              </button>
              <button
                className="btn-cancel"
                onClick={() => navigate("/servicesLavanderia")}
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

export default AddServiceLavanderia;