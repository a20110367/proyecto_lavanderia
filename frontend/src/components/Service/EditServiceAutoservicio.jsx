import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Select } from "antd";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import api from '../../api/api'

function EditServiceAutoservicio() {
  const descriptionRef = useRef();
  const priceRef = useRef();
  const timeRef = useRef();
  const weightRef = useRef();

  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [time, setTime] = useState(0);
  const [weight, setWeight] = useState();
  const [pieces, setPieces] = useState();
  const [category, setCategory] = useState("Autoservicio");
  const [service, setService] = useState('laundry')

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();


  useEffect(() => {
    const getServiceById = async () => {
      const response = await api.get(`/servicesById/${id}`);
      setDescription(response.data.description);
      setPrice(response.data.price);
      setCategory("Autoservicio");
      setTime(response.data.time);
      setWeight(response.data.weight);
    };
    getServiceById();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description.toLowerCase().includes("autoservicio")) {
      setErrMsg("Error, solo puedes editar servicios de 'autoservicio' (debe contener la palabra autoservicio).");
      return;
    }

    if (service == 'laundry') {
      try {
        await api.patch(`/services/${id}`, {
          description: description,
          price: parseFloat(price),
          washWeight: weight,
          washCycleTime: time,
          category_id: 1,
          dryWeight: weight,
          dryCycleTime: time
        });
        navigate("/servicesAutoservicio");
        setSuccess(true);
      } catch (err) {
        setErrMsg("Error al actualizar el servicio lavado.");
      }
    } else if (service == 'dry') {
      try {
        await api.patch(`/services/${id}`, {
          description: description,
          price: parseFloat(price),
          category_id: 1,
          dryWeight: weight,
          dryCycleTime: time
        });
        navigate("/servicesAutoservicio");
        setSuccess(true);
      } catch (err) {
        setErrMsg("Error al actualizar el servicio lavanderia.");
      }
    }
  };

  return (
    <div className="signup-form">
      <div className="form-container">
        <div className="HeadContent">
          <p className="title text-white">Editando el Servicio de Autoservicio:</p>
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

              <label className="form-lbl" htmlFor="time">
                Tiempo (minutos):
              </label>
              <input
                className="form-input"
                type="number"
                id="time"
                ref={timeRef}
                onChange={(e) => setTime(e.target.value)}
                value={time}
                required
              />

              <label className="form-lbl" htmlFor="weight">
                Peso (gramos):
              </label>
              <input
                className="form-input"
                type="number"
                id="weight"
                ref={weightRef}
                onChange={(e) => setWeight(e.target.value)}
                value={weight}
              />

              <label className="form-lbl" htmlFor="type">
                Tipo de Servicio
              </label>
              <Select
                style={{ width: "100%", fontSize: "16px" }}
                onChange={(value) => setService(value)}
                value={service}
              >
                <Option value="laundry">Lavado</Option>
                <Option value="dry">Secado</Option>
              </Select>

              {service == 'dry' ?
                <div>
                  <label className="form-lbl" htmlFor="pieces">
                    Piezas
                  </label>
                  <input
                    className="form-input"
                    type="number"
                    id="pieces"
                    onChange={(e) => setPieces(e.target.value)}
                    value={pieces}
                  />
                </div>
                : <p></p>}

              <label className="form-lbl" htmlFor="category">
                Categoría:
              </label>
              <input
                className="form-input"
                type="text"
                id="category"
                value="Autoservicio"
                disabled
              />

              <button className="btn-edit" type="submit">
                Actualizar
              </button>
              <button
                className="btn-cancel"
                onClick={() => navigate("/servicesAutoservicio")}
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

export default EditServiceAutoservicio;
