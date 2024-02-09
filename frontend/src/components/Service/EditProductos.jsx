import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import api from "../../api/api";

function EditProductos() {
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [medidaType, setMedidaType] = useState("pieza");
  const [unity, setUnity] = useState(0);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

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

  useEffect(() => {
    const getServiceById = async () => {
      try {
        const response = await api.get(`/servicesLaundry/${id}`);
        setDescription(response.data.description || "");
        setPrice(response.data.price || 0);
        setMedidaType(response.data.medidaType);
        setUnity(response.data.washWeight || 0);
      } catch (error) {
        console.error("Error fetching service:", error);
      }
    };

    getServiceById();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasProductosKeyword = productosKeywords.some((keyword) =>
      description.toLowerCase().includes(keyword)
    );

    if (!hasProductosKeyword) {
      setErrMsg("Error, solo puedes editar servicios de lavandería.");
      return;
    }

    if (!description || !price || !medidaType) {
      setErrMsg("Todos los campos son obligatorios.");
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
      await api.patch(`/servicesUpdateLaundry/${id}`, {
        description: description,
        price: parseFloat(price),
        medidaType: medidaType,
        unity: parseInt(unity),
      });
      navigate("/productos");
      setSuccess(true);
    } catch (err) {
      console.log(err);
      setErrMsg("Error al actualizar el servicio.");
    }
  };

  return (
    <div className="signup-form">
      <div className="form-container">
        <div className="HeadContent">
          <p className="title text-white">
            Editando el Producto:
          </p>
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
                id="washWeight"
                onChange={(e) => setUnity(e.target.value)}
                value={unity}
              />

              <label className="form-lbl" htmlFor="price">
                Precio Unitario:
              </label>
              <input
                className="form-input"
                type="number"
                id="price"
                onChange={(e) => setPrice(e.target.value)}
                value={price}
                required
              />

              <button className="btn-edit" type="submit">
                Actualizar
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

export default EditProductos;
