import React, { useRef, useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineExclamationCircle } from "react-icons/ai";

function EditServicePlanchado() {
  const descriptionRef = useRef();
  const priceRef = useRef();
  const timeRef = useRef();
  const weightRef = useRef();

  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("Planchado");

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  const planchaduriaKeywords = ["planchado", "planchado", "planchado"];
  const forbiddenKeyword = ["autoservicio", "autoservicios", "auto servicios", "auto servicio"];

  useEffect(() => {
    const getServiceById = async () => {
      const response = await Axios.get(`http://localhost:5000/servicesById/${id}`);
      setDescription(response.data.description);
      setPrice(response.data.price);
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
      await Axios.patch(`http://localhost:5000/services/${id}`, {
        description: description,
        category_id: 3,
        price: parseFloat(price),
      });
      navigate("/servicesPlanchado");
      setSuccess(true);
    } catch (err) {
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

              <label className="form-lbl" htmlFor="price">
                Precio Unitario:
              </label>
              <input
                className="form-input"
                type="number"
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
