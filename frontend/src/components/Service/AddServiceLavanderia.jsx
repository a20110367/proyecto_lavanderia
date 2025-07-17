import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { IoCard } from "react-icons/io5";
import { BsCashCoin } from "react-icons/bs";
import api from "../../api/api";

function AddServiceLavanderia() {
  const descriptionRef = useRef();
  const priceRef = useRef();
  const timeRef = useRef();
  const weightRef = useRef();
  const drytimeRef = useRef();
  const dryweightRef = useRef();

  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [washCycleTime, setWashCycleTime] = useState(0);
  const [washWeight, setWashWeight] = useState(0);
  const [dryCycleTime, setDryCycleTime] = useState(0);
  const [dryWeight, setDryWeight] = useState(0);
  const [category, setCategory] = useState("Encargo");
  const [priceCredit, setPriceCredit] = useState(0);
  const [dryFlat, setDryFlat] = useState(false);

  const [errMsg, setErrMsg] = useState("La Descripción de Encargo debe contenar alguna de estas palabras: ");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const lavanderiaKeywords = ["lavado", "lavandería", "encargo"];
  const forbiddenKeyword = ["autoservicio", "planchado"];

  const keywordsNeeded = "(Lavado, Lavanderia, Encargo)";


  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasLavanderiaKeyword = lavanderiaKeywords.some((keyword) =>
      description.toLowerCase().includes(keyword)
    );

    if (!hasLavanderiaKeyword) {
      setErrMsg("Error, La Descripción de Encargo debe contenar alguna de estas palabras: ");
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
        priceCredit: parseFloat(priceCredit),
        washWeight: parseInt(washWeight),
        washCycleTime: parseInt(washCycleTime),
        category_id: 2,
        dryWeight: parseInt(dryWeight),
        dryCycleTime: parseInt(dryCycleTime),
      });
      setDescription("");
      setPrice(0);
      setWashCycleTime(0);
      setWashWeight(0);
      setDryCycleTime(0);
      setDryWeight(0);
      setCategory("Encargo");
      setSuccess(true);

      navigate("/servicesLavanderia");
    } catch (err) {
      setErrMsg("Failed to add service.");
    }
  };

  const setDryFlatTrue = () => {
    setDryFlat(!dryFlat);
    setDryWeight(0);
    setDryCycleTime(0);
  }

  return (
    <div className="signup-form">
      <div className="form-container">
        <div className="HeadContent">
          <h2 className="title text-white">
            <em>Añadir un Servicio de <br /> Encargo Ropa </em>
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

              <label className="form-lbl" htmlFor="washCycleTime">
                Tiempo de lavado (minutos):
              </label>
              <input
                className="form-input"
                type="number"
                id="time"
                ref={timeRef}
                onChange={(e) => setWashCycleTime(e.target.value)}
                value={washCycleTime}
                required
              />

              <label className="form-lbl" htmlFor="washWeight">
                Peso (Kilogramos):
              </label>
              <input
                className="form-input"
                type="number"
                id="weight"
                ref={weightRef}
                onChange={(e) => setWashWeight(e.target.value)}
                value={washWeight}
              />

              <div className="flex my-2 items-center">
                <label className="form-lbl" htmlFor="dryFlat">
                  Secar Tendido
                </label>
                <input
                  className="serviceCheckbox"
                  type="checkbox"
                  id='dryFlat'
                  name="dryFlat"
                  onChange={(e) => setDryFlatTrue(!dryFlat)}
                />
              </div>

              <label className="form-lbl" htmlFor="dryCycleTime">
                Tiempo de Secado (minutos):
              </label>
              <input
                className={`${dryFlat ? "form-input bg-gray-200" : "form-input"}`}
                type="number"
                id="dryCycleTime"
                ref={drytimeRef}
                onChange={(e) => setDryCycleTime(e.target.value)}
                value={dryCycleTime}
                required
                disabled = {dryFlat}
              />

              <label className="form-lbl" htmlFor="dryWeight">
                Peso de Secado (Kilogramos):
              </label>
              <input
                className={`${dryFlat ? "form-input bg-gray-200" : "form-input"}`}
                type="number"
                id="dryWeight"
                ref={dryweightRef}
                onChange={(e) => setDryWeight(e.target.value)}
                value={dryWeight}
                disabled = {dryFlat}
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

              <button className="btn-primary" type="submit">
                Añadir Servicio
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

export default AddServiceLavanderia;
