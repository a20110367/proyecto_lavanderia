import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { Modal, Checkbox } from "antd";
import useSWR from "swr";
import ReactPaginate from "react-paginate";
import { formatDate } from "../../utils/format";
import { useAuth } from "../../hooks/auth/auth";
import api from "../../api/api";

import {
  IssuesCloseOutlined,
  CheckCircleOutlined,
  MinusCircleOutlined,
  ClockCircleOutlined,
  StopOutlined,
  DropboxOutlined,
} from "@ant-design/icons";

function PedidosAutoservicio() {
  const [pedidos, setPedidos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [filteredPedidos, setFilteredPedidos] = useState([]);
  const [filtroEstatus, setFiltroEstatus] = useState("");
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [availableMachines, setAvailableMachines] = useState([]);
  const itemsPerPage = 10;
  const [showMachineName, setShowMachineName] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const { cookies } = useAuth();
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const fetcher = async () => {
    const response = await api.get("/selfServiceQueue");
    return response.data;
  };

  const { data } = useSWR("selfServiceQueue", fetcher);

  useEffect(() => {
    if (data) {
      setPedidos(data);
      setFilteredPedidos(data);
    }
  }, [data]);

  useEffect(() => {
    const filtered = pedidos.filter((pedido) => {
      if (filtroEstatus === "") {
        return true;
      } else {
        return pedido.serviceStatus === filtroEstatus;
      }
    });

    const textFiltered = filtered.filter((pedido) => {
      return (
        pedido.serviceOrder.client.name
          .toLowerCase()
          .includes(filtro.toLowerCase()) ||
        pedido.serviceOrder.user.name
          .toLowerCase()
          .includes(filtro.toLowerCase()) ||
        pedido.serviceOrder.user.name
          .toLowerCase()
          .includes(filtro.toLowerCase()) ||
        pedido.id_description.toString().includes(filtro)
      );
    });

    setFilteredPedidos(textFiltered);
  }, [filtro, filtroEstatus, pedidos]);

  if (!data) return <h2>Loading...</h2>;
  const handleFiltroChange = (event) => {
    setFiltro(event.target.value);
  };

  const handleFiltroEstatusChange = (event) => {
    setFiltroEstatus(event.target.value);
  };

  const showNotification = (message) => {
    setNotificationMessage(message);
    setNotificationVisible(true);

    setTimeout(() => {
      setNotificationVisible(false);
    }, 2000);
  };

  const handleSelectMachine = (machine) => {
    setSelectedMachine(machine);
  };

  const handleStartProcess = async (pedido) => {
    try {
      setLoading(true);

      // Obtener datos de las máquinas y estaciones de planchado
      const [machinesResponse] = await Promise.all([api.get("/machines")]);

      const allMachines = [...machinesResponse.data];

      setAvailableMachines(allMachines);
      setSelectedMachine(null);
      setSelectedPedido(pedido);
      setShowMachineName(true);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmMachineSelection = async () => {
    try {
      if (!selectedPedido || !selectedMachine) {
        console.error("El pedido o la máquina seleccionada son indefinidos.");
        return;
      }

      const updatedMachines = availableMachines.map((machine) =>
        machine.id_machine === selectedMachine.id_machine
          ? { ...machine, freeForUse: false }
          : machine
      );
      setAvailableMachines(updatedMachines);

      await api.patch(`/machines/${selectedMachine.id_machine}`, {
        freeForUse: false,
      });

      const updatedPedidos = pedidos.map((p) =>
        p.id_laundryEvent === selectedPedido.id_laundryEvent
          ? { ...p, serviceStatus: "inProgressWash" }
          : p
      );

      setPedidos(updatedPedidos);

      await api.patch(`/selfServiceQueue/${selectedPedido.id_serviceEvent}`, {
        fk_idMachine: selectedMachine.id_machine,
        fk_idStaffMember: cookies.token,
      });

      setShowMachineName(false);
      showNotification(`Pedido iniciado en ${selectedMachine.model}`);
    } catch (error) {
      console.error("Error al actualizar el pedido o la máquina:", error);
    }
  };

  const handleFinishProcess = async () => {
    try {
      if (!selectedPedido || !selectedMachine) {
        console.error("El pedido o la máquina seleccionada son indefinidos.");
        return;
      }

      const updatedMachines = availableMachines.map((machine) =>
        machine.id_machine === selectedMachine.id_machine
          ? { ...machine, freeForUse: true }
          : machine
      );
      setAvailableMachines(updatedMachines);

      await api.patch(`/machines/${selectedMachine.id_machine}`, {
        freeForUse: true,
      });

      const updatedPedidos = pedidos.map((p) =>
        p.id_laundryEvent === selectedPedido.id_laundryEvent
          ? { ...p, serviceStatus: "finished" }
          : p
      );

      setPedidos(updatedPedidos);

      await Promise.all([
        api.patch(`/selfServiceQueue/${selectedPedido.id_serviceEvent}`, {
          fk_idMachine: selectedMachine.id_machine,
          fk_idStaffMember: cookies.token,
        }),
        api.patch(`/machines/${selectedMachine.id}`, {
          freeForUse: true,
        }),
      ]);

      setShowMachineName(false);
      showNotification(`Pedido finalizado en ${selectedMachine.model}`);
    } catch (error) {
      console.error(
        "Error al finalizar el pedido o liberar la máquina:",
        error
      );
    }
  };

  return (
    <div>
      <div className="mb-3">
        <div className="title-container">
          <strong className="title-strong">Pedidos de Autoservicio</strong>
        </div>
      </div>
      <div className="flex items-center mb-4">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Buscar..."
            className="input-search"
            value={filtro}
            onChange={handleFiltroChange}
          />
          <div className="absolute top-2.5 left-2.5 text-gray-400">
            <HiOutlineSearch fontSize={20} className="text-gray-400" />
          </div>
        </div>
        <select
          className="select-category"
          value={filtroEstatus}
          onChange={handleFiltroEstatusChange}
        >
          <option className="text-base font-semibold" value="">
            Todos
          </option>
          <option
            value="pending"
            className="text-gray-600 font-semibold text-base"
          >
            Pendientes
          </option>
          <option
            value="inProgressWash"
            className="text-yellow-600 font-semibold text-base"
          >
            En Proceso
          </option>
          <option
            value="finished"
            className="text-blue-600 font-semibold text-base"
          >
            Finalizados
          </option>
          <option
            value="delivered"
            className="text-green-600 font-semibold text-base"
          >
            Entregados
          </option>
          <option
            value="stored"
            className="text-fuchsia-600 font-semibold text-base"
          >
            Almacenados
          </option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200">
            <tr>
              <th>No. Folio</th>
              <th>Recibió</th>
              <th>Cliente</th>
              <th>Detalles</th>
              <th>Fecha de Entrega</th>
              <th>Estatus</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredPedidos
              .filter((pedido) => pedido.serviceStatus !== "delivered") // Filtrar pedidos que no tienen estado "finished"
              .slice(startIndex, endIndex)
              .map((pedido) => (
                <tr key={pedido.id_serviceEvent}>
                  <td className="py-3 px-1 text-center">
                    {pedido.id_description}
                  </td>
                  <td className="py-3 px-6 font-medium text-gray-900">
                    {pedido.serviceOrder.user.name} <br />{" "}
                    {pedido.serviceOrder.user.firstLN}
                  </td>

                  <td className="py-3 px-6 font-medium text-gray-900">
                    {pedido.serviceOrder.client.name} <br />{" "}
                    {pedido.serviceOrder.client.firstLN}
                  </td>
                  <td className="py-3 px-6">
                    {pedido.SelfService.description}
                  </td>

                  <td className="py-3 px-6">
                    {formatDate(pedido.SelfService.created)}
                  </td>
                  <td className="py-3 px-6 font-bold ">
                    {pedido.serviceStatus === "pending" ? (
                      <span className="text-gray-600 pl-1">
                        <MinusCircleOutlined /> Pendiente
                      </span>
                    ) : pedido.serviceStatus === "stored" ? (
                      <span className="text-fuchsia-600 pl-1">
                        <DropboxOutlined /> Almacenado
                      </span>
                    ) : pedido.serviceStatus === "inProgressWash" ? (
                      <span className="text-yellow-600 pl-1">
                        <ClockCircleOutlined /> En Proceso
                      </span>
                    ) : pedido.serviceStatus === "finished" ? (
                      <span className="text-blue-600 pl-1">
                        <IssuesCloseOutlined /> Finalizado no entregado
                      </span>
                    ) : pedido.serviceStatus === "delivered" ? (
                      <span className="text-green-600 pl-1">
                        <CheckCircleOutlined /> Finalizado Entregado
                      </span>
                    ) : (
                      <span className="text-red-600 pl-1">
                        <StopOutlined /> Cancelado
                      </span>
                    )}
                  </td>
                  <td>
                    {pedido.serviceStatus === "pending" && (
                      <button
                        onClick={() => handleStartProcess(pedido)}
                        className="btn-primary ml-2 mt-1"
                      >
                        Iniciar
                      </button>
                    )}

                    {pedido.serviceStatus === "inProgressWash" && (
                      <button
                        onClick={() => handleFinishProcess()}
                        className="btn-primary ml-2 mt-1"
                      >
                        Terminar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center items-center my-8">
        <ReactPaginate
          previousLabel="Anterior"
          nextLabel="Siguiente"
          breakLabel="..."
          pageCount={Math.ceil(
            filteredPedidos.filter(
              (pedido) => pedido.serviceStatus !== "delivered"
            ).length / itemsPerPage
          )}
          marginPagesDisplayed={2}
          pageRangeDisplayed={2}
          onPageChange={handlePageChange}
          containerClassName="pagination flex"
          pageLinkClassName="pageLinkClassName"
          previousLinkClassName="prevOrNextLinkClassName"
          nextLinkClassName="prevOrNextLinkClassName"
          breakLinkClassName="breakLinkClassName"
          activeLinkClassName="activeLinkClassName"
        />
      </div>

      <Modal
        open={showMachineName}
        onCancel={() => setShowMachineName(false)}
        footer={[
          <button
            key="submit"
            className="btn-primary"
            onClick={() => handleConfirmMachineSelection()}
            disabled={!selectedMachine}
          >
            Confirmar
          </button>,
          <button
            key="cancel"
            className="btn-primary-cancel ml-2"
            onClick={() => setShowMachineName(false)}
          >
            Cancelar
          </button>,
        ]}
        width={800}
        style={{ padding: "20px" }}
      >
        <div>
          <p className="mb-4 text-xl font-bold">Selecciona una máquina:</p>
          <table className="w-full text-center">
            <thead className="bg-gray-200">
              <tr>
                <th>Tipo de Máquina</th>
                <th>Modelo</th>
                <th>Tiempo de Ciclo</th>
                <th>Peso</th>
                <th>Estado de la Máquina</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {availableMachines
                .filter((machine) => machine.status === "available")
                .filter((machine) => {
                  if (selectedPedido && selectedPedido.SelfService) {
                    const serviceDescription =
                      selectedPedido.SelfService.description.toLowerCase();
                    if (serviceDescription.includes("lavado")) {
                      return machine.machineType
                        .toLowerCase()
                        .includes("lavadora");
                    } else if (serviceDescription.includes("secado")) {
                      return machine.machineType
                        .toLowerCase()
                        .includes("secadora");
                    }
                  }
                  return true; // Si no hay pedido seleccionado o descripción, muestra todas las máquinas disponibles
                })
                .map((machine) => (
                  <tr key={machine.id_machine}>
                    <td>{machine.machineType}</td>
                    <td>{machine.model}</td>
                    <td>{machine.cicleTime}</td>
                    <td>{machine.weight}</td>
                    <td
                      className={`${
                        machine.freeForUse ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {machine.freeForUse ? "Libre" : "Ocupado"}
                    </td>

                    <td>
                      <div className="flex flex-col items-center">
                        <Checkbox
                          key={`checkbox_${machine.id_machine}`}
                          checked={selectedMachine === machine}
                          onChange={() => handleSelectMachine(machine)}
                          className="mb-2"
                          disabled={!machine.freeForUse}
                        />
                        <span className="text-blue-500">Seleccionar</span>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Modal>

      <Modal
        open={notificationVisible}
        footer={null}
        onCancel={() => setNotificationVisible(false)}
        destroyOnClose
      >
        <div className="text-center">
          <div style={{ fontSize: "36px", color: "#52c41a" }}>
            <CheckCircleOutlined />
          </div>
          <p>{notificationMessage}</p>
        </div>
      </Modal>
    </div>
  );
}

export default PedidosAutoservicio;
