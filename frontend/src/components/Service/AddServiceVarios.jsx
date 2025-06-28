import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { IoCard } from "react-icons/io5";
import { BsCashCoin } from "react-icons/bs";
import api from "../../api/api";

function AddServiceVarios() {
  const descriptionRef = useRef();
  const priceRef = useRef();

  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("Varios");
  const [priceCredit, setPriceCredit] = useState(0);

  const [errMsg, setErrMsg] = useState("La Descripción de Servicios Varios debe contenar alguna de estas palabras: ");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const lavanderiaKeywords = ["lavado", "lavandería", "encargo"];
  const forbiddenKeyword = ["autoservicio", "planchado", "tintoreria"];
  const keywordsNeeded = "(Lavado, Lavanderia, Encargo)";

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasLavanderiaKeyword = lavanderiaKeywords.some((keyword) =>
      description.toLowerCase().includes(keyword)
    );

    if (!hasLavanderiaKeyword) {
      setErrMsg("Error, La Descripción de Servicios Varios debe contenar alguna de estas palabras: ");
      return;
    }

    if (description.toLowerCase().includes(forbiddenKeyword)) {
      setErrMsg("Error, no puedes añadir servicios de 'autoservicio'.");
      return;
    }

    try {
      await api.post("/servicesOtherService", {
        description: description,
        priceCredit: parseFloat(priceCredit),
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
                <div>
                  <div className="err-container">
                    <AiOutlineExclamationCircle
                      className="err-icon"
                      style={{ fontSize: "1rem" }}
                    />
                    <p className="err-msg">{errMsg}</p>
                  </div>
                  <p className="err-msg font-bold">{keywordsNeeded}</p>
                </div>
              )}

              <div className="flex items-center">
                <BsCashCoin size={32} className="text-green-700 mr-4 mt-2" />
                <label className="form-lbl" htmlFor="price">
                  Precio Efectivo:
                </label>
              </div>
              <input
                className="form-input"
                type="number"
                id="price"

                onChange={(e) => setPrice(e.target.value)}
                value={price}
                required
              />
              <div className="flex items-center">
                <IoCard size={32} className="text-blue-700 mr-4" />
                <label className="form-lbl" htmlFor="priceCredit">
                  Precio de Tarjeta:
                </label>
              </div>
              <input
                className="form-input"
                type="number"
                id="priceCredit"

                onChange={(e) => setPriceCredit(e.target.value)}
                value={priceCredit}
                required
              />

              <label className="form-lbl" htmlFor="category">
                Categoría:
              </label>
              <input
                className="form-input bg-gray-200"
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
