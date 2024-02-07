import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import api from "../../api/api";

function AddProductos() {
  const descriptionRef = useRef();
  const priceRef = useRef();
  const unityRef = useRef();

  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [medidaType, setMedidaType] = useState("pieza");
  const [unity, setUnity] = useState(0);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const productosKeywords = ["lavado", "lavados", "lavandería"];
  const forbiddenKeyword = [
    "autoservicio",
    "planchado",
    "tenis",
    "tennis",
    "edredon",
    "colcha",
    "toalla",
    "colchas",
    "toallas",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasProductosKeyword = productosKeywords.some((keyword) =>
      description.toLowerCase().includes(keyword)
    );

    if (!hasProductosKeyword) {
      setErrMsg("Error, solo puedes añadir productos.");
      return;
    }

    const hasForbiddenKeyword = forbiddenKeyword.some((keyword) =>
      description.toLowerCase().includes(keyword)
    );

    if (hasForbiddenKeyword) {
      setErrMsg("Error, no puedes añadir servicios Varios.");
      return;
    }

    try {
      await api.post("/servicesLaundry", {
        description: description,
        price: parseFloat(price),
        medidaType: medidaType,
        unity: parseInt(unity),
      });
      setDescription("");
      setPrice(0);
      setUnity(0);
      setSuccess(true);

      navigate("/productos");
    } catch (err) {
      setErrMsg("Failed to add service.");
    }
  };

  return (
    <div className="signup-form">
      <div className="form-container">
        <div className="HeadContent">
          <h2 className="title text-white">
            <em>Añadir un nuevo Producto </em>
          </h2>
          <p className="form-lbl text-white">
            Ingrese los detalles del Producto.
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

              <label className="form-lbl" htmlFor="washCycleTime">
                Medida:
              </label>
              <select
                className="form-input"
                id="medidaType"
                value={medidaType}
                onChange={(e) => setMedidaType(e.target.value)}
              >
                <option value="lavadora">Pieza</option>
                <option value="secadora">Gramos</option>
                <option value="secadora">Mililitros</option>
              </select>

              <label className="form-lbl" htmlFor="washWeight">
                Unidad:
              </label>
              <input
                className="form-input"
                type="number"
                id="weight"
                ref={unityRef}
                onChange={(e) => setUnity(e.target.value)}
                value={unity}
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

              <button className="btn-primary" type="submit">
                Añadir Servicio
              </button>
              <button
                className="btn-cancel"
                onClick={() => navigate("/productos")}
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

export default AddProductos;
