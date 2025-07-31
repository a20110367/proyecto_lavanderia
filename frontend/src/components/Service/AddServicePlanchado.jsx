import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { IoCard } from "react-icons/io5";
import { BsCashCoin } from "react-icons/bs";
import api from '../../api/api'
import Swal from "sweetalert2";

function AddServicePlanchado() {
  const descriptionRef = useRef();
  const priceRef = useRef();
  const timeRef = useRef();
  const weightRef = useRef();

  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [pieces, setPieces] = useState(0);
  const [time, setTime] = useState(0)
  const [category, setCategory] = useState("Planchado");
  const [priceCredit, setPriceCredit] = useState(0);

  const [errMsg, setErrMsg] = useState("La Descripción de Planchado debe contenar alguna de estas palabras: ");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const planchaduriaKeywords = ["planchado", "planchados", "planchaduría"];
  const forbiddenKeyword = ["autoservicio", "autoservicios", "auto servicios", "auto servicio"];
  const keywordsNeeded = "(Planchado, Planchados, Planchaduría)";


  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasPlanchaduriaKeyword = planchaduriaKeywords.some((keyword) =>
      description.toLowerCase().includes(keyword)
    );

    if (!hasPlanchaduriaKeyword) {
      setErrMsg("Error, La Descripción de Planchado debe contenar alguna de estas palabras: ");
      Swal.fire('El Nombre servicio esta Incorrecto', 'El nombre del servicio debe tener la palabra: Planchado O Planchados O Planchaduria .', 'error')
      return;
    }

    if (description.toLowerCase().includes(forbiddenKeyword)) {
      setErrMsg("Error, solo puedes añadir servicios de planchaduría.");
      return;
    }

    try {
      await api.post("/servicesIron", {
        description: description,
        price: parseFloat(price),
        priceCredit: parseFloat(priceCredit),
        cycleTime: parseInt(time),
        pieces: parseInt(pieces),
        category_id: 3,
      });
      setDescription("");
      setPrice(0);
      setCategory("Planchado");
      setSuccess(true);

      navigate("/servicesPlanchado");
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
            <em>Añadir un Servicio de Planchaduria </em>
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

              <label className="form-lbl" htmlFor="time">
                Tiempo de Ciclo en minutos:
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
                value="Planchado"
                disabled
              />

              <button className="btn-primary" type="submit">
                Añadir Servicio
              </button>
              <button
                className="btn-cancel"
                onClick={() => navigate("/servicesPlanchado")}
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

export default AddServicePlanchado;