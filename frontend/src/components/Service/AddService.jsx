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
      <div className="bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1">
        <strong>Añadir Servicio</strong>
      </div>
      {success ? (
        <section>
          <h1>Success!</h1>  
        </section>
      ) : (
        <section className="bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1">
          <p className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
            {errMsg}
          </p>
          <h1 className="font-medium text-lg text-gray-500 mt-4">
            Por favor, ingresa los datos del servicio
          </h1>
          <form onSubmit={handleSubmit}>
            <label className="text-lg font-medium" htmlFor="description">
              Descripción
            </label>
            <input
              className="w-full border-2 border-gray-500 rounded-xl p-4 mt-1 bg-transparent"
              type="text"
              id="description"
              ref={descriptionRef}
              autoComplete="off"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              required
            />

            <label className="text-lg font-medium" htmlFor="price">
              Precio Unitario
            </label>
            <input
              className="w-full border-2 border-gray-500 rounded-xl p-4 mt-1 bg-transparent"
              type="number"
              step='0.1'
              id="price"
              ref={priceRef}
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
            />

            <label className="text-lg font-medium" htmlFor="time">
              Tiempo (minutos)
            </label>
            <input
              className="w-full border-2 border-gray-500 rounded-xl p-4 mt-1 bg-transparent"
              type="number"
              id="time"
              ref={timeRef}
              onChange={(e) => setTime(e.target.value)}
              value={time}
              required
            />

            <label className="text-lg font-medium" htmlFor="weight">
              Peso (Kilogramos)
            </label>
            <input
              className="w-full border-2 border-gray-500 rounded-xl p-4 mt-1 bg-transparent"
              type="number"
              id="weight"
              ref={weightRef}
              onChange={(e) => setWeight(e.target.value)}
              value={weight}
              required
            />

            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-11"
              type="submit"
            >
              Añadir Servicio
            </button>
          </form>
        </section>
      )}
    </div>
  );
}

export default AddServicio;
