import React, { useRef, useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

function AddServicio() {
  const descriptionRef = useRef();
  const priceRef = useRef();
  const timeRef = useRef();
  const weightRef = useRef();

  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [time, setTime] = useState(0);
  const [weight, setWeight] = useState(0);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!description || !price || !time || !weight) {
      setErrMsg("All fields are required.");
      return;
    }

    try {
      await Axios.post("http://localhost:5000/services", {
        description: description,
        price: parseFloat(price),
        time: Number(time),
        weight: Number(weight),
      });
      setDescription("");
      setPrice("");
      setTime("");
      setWeight("");
      setSuccess(true);

      navigate("/services");
      } catch (err) {
      setErrMsg("Failed to add service.");
    }
  };

  return (
    <div className="add-service-form">
      <div className="basic-container w-5/12">
        <strong className="input-label">Favor de rellenar los campos solicitados </strong>
      </div>
      {success ? (
        <section>
          <h1>Success!</h1>  
        </section>
      ) : (
        <section className="basic-container">
          <p className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
            {errMsg}
          </p>
          <form onSubmit={handleSubmit}>
            <label className="input-label" htmlFor="description">
              Descripción
            </label>
            <input
              className="input-prim"
              type="text"
              id="description"
              ref={descriptionRef}
              autoComplete="off"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              required
            />

            <label className="input-label" htmlFor="price">
              Precio Unitario
            </label>
            <input
              className="input-prim"
              type="number"
              step='0.1'
              id="price"
              ref={priceRef}
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
            />

            <label className="input-label" htmlFor="time">
              Tiempo (minutos)
            </label>
            <input
              className="input-prim"
              type="number"
              id="time"
              ref={timeRef}
              onChange={(e) => setTime(e.target.value)}
              value={time}
              required
            />

            <label className="input-label" htmlFor="weight">
              Peso (Kilogramos)
            </label>
            <input
              className="input-prim"
              type="number"
              id="weight"
              ref={weightRef}
              onChange={(e) => setWeight(e.target.value)}
              value={weight}
              required
            />

            <button
              className="btn-primary"
              type="submit"
            >
              Añadir Servicio
            </button>
            <button
              className="btn-cancel"
              onClick={() => navigate("/services")}
            >
              Cancelar
            </button>
          </form>
        </section>
      )}
    </div>
  );
}

export default AddServicio;
