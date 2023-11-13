import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import api from "../../api/api";

function EditServiceLavanderia() {


  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [washCycleTime, setWashCycleTime] = useState(0);
  const [washWeight, setWashWeight] = useState(0);
  const [dryCycleTime, setDryCycleTime] = useState(0);
  const [dryWeight, setDryWeight] = useState(0);
  const [category, setCategory] = useState("encargo");

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  const lavanderiaKeywords = ["lavado", "lavados", "lavandería"];
  const forbiddenKeyword = ["autoservicio", "planchado"];

  useEffect(() => {
    const getServiceById = async () => {
      try {
        const response = await api.get(`/servicesById/${id}`);
        setDescription(response.data.description || "");
        setPrice(response.data.price || 0);
        setCategory("Encargo");
        setWashCycleTime(response.data.WashService[0].cycleTime || 0);
        setWashWeight(response.data.WashService[0].weight || 0);
        setDryCycleTime(response.data.DryService[0].cycleTime || 0);
        setDryWeight(response.data.DryService[0].weight || 0);
      } catch (error) {
        console.error("Error fetching service:", error);
      }
    };
  
    getServiceById();
  }, [id]);
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasLavanderiaKeyword = lavanderiaKeywords.some((keyword) =>
      description.toLowerCase().includes(keyword)
    );

    if (!hasLavanderiaKeyword) {
      setErrMsg("Error, solo puedes editar servicios de lavandería.");
      return;
    }

    if (!description || !price || !washCycleTime) {
      setErrMsg("Todos los campos son obligatorios.");
      return;
    }

    if (description.toLowerCase().includes(forbiddenKeyword)) {
      setErrMsg("Error, no puedes editar servicios de 'autoservicio'.");
      return;
    }

    try {
      await api.patch(`/services/${id}`, {
        description: description,
        price: parseFloat(price),
        washWeight: parseInt(washWeight),
        washCycleTime: parseInt(washCycleTime),
        category_id: 2,
        dryWeight: parseInt(dryWeight),
        dryCycleTime: parseInt(dryCycleTime),
      });
      navigate("/servicesLavanderia");
      setSuccess(true);
    } catch (err) {
      setErrMsg("Error al actualizar el servicio.");
    }
  };

  return (
    <div className="signup-form">
      <div className="form-container">
        <div className="HeadContent">
          <p className="title text-white">Editando el Servicio de Encargo:</p>
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

              <label className="form-lbl" htmlFor="washCycleTime">
                Tiempo (minutos):
              </label>
              <input
                className="form-input"
                type="number"
                id="washCycleTime"

                onChange={(e) => setWashCycleTime(e.target.value)}
                value={washCycleTime}
                required
              />

              <label className="form-lbl" htmlFor="washWeight">
                Peso (Kilos):
              </label>
              <input
                className="form-input"
                type="number"
                id="washWeight"

                onChange={(e) => setWashWeight(e.target.value)}
                value={washWeight}
              />

              <label className="form-lbl" htmlFor="dryCycleTime">
                Tiempo de Secado (minutos):
              </label>
              <input
                className="form-input"
                type="number"
                id="dryCycleTime"

                onChange={(e) => setDryCycleTime(e.target.value)}
                value={dryCycleTime}
                required
              />

              <label className="form-lbl" htmlFor="dryWeight">
                Peso de Secado (Kilogramos):
              </label>
              <input
                className="form-input"
                type="number"
                id="dryWeight"

                onChange={(e) => setDryWeight(e.target.value)}
                value={dryWeight}
              />

              <label className="form-lbl" htmlFor="category">
                Categoría:
              </label>
              <input
                className="form-input"
                type="text"
                id="category"
                value="Encargo"
                disabled
              />

              <button className="btn-edit" type="submit">
                Actualizar
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

export default EditServiceLavanderia;
