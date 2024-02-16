import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import api from "../../api/api";

function EditProductos() {
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
  const { id } = useParams();

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

  useEffect(() => {
    const getServiceById = async () => {
      try {
        const response = await api.get(`/supplies/${id}`);
        
        setDescription(response.data.description || "");
        setPrice(response.data.price || 0);
        setCategory(response.data.category);
        setUnit(response.data.unit);
        setValor(response.data.value || 0);
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

    if (!description || !price || !unit) {
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
      await api.patch(`/supplies/${id}`, {
        description: description,
        price: parseFloat(price),
        category: category,
        unit: unit,
        value: parseInt(valor),
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
          <p className="title text-white">Editando el Producto:</p>
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
                ref={descriptionRef}
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
