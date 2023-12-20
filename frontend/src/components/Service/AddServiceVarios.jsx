import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import api from "../../api/api";

function AddServiceVarios() {
  const descriptionRef = useRef();
  const priceRef = useRef();

  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("Varios");

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const lavanderiaKeywords = ["lavado", "lavados", "lavandería"];
  const forbiddenKeyword = ["autoservicio", "planchado", "tintoreria"];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasLavanderiaKeyword = lavanderiaKeywords.some((keyword) =>
      description.toLowerCase().includes(keyword)
    );

    if (!hasLavanderiaKeyword) {
      setErrMsg("Error, solo puedes añadir servicios de Encargo Varios.");
      return;
    }

    if (description.toLowerCase().includes(forbiddenKeyword)) {
      setErrMsg("Error, no puedes añadir servicios de 'autoservicio'.");
      return;
    }

    try {
      await api.post("/servicesOtherService", {
        description: description,
        price: parseFloat(price),
        category_id: 5,
      });
      setDescription("");
      setPrice(0);
      setCategory("Varios");
      setSuccess(true);

      navigate("/servicesVarios");
    } catch (err) {
      setErrMsg("Failed to add service.");
    }
  };

  return (
    <div className="signup-form">
      <div className="form-container">
        <div className="HeadContent">
          <h2 className="title text-white">
            <em>Añadir un Servicio de <br /> Encargo Varios </em>
          </h2>
          <p className="form-lbl text-white">
            Ingrese los detalles del Servicio.
          </p>
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
                  <p className="errmsg text-red-500 ">{errMsg}</p>
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

              <label className="form-lbl" htmlFor="category">
                Categoría:
              </label>
              <input
                className="form-input"
                type="text"
                id="category"
                value="Varios"
                disabled
              />

              <button className="btn-primary" type="submit">
                Añadir Servicio
              </button>
              <button
                className="btn-cancel"
                onClick={() => navigate("/servicesVarios")}
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

export default AddServiceVarios;
