import React, { useState, useEffect } from "react";
import { Modal, Button, Input } from "antd";
import moment from "moment";
import { useAuth } from "../../hooks/auth/auth";

function InicioCaja() {
  const [visible, setVisible] = useState(false);
  const { cookies } = useAuth();
  const [nombreUsuario, setNombreUsuario] = useState(cookies.username || "");
  const [dineroInicio, setDineroInicio] = useState("");
  const [cajaIniciada, setCajaIniciada] = useState(false);
  const [fechaHora, setFechaHora] = useState("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      const formattedDate = moment().format('DD/MM/yyyy HH:mm:ss');
      setFechaHora(formattedDate);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleIniciarCaja = () => {
    if (nombreUsuario && dineroInicio) {
      setCajaIniciada(true);
      setVisible(false);
    } else {
      // Mostrar un mensaje de error si los campos no están completos.
      // Puedes implementar esto utilizando el componente Modal de Ant Design.
    }
  };

  const handleAbrirFormulario = () => {
    setVisible(true);
  };

  const handleCloseDialog = () => {
    setVisible(false);
  };

  return (
    <div className="text-center mt-4">
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
          <p className="text-xl mt-4">¿Desea inicializar la caja    ?</p>
          <button
            onClick={handleAbrirFormulario}
            className="mt-4 bg-green-500 text-white p-3 rounded-md shadow-lg hover:bg-green-600 hover:scale-105 transition-transform transform active:scale-95 focus:outline-none text-sm"
            >
            Iniciar Caja
          </button>
        </div>
      )}
      <Modal
        title="Iniciar Caja"
        visible={visible}
        onOk={handleIniciarCaja}
        onCancel={handleCloseDialog}
        width={400}
        footer={[
          <Button
            key="iniciar"
            onClick={handleIniciarCaja}
            className="bg-blue-500 text-white hover:bg-blue-600 hover:scale-105 transition-transform transform active:scale-95 focus:outline-none text-sm"
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
          <strong>Dinero de Inicio (Fondo):</strong>
        </p>
        <Input
          placeholder="Ingrese la cantidad inicial de dinero"
          value={dineroInicio}
          onChange={(e) => setDineroInicio(e.target.value)}
          addonBefore="$"
        />
        <p className="mt-2">
          <strong>Fecha y Hora:</strong>
        </p>
        <Input value={fechaHora} readOnly />
      </Modal>
    </div>
  );
}

export default InicioCaja;
