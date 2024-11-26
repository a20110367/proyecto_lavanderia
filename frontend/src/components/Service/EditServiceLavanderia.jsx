import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { IoCard } from "react-icons/io5";
import { BsCashCoin } from "react-icons/bs";
import api from "../../api/api";

function EditServiceLavanderia() {


  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [priceCredit, setPriceCredit] = useState(0);
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
  const forbiddenKeyword = ["autoservicio", "planchado", "tenis", "tennis", "edredon", "colcha", "toalla", "colchas", "toallas"];


  useEffect(() => {
    const getServiceById = async () => {
      try {
        const response = await api.get(`/servicesLaundry/${id}`);
        // console.log(response.data)
        setDescription(response.data.description || "");
        setPrice(response.data.price || 0);
        setPriceCredit(response.data.priceCredit || 0);
        setCategory("Encargo");
        setWashCycleTime(response.data.washCycleTime || 0);
        setWashWeight(response.data.washWeight || 0);
        setDryCycleTime(response.data.dryCycleTime || 0);
        setDryWeight(response.data.dryWeight || 0);
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
        priceCredit: parseFloat(priceCredit),
        washWeight: parseInt(washWeight),
        washCycleTime: parseInt(washCycleTime),
        category_id: 2,
        dryWeight: parseInt(dryWeight),
        dryCycleTime: parseInt(dryCycleTime),
      });
      navigate("/servicesLavanderia");
      setSuccess(true);
    } catch (err) {
      console.log(err)
      setErrMsg("Error al actualizar el servicio.");
    }
  };

  return (
    <div className="signup-form">
      <div className="form-container">
        <div className="HeadContent">
          <p className="title text-white">Editando el Servicio de <br /> Encargo Ropa:</p>
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
                className="form-input bg-gray-200"
                type="text"
                id="description"
                autoComplete="off"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                required
                disabled
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

              <div className="flex items-center">
              <BsCashCoin size={32} className="text-green-700 mr-4 mt-2"/>
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
                <IoCard size={32} className="text-blue-700 mr-4"/>
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

              <label className="form-lbl" htmlFor="washCycleTime">
                Tiempo de lavado (minutos):
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
                className="form-input bg-gray-200"
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
