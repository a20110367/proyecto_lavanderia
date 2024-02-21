import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import api from "../../api/api";

function AddProductos() {
  const descriptionRef = useRef();
  const priceRef = useRef();
  const valorRef = useRef();

  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [unit, setUnit] = useState("piezas");
  const [category, setCategory] = useState("jabon");
  const [valor, setValor] = useState(0);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const productosKeywords = [
    "jabon",
    "suavitel",
    "pinol",
    "desengrasante",
    "cloro",
    "sanitizante",
    "bolsa",
    "reforzado",
    "ganchos",
    "wc",
  ];

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
    "lavado",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();


    const hasForbiddenKeyword = forbiddenKeyword.some((keyword) =>
      description.toLowerCase().includes(keyword)
    );

    if (hasForbiddenKeyword) {
      setErrMsg("Error, no puedes añadir servicios Varios.");
      return;
    }

    try {
      await api.post("/supplies", {
        description: description,
        price: parseFloat(price),
        category: category,
        unit: unit,
        value: parseInt(valor),
      });
      setDescription("");
      setPrice(0);
      setValor(0);
      setSuccess(true);

      navigate("/productos");
    } catch (err) {
      setErrMsg("Failed to add service.");
      console.log(err);
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

              <label className="form-lbl" htmlFor="category">
                Categoria:
              </label>
              <select
                className="form-input"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="jabon">Jabon</option>
                <option value="suavitel">Suavitel</option>
                <option value="pinol">Pinol</option>
                <option value="desengrasante">Desengrasante</option>
                <option value="cloro">Cloro</option>
                <option value="sanitizante">Sanitizante</option>
                <option value="bolsa">Bolsa</option>
                <option value="reforzado">Reforzado</option>
                <option value="ganchos">Ganchos</option>
                <option value="wc">WC</option>
                <option value="otros">Otros</option>
              </select>

              <label className="form-lbl" htmlFor="unit">
                Medida:
              </label>
              <select
                className="form-input"
                id="unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              >
                <option value="mililitros">Mililitros</option>
                <option value="gramos">Gramos</option>
                <option value="piezas">Piezas</option>
              </select>

              <label className="form-lbl" htmlFor="valor">
                Unidad:
              </label>
              <input
                className="form-input"
                type="number"
                id="valor"
                ref={valorRef}
                onChange={(e) => setValor(e.target.value)}
                value={valor}
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
                Añadir Producto
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
