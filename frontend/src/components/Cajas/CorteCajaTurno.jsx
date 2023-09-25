import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { Link } from "react-router-dom";
import { Modal, Button, Input, Select } from "antd";
import moment from "moment";
import jsPDF from "jspdf";

function CorteCajaTurno() {
  const [Cortes, setCortes] = useState([]);
  const [filteredCortes, setFilteredCortes] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [visible, setVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [monto, setMonto] = useState("");
  const [turno, setTurno] = useState("Matutino");
  const [usuario, setUsuario] = useState("");
  const [fechaHora, setFechaHora] = useState("");
  const [nombreEmpleado, setNombreEmpleado] = useState(" SOY EMPLEADO"); 
  const [consultarVisible, setConsultarVisible] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const formattedDate = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
      setFechaHora(formattedDate);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);
  

  useEffect(() => {
    const dummyCortes = [
      {
        id: 1,
        fecha: "2023-09-20",
        monto: 1500,
        usuario: "Usuario1",
        turno: "Matutino",
      },
      {
        id: 2,
        fecha: "2023-09-18",
        monto: 1200,
        usuario: "Usuario2",
        turno: "Vespertino",
      },
      {
        id: 3,
        fecha: "2023-09-15",
        monto: 1800,
        usuario: "Usuario3",
        turno: "Matutino",
      },
    ];

    setCortes(dummyCortes);
    setFilteredCortes(dummyCortes);
  }, []);

  const handleFiltroChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = Cortes.filter((corte) =>
      corte.usuario.toLowerCase().includes(searchTerm) ||
      corte.usuario.toLowerCase().startsWith(searchTerm)
    );
    setFiltro(event.target.value);
    setFilteredCortes(filtered);
  };

  const handleCorteCaja = () => {
    setDialogVisible(true);
  };

  const handleConfirmCorteCaja = () => {
    const nuevoCorte = {
      id: Cortes.length + 1,
      fecha: fechaHora,
      monto: 100, 
      usuario: "EL ROJO", 
      motivo: "FINIQUITO", 
      turno: "VESPERTINO",
    };

     
    const pdf = new jsPDF();
    pdf.text(`Corte de Caja Parcial - ${nombreEmpleado}`, 10, 10);
    pdf.text(`Fecha y Hora: ${fechaHora}`, 10, 20);
    pdf.text(`Monto: ${nuevoCorte.monto}`, 10, 30);
    pdf.text(`Usuario: ${nuevoCorte.usuario}`, 10, 40);
    pdf.text(`Motivo: ${nuevoCorte.motivo}`, 10, 50);
    pdf.save("corte_de_caja_parcial.pdf");


    setCortes([...Cortes, nuevoCorte]);
    setFilteredCortes([...Cortes, nuevoCorte]);

    setDialogVisible(false);
  };

  const handleCloseDialog = () => {
    setDialogVisible(false);
  };

  const handleConsultarCortes = () => {
    setConsultarVisible(!consultarVisible);
  };

  return (
    <div className="text-center mt-4">
      <h1 className="text-4xl">BIENVENIDO {nombreEmpleado}</h1>
      <p className="text-2xl">{fechaHora}</p>
      <p className="text-xl mt-4">¿Desea realizar un corte de caja?</p>
      <button
        onClick={handleCorteCaja}
        className="mt-4 bg-green-500 text-white p-3 rounded-md shadow-lg hover:bg-green-600 hover:scale-105 transition-transform transform active:scale-95 focus:outline-none text-sm"
      >
        Corte de Caja Turno
      </button>
      <Modal
        title="Confirmar Corte de Caja Turno"
        visible={dialogVisible}
        onOk={handleConfirmCorteCaja}
        onCancel={handleCloseDialog}
        width={400}
        footer={[
          <Button
            key="confirmar"
            onClick={handleConfirmCorteCaja}
            className="bg-green-500 text-white hover:bg-green-600 hover:scale-105 transition-transform transform active:scale-95 focus:outline-none text-sm"
          >
            Confirmar
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
        <p>¿Estás seguro de realizar un corte de caja de turno?</p>
      </Modal>
      <button
        onClick={handleConsultarCortes}
        className="mt-4 ml-4 bg-blue-500 text-white p-3 rounded-md shadow-lg hover:bg-blue-600 hover:scale-105 transition-transform transform active:scale-95 focus:outline-none text-sm"
      >
        Consultar Cortes de Caja
      </button>
      {consultarVisible && (
        <div>
          <div className="mb-3">
            <div className="bg-white px-4 pt-3 pb-4 rounded-md border border-gray-200 flex-1 mt-4">
              <strong>Corte de Caja Turno</strong>
            </div>
          </div>
          <div className="bg-neutral-600 rounded-md min-h-screen p-4">
            <div className="flex items-center mb-4">
              <div className="relative w-full">
                {consultarVisible && (
                  <div className="relative w-full flex items-center">
                    <div className="absolute left-1 top-4 text-gray-400">
                      <HiOutlineSearch
                        fontSize={20}
                        className="text-gray-400"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Buscar..."
                      className="border-2 rounded-md py-2 px-4 pl-10 text-gray-600 focus:outline-none focus:ring focus:border-blue-300 border-black mt-2"
                      value={filtro}
                      onChange={handleFiltroChange}
                    />
                  </div>
                )}
              </div>
            </div>
            {consultarVisible && (
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                  <tr>
                    <th className="py-3 px-1 text-center">ID</th>
                    <th className="py-3 px-6">Fecha</th>
                    <th className="py-3 px-6">Monto</th>
                    <th className="py-3 px-6">Usuario</th>
                    <th className="py-3 px-6">Turno</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCortes.map((corte) => (
                    <tr className="bg-white border-b" key={corte.id}>
                      <td className="py-3 px-1 text-center">{corte.id}</td>
                      <td className="py-3 px-6">{corte.fecha}</td>
                      <td className="py-3 px-6">{corte.monto}</td>
                      <td className="py-3 px-6">{corte.usuario}</td>
                      <td className="py-3 px-6">{corte.turno}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CorteCajaTurno;
