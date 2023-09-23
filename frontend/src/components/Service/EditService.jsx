import React, { useRef, useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditService() {
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
  const { id } = useParams();

  useEffect(() => {
    const getServiceById = async () => {
        const response = await Axios.get(`http://localhost:5000/services/${id}`);
        setDescription(response.data.description);
        setPrice(response.data.price);
        setTime(response.data.time);
        setWeight(response.data.weight);
      };
      getServiceById();
    }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!description || !price || !time || !weight) {
      setErrMsg("All fields are required.");
      return;
    }

    try {

      await Axios.patch(`http://localhost:5000/services/${id}`, {
        description: description,
        price: parseFloat(price),
        time: Number(time),
        weight: Number(weight),
      });
      navigate('/services')
      setSuccess(true);
    } catch (err) {

      setErrMsg("Failed to update service.");
    }
  };

  return (
    <div className="edit-servicio-form">
      <div className="title-container">
        <p className="subtitle">Editando servicio de:</p>   
        <strong className="title-strong">{description}</strong>
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
            <label className="subtitle mt-0" htmlFor="description">
              Descripción:
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

            <label className="subtitle" htmlFor="price">
              Precio Unitario:
            </label>
            <input
              className="input-prim"
              type="number"
              id="price"
              ref={priceRef}
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
            />

            <label className="subtitle" htmlFor="time">
              Tiempo (minutos):
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

            <label className="subtitle" htmlFor="weight">
              Peso (gramos):
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
              className="btn-edit"
              type="submit"
            >
              Actualizar
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

export default EditService;
