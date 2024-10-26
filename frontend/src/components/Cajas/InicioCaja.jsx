import React, { useState, useEffect } from "react";
import { Modal, Button, Input, Select } from "antd";
const { Option } = Select;
import moment from "moment";
import { useAuth } from "../../hooks/auth/auth";
import { DisabledContextProvider } from "antd/es/config-provider/DisabledContext";
import api from "../../api/api";

function InicioCaja() {
  const [visible, setVisible] = useState(false);
  const { cookies } = useAuth();
  const [nombreUsuario, setNombreUsuario] = useState(cookies.username || "");

  const [workShift, setWorkShift] = useState(
    moment().hours() < 12 ? "morning" : "evening"
  );
  const [dineroInicio, setDineroInicio] = useState(0);
  const [fechaHora, setFechaHora] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [errorVisible, setErrorVisible] = useState(false);
  const [cajaIniciada, setCajaIniciada] = useState(false);
  const dateD = new Date();
  const dateT = new Date();

  useEffect(() => {
    // Verificar la hora actual al montar el componente y actualizar workShift
    setWorkShift(moment().hours() < 12 ? "morning" : "evening");
  }, []);

  const handleWorkShiftChange = (value) => {
    setWorkShift(value);
  };

  useEffect(() => {
    const formattedDate = moment().format("DD/MM/yyyy HH:mm");
    setFechaHora(formattedDate);
  }, []);

  useEffect(() => {
    // Verificar si la caja ya ha sido inicializada
    const cashCutId = localStorage.getItem("cashCutId");
    if (cashCutId) {
      setCajaIniciada(true);
    }
  }, []);

  const handleIniciarCaja = async (e) => {
    e.preventDefault();

    if (cajaIniciada) {
      setErrMsg("La caja ya ha sido inicializada.");
      return;
    }

    if (!nombreUsuario && !dineroInicio) {
      setErrMsg("Algun campo vacio");
      return;
    }
    try {
      const response = await api.post("/cashCuts", {
        initialCash: parseFloat(dineroInicio),
        fk_user: parseInt(cookies.token),
        cashCutD: dateD.toJSON(),
        cashCutT: dateT.toJSON(),
        workShift: workShift,
      });
      const resProducts = await api.post('/supplyCashCuts', {
        fk_user: parseInt(cookies.token),
        cashCutD: dateD.toJSON(),
        cashCutT: dateT.toJSON(),
        workShift: workShift,
      })
      console.log(workShift);
      localStorage.setItem("cashCutId", response.data.id_cashCut);
      localStorage.setItem('id_supplyCashCut', resProducts.data.id_supplyCashCut)
      localStorage.setItem("initialCash", response.data.initialCash);
      localStorage.removeItem("lastCashCut");
      setCajaIniciada(true);
      setVisible(false);
    } catch (err) {
      console.log(err);
      if (!err?.response) {
        setErrMsg("No hay respuesta del servidor.");
      } else {
        setErrMsg("Error al hacer corte de caja.");
      }
    }
  };
  const handleDineroInicioInput = () => {
    setErrorVisible(false); // Ocultar el mensaje de error cuando se escribe en el campo
  };

  const handleAbrirFormulario = async () => {
    try {
      const res = await api.get("/cashCutStatus");
      const supplyRes = await api.get('/getSupplyCashCutStatus')
      if (res.data.cashCutStatus === "closed" && supplyRes.data.cashCutStatus === 'closed') {
        setVisible(true);
      } else if (res.data.cashCutStatus === "open" && supplyRes.data.cashCutStatus === 'open') {
        localStorage.removeItem("lastCashCut");
        localStorage.setItem("cashCutId", res.data.id_cashCut);
        localStorage.setItem("id_supplyCashCut", supplyRes.data.id_supplyCashCut)
        setCajaIniciada(true);
        setVisible(false);
      } else {
        setVisible(false);
      }
    } catch (err) {
      console.log(err);
      console.error("No entiendo como sucedio esto");
    }
  };

  const handleCloseDialog = () => {
    setVisible(false);
  };

  return (
    <div className="text-center mt-4">
      <p>{errMsg}</p>
      {cajaIniciada ? (
        <div>
          <h1 className="text-4xl">
            La caja ya está inicializada por el{" "}
            {cookies.role === "admin" ? "Administrador" : "Empleado"}{" "}
            {nombreUsuario}.
          </h1>
          <p className="text-2xl">{fechaHora}</p>
        </div>
      ) : (
        <div>
          <h1 className="text-4xl">
            Bienvenido a inicio de caja{" "}
            {cookies.role === "admin" ? "Administrador" : "Empleado"}{" "}
            {nombreUsuario}
          </h1>
          <p className="text-2xl">{fechaHora}</p>
          <p className="text-xl mt-4">¿Desea inicializar la caja ?</p>
          <button
            onClick={handleAbrirFormulario}
            className="mt-4 bg-NonPhotoblue font-bold px-14 py-3 rounded-md shadow-lg hover:bg-Cerulean hover:text-white hover:scale-105 transition-transform transform active:scale-95 focus:outline-none text-base"
          >
            Iniciar Caja
          </button>
        </div>
      )}
      <Modal
        title="Iniciar Caja"
        open={visible}
        onOk={handleIniciarCaja}
        onCancel={handleCloseDialog}
        width={400}
        footer={[
          <Button
            key="iniciar"
            onClick={handleIniciarCaja}
            className="btn-print text-white"
          >
            Iniciar
          </Button>,
          <Button
            key="cancelar"
            onClick={handleCloseDialog}
            className="bg-red-500 text-white hover:bg-red-600 hover:scale-105 transition-transform transform active:scale-95 focus:outline-none text-sm"
          >
            Cancelar
          </Button>,
        ]}
      >
        <p>
          <strong>Usuario:</strong>
        </p>
        <Input
          placeholder="Ingrese el nombre del usuario"
          value={nombreUsuario}
          readOnly
        />

        <p className="mt-2">
          <strong>Turno:</strong>
        </p>
        <Select
          value={workShift}
          onChange={handleWorkShiftChange}
          style={{ width: "100%" }}
        >
          <Option value="morning">Matutino</Option>
          <Option value="evening">Vespertino</Option>
        </Select>
        <p className="mt-2">
          <strong>Dinero de Inicio (Fondo):</strong>
        </p>
        <Input
          type="number"
          placeholder="Ingrese la cantidad inicial de dinero"
          value={dineroInicio}
          onChange={(e) => setDineroInicio(e.target.value)}
          addonBefore="$"
          onInput={handleDineroInicioInput}
        />
        {errorVisible && (
          <p className="text-red-600">Este campo es obligatorio</p>
        )}
        <p className="mt-2"></p>
        <p className="mt-2">
          <strong>Fecha y Hora:</strong>
        </p>
        <Input value={fechaHora} readOnly />
      </Modal>
    </div>
  );
}

export default InicioCaja;
