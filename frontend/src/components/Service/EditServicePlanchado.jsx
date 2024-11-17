import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { IoCard } from "react-icons/io5";
import { BsCashCoin } from "react-icons/bs";
import api from '../../api/api'

function EditServicePlanchado() {
  const descriptionRef = useRef();
  const priceRef = useRef();
  const timeRef = useRef();
  const weightRef = useRef();

  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [priceCredit, setPriceCredit] = useState(0);
  const [pieces, setPieces] = useState(0)
  const [time, setTime] = useState(0)
  const [category, setCategory] = useState("Planchado");

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  const planchaduriaKeywords = ["planchado", "planchado", "planchado"];
  const forbiddenKeyword = ["autoservicio", "autoservicios", "auto servicios", "auto servicio"];

  useEffect(() => {
    const getServiceById = async () => {
      const response = await api.get(`/servicesIron/${id}`);
      setDescription(response.data.description);
      setPrice(response.data.price);
      setPriceCredit(response.data.priceCredit || 0);
      setPieces(response.data.pieces)
      setTime(response.data.cycleTime)
      setCategory("Planchado");
    };
    getServiceById();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasPlanchaduriaKeyword = planchaduriaKeywords.some((keyword) =>
      description.toLowerCase().includes(keyword)
    );

    if (!hasPlanchaduriaKeyword) {
      setErrMsg("Error, solo puedes editar servicios de planchaduria.");
      return;
    }

    if (!description || !price) {
      setErrMsg("Todos los campos son obligatorios.");
      return;
    }

    if (description.toLowerCase().includes(forbiddenKeyword)) {
      setErrMsg("Error, no puedes editar servicios de 'autoservicio'.");
      return;
    }

    try {
      await api.patch(`/servicesUpdateIron/${id}`, {
        description: description,
        price: parseFloat(price),
        priceCredit: parseFloat(priceCredit),
        pieces: parseInt(pieces),
        cycleTime: parseInt(time),
        category_id: 3,
      });
      navigate("/servicesPlanchado");
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setErrMsg("Error al actualizar el servicio.");
    }
  };

  return (
    <div className="signup-form">
      <div className="form-container">
        <div className="HeadContent">
          <p className="title text-white">Editando el Servicio de Planchado:</p>
          <strong className="title-strong">{description}</strong>
        </div>
        {success ? (
          <section>
            <h1>Éxito</h1>
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
                  <p className="errmsg text-red-500">{errMsg}</p>
                </div>
              )}

              <label className="form-lbl" htmlFor="pieces">
                No. Piezas:
              </label>
              <input
                className="form-input"
                type="number"
                id="pieces"
                onChange={(e) => setPieces(e.target.value)}
                value={pieces}
                required
              />

              <label className="form-lbl" htmlFor="time">
                Tiempo del Ciclo de Planchado:
              </label>
              <input
                className="form-input"
                type="number"
                id="time"
                onChange={(e) => setTime(e.target.value)}
                value={time}
                required
              />

              <div className="flex">
                <BsCashCoin size={32} className="text-green-700 mr-4" />
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
              <div className="flex">
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

              <button className="btn-edit" type="submit">
                Actualizar
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

export default EditServicePlanchado;
