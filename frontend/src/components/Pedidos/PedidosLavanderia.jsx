import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { Modal, Checkbox } from "antd";
import useSWR from "swr";
import ReactPaginate from "react-paginate";
import api from "../../api/api";

import {
  IssuesCloseOutlined,
  CheckCircleOutlined,
  MinusCircleOutlined,
  ClockCircleOutlined,
  StopOutlined,
  DropboxOutlined,
} from "@ant-design/icons";

function PedidosLavanderia() {
  const [pedidos, setPedidos] = useState([]);
  const [confirmedDryerProcesses, setConfirmedDryerProcesses] = useState({});
  const [filtro, setFiltro] = useState("");
  const [filteredPedidos, setFilteredPedidos] = useState([]);
  const [filtroEstatus, setFiltroEstatus] = useState("");
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState();
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedWashMachine, setSelectedWashMachine] = useState();
  const [selectedDryMachine, setSelectedDryMachine] = useState();
  const [availableMachines, setAvailableMachines] = useState([]);
  const itemsPerPage = 10;
  const [showMachineName, setShowMachineName] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };
  const [showDryerSelection, setShowDryerSelection] = useState(false);
  const [isDryingProcessConfirmed, setIsDryingProcessConfirmed] =
    useState(false);

  const [isDryingProcessConfirmedInModal, setIsDryingProcessConfirmedInModal] =
    useState(false);

  const fetcher = async () => {
    const response = await api.get("/ordersLaundry");
    return response.data;
  };

  const { data } = useSWR("ordersLaundry", fetcher);

  useEffect(() => {
    if (data && Object.keys(confirmedDryerProcesses).length === 0) {
      const initialStates = {};
      data.forEach((pedido) => {
        initialStates[pedido.id_order] = false;
      });
      // Actualizar los estados solo si hay cambios
      if (Object.keys(initialStates).length > 0) {
        setConfirmedDryerProcesses(initialStates);
      }
    }
  }, [data, confirmedDryerProcesses]);
  

  useEffect(() => {
    const storedConfirmationStatus = localStorage.getItem(
      "isDryingProcessConfirmed"
    );
    setIsDryingProcessConfirmed(storedConfirmationStatus === "true");

    const storedModalConfirmationStatus = localStorage.getItem(
      "isDryingProcessConfirmedInModal"
    );
    setIsDryingProcessConfirmedInModal(
      storedModalConfirmationStatus === "true"
    );
  }, []);

  useEffect(() => {
    const storedShowDryerSelection = localStorage.getItem("showDryerSelection");
    setShowDryerSelection(storedShowDryerSelection === "true");
  }, []);

  useEffect(() => {
    const storedSelectedPedido = JSON.parse(
      localStorage.getItem("selectedPedido")
    );
    if (storedSelectedPedido) {
      setSelectedPedido(storedSelectedPedido);
    }

    const storedIsDryingProcessConfirmed = localStorage.getItem(
      "isDryingProcessConfirmed"
    );
    if (storedIsDryingProcessConfirmed) {
      setIsDryingProcessConfirmed(storedIsDryingProcessConfirmed === "true");
    }
  }, []);

  useEffect(() => {
    // Guardar el pedido seleccionado
    if (selectedPedido) {
      localStorage.setItem("selectedPedido", JSON.stringify(selectedPedido));
    }

    // Guardar la lavadora seleccionada
    if (selectedWashMachine) {
      localStorage.setItem(
        "selectedWashMachine",
        JSON.stringify(selectedWashMachine)
      );
    }

    // Guardar la secadora seleccionada
    if (selectedDryMachine) {
      localStorage.setItem(
        "selectedDryMachine",
        JSON.stringify(selectedDryMachine)
      );
    }
  }, [selectedPedido, selectedWashMachine, selectedDryMachine]);

  useEffect(() => {
    if (data) {
      setPedidos(data);
      setFilteredPedidos(data);
    }

    const confirmedDryerProcessesFromStorage = {};
    if (data) {
      data.forEach((pedido) => {
        const confirmedDryerProcess = localStorage.getItem(
          `confirmedDryerProcess_${pedido.id_order}`
        );
        if (confirmedDryerProcess !== null) {
          confirmedDryerProcessesFromStorage[pedido.id_order] =
            confirmedDryerProcess === "true";
        }
      });

      setConfirmedDryerProcesses(confirmedDryerProcessesFromStorage);
    }
  }, [data]);

  useEffect(() => {
    const filtered = pedidos.filter((pedido) => {
      if (filtroEstatus === "") {
        return true;
      } else {
        return pedido.orderStatus === filtroEstatus;
      }
    });

    const textFiltered = filtered.filter((pedido) => {
      return (
        pedido.client.name.toLowerCase().includes(filtro.toLowerCase()) ||
        pedido.user.name.toLowerCase().includes(filtro.toLowerCase()) ||
        pedido.user.name.toLowerCase().includes(filtro.toLowerCase()) ||
        pedido.id_order.toString().includes(filtro)
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

  const formatDateToGMTMinus6 = (dateStr) => {
    const date = new Date(dateStr);
    date.setHours(date.getHours() - 6);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSelectMachine = (machine) => {
    setSelectedWashMachine(machine);
    localStorage.setItem("selectedWashMachine", JSON.stringify(machine));
  };

  const handleSelectDryMachine = (machine) => {
    setSelectedDryMachine(machine);
    localStorage.setItem("selectedDryMachine", JSON.stringify(machine));
  };

  const handleStartProcess = async (pedido) => {
    try {
      setLoading(true);

      // Obtener datos de las máquinas y estaciones de planchado
      const [machinesResponse] = await Promise.all([api.get("/machines")]);

      const allMachines = [...machinesResponse.data];

      setAvailableMachines(allMachines);
      setSelectedWashMachine(null);
      setSelectedPedido(pedido);
      setShowMachineName(true);
      setShowDryerSelection(false);
      localStorage.setItem("selectedPedido", JSON.stringify(pedido));
    } catch (error) {
      console.error("Error al obtener datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmMachineSelection = async () => {
    try {
      if (!selectedPedido || !selectedWashMachine) {
        console.error("El pedido o la máquina seleccionada son indefinidos.");
        return;
      }

      // Modificar el estado local de la lavadora seleccionada
      const updatedMachines = availableMachines.map((machine) =>
        machine.id_machine === selectedWashMachine.id_machine
          ? { ...machine, freeForUse: false }
          : machine
      );
      setAvailableMachines(updatedMachines);

      await api.patch(`/machines/${selectedWashMachine.id_machine}`, {
        freeForUse: false,
      });
      const updatedPedidos = pedidos.map((p) =>
        p.id_order === selectedPedido.id_order
          ? { ...p, orderStatus: "inProgress" }
          : p
      );

      setPedidos(updatedPedidos);

      await api.patch(`/orders/${selectedPedido.id_order}`, {
        orderStatus: "inProgress",
      });
      setShowMachineName(false);
      showNotification(`Pedido iniciado en ${selectedWashMachine.model}`);
    } catch (error) {
      console.error("Error al actualizar el pedido:", error);
    }
  };

  const handleStartDryerProcess = async (pedido) => {
    try {
      setLoading(true);

      // Obtener datos de las secadoras
      const dryersResponse = await api.get("/machines", {
        params: { machineType: "secadora" },
      });

      const availableDryers = dryersResponse.data;

      setAvailableMachines(availableDryers);
      setSelectedDryMachine(null);
      setSelectedPedido(pedido);
      setShowDryerSelection(true);
      // Cambiar el estado de confirmación de secado a false
      setIsDryingProcessConfirmedInModal(false);
      localStorage.setItem("isDryingProcessConfirmedInModal", "false");

      setConfirmedDryerProcesses({
        ...confirmedDryerProcesses,
        [pedido.id_order]: false, // Establecer el estado del pedido actual como no confirmado para secado
      });

      localStorage.setItem(`confirmedDryerProcess_${pedido.id_order}`, "false");
    } catch (error) {
      console.error("Error al obtener datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDryerSelection = async () => {
    try {
      if (!selectedPedido || !selectedDryMachine) {
        console.error("El pedido o la secadora seleccionada son indefinidos.");
        return;
      }

      // Si hay una lavadora seleccionada, cambiar su estado a true
      if (selectedDryMachine.machineType === "secadora") {
        const selectedWasher = availableMachines.find(
          (machine) => machine.machineType === "lavadora"
        );

        if (selectedWasher) {
          const updatedWashers = availableMachines.map((machine) =>
            machine.id_machine === selectedWasher.id_machine
              ? { ...machine, freeForUse: true }
              : machine
          );
          setAvailableMachines(updatedWashers);

          // También actualizar la base de datos
          await api.patch(`/machines/${selectedWasher.id_machine}`, {
            freeForUse: true,
          });
        }
      }

      // Cambiar el estado de la secadora seleccionada a false
      const updatedDryers = availableMachines.map((machine) =>
        machine.id_machine === selectedDryMachine.id_machine
          ? { ...machine, freeForUse: false }
          : machine
      );
      setAvailableMachines(updatedDryers);

      // Actualizar la base de datos
      await api.patch(`/machines/${selectedDryMachine.id_machine}`, {
        freeForUse: false,
      });

      showNotification(`Pedido finalizado en ${selectedDryMachine.model}`);

      const updatedPedidos = pedidos.map((p) =>
        p.id_order === selectedPedido.id_order
          ? { ...p, isDryingConfirmed: true }
          : p
      );
      setPedidos(updatedPedidos);

      setShowDryerSelection(false); // Ocultar la selección de secadora
      setIsDryingProcessConfirmedInModal(true);
      localStorage.setItem("showDryerSelection", "false");
      localStorage.setItem(
        `confirmedDryerProcess_${selectedPedido.id_order}`,
        "true"
      );

      setConfirmedDryerProcesses({
        ...confirmedDryerProcesses,
        [selectedPedido.id_order]: true, // Establecer el estado del pedido seleccionado como confirmado para secado
      });
    } catch (error) {
      console.error("Error al actualizar el pedido:", error);
    }
  };

  const handleFinishProcess = async () => {
    try {
      if (!selectedPedido) {
        console.error("El pedido seleccionado es indefinido.");
        return;
      }

      // Liberar la secadora seleccionada
      if (selectedDryMachine && selectedDryMachine.machineType === "secadora") {
        const updatedDryers = availableMachines.map((machine) =>
          machine.id_machine === selectedDryMachine.id_machine
            ? { ...machine, freeForUse: true }
            : machine
        );
        setAvailableMachines(updatedDryers);

        // También actualizar la base de datos
        await api.patch(`/machines/${selectedDryMachine.id_machine}`, {
          freeForUse: true,
        });
      }

      // Actualizar el estado del pedido a "finish"
      const updatedPedidos = pedidos.map((p) =>
        p.id_order === selectedPedido.id_order
          ? { ...p, orderStatus: "finished" }
          : p
      );

      setPedidos(updatedPedidos);

      await api.patch(`/orders/${selectedPedido.id_order}`, {
        orderStatus: "finished",
      });

      setShowMachineName(false);

      showNotification("NOTIFICACIÓN ENVIADA...");
      await api.post("/sendMessage", {
        id_order: selectedPedido.id_order,
        name: selectedPedido.client.name,
        email: selectedPedido.client.email,
        tel: "521" + selectedPedido.client.phone,
        message: `Tu pedido con el folio: ${selectedPedido.id_order} está listo, Ya puedes pasar a recogerlo.`,
        subject: "Tu Ropa esta Lista",
        text: `Tu ropa esta lista, esperamos que la recojas a su brevedad`,
        warning: false,
      });
      console.log("NOTIFICACIÓN ENVIADA...");
      showNotification(`Pedido finalizado correctamente`);
      localStorage.removeItem("selectedMachine");
    } catch (error) {
      console.error("Error al actualizar el pedido:", error);
    }
  };

  return (
    <div>
      <div className="mb-3">
        <div className="title-container">
          <strong className="title-strong">Pedidos de Lavanderia</strong>
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
            value="inProgress"
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
              <th>Entregó</th>
              <th>Cliente</th>
              <th>Detalles</th>
              <th>Fecha de Entrega</th>
              <th>Estatus</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredPedidos
              .filter(
                (pedido) =>
                  pedido.orderStatus !== "finished" &&
                  pedido.orderStatus !== "delivered"
              ) // Filtrar pedidos que no tienen estado "finished"
              .slice(startIndex, endIndex)
              .map((pedido) => (
                <tr key={pedido.id_order}>
                  <td className="py-3 px-1 text-center">{pedido.id_order}</td>
                  <td className="py-3 px-6 font-medium text-gray-900">
                    {pedido.user.name}
                  </td>
                  <td className="py-3 px-6 font-medium text-gray-900">
                    {pedido.user.name}
                  </td>
                  <td className="py-3 px-6 font-medium text-gray-900">
                    {pedido.client.name}
                  </td>
                  <td className="py-3 px-6">
                    {pedido.category.categoryDescription === "encargo"
                      ? "Encargo"
                      : pedido.category.categoryDescription}
                  </td>

                  <td className="py-3 px-6">
                    {formatDateToGMTMinus6(pedido.scheduledDeliveryDate)}
                  </td>
                  <td className="py-3 px-6 font-bold ">
                    {pedido.orderStatus === "pending" ? (
                      <span className="text-gray-600 pl-1">
                        <MinusCircleOutlined /> Pendiente
                      </span>
                    ) : pedido.orderStatus === "stored" ? (
                      <span className="text-fuchsia-600 pl-1">
                        <DropboxOutlined /> Almacenado
                      </span>
                    ) : pedido.orderStatus === "inProgress" ? (
                      <span className="text-yellow-600 pl-1">
                        <ClockCircleOutlined /> En Proceso
                      </span>
                    ) : pedido.orderStatus === "finished" ? (
                      <span className="text-blue-600 pl-1">
                        <IssuesCloseOutlined /> Finalizado no entregado
                      </span>
                    ) : pedido.orderStatus === "delivered" ? (
                      <span className="text-green-600 pl-1">
                        <CheckCircleOutlined /> Finalizado Entregado
                      </span>
                    ) : (
                      <span className="text-red-600 pl-1">
                        <StopOutlined /> Cancelado
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-6">
                    {pedido.orderStatus === "pending" && (
                      <button
                        onClick={() => handleStartProcess(pedido)}
                        className="btn-primary ml-2 mt-1"
                      >
                        Iniciar
                      </button>
                    )}

                    {pedido.orderStatus === "inProgress" &&
                      !confirmedDryerProcesses[pedido.id_order] && (
                        <button
                          onClick={() => handleStartDryerProcess(pedido)}
                          className="btn-primary ml-2 mt-1"
                        >
                          Secado
                        </button>
                      )}

                    {pedido.orderStatus === "inProgress" &&
                      confirmedDryerProcesses[pedido.id_order] && (
                        <button
                          onClick={handleFinishProcess}
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
              (pedido) =>
                pedido.orderStatus !== "finished" &&
                pedido.orderStatus !== "delivered"
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
            disabled={!selectedWashMachine}
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
          <p className="mb-4 text-xl font-bold">Selecciona una lavadora:</p>
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
                .filter((machine) => machine.machineType === "lavadora")
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
                          checked={selectedWashMachine === machine}
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
        open={showDryerSelection}
        onCancel={() => setShowDryerSelection(false)}
        footer={[
          <button
            key="submit"
            className="btn-primary"
            onClick={() => handleConfirmDryerSelection()}
            disabled={!selectedDryMachine}
          >
            Confirmar
          </button>,
          <button
            key="cancel"
            className="btn-primary-cancel ml-2"
            onClick={() => setShowDryerSelection(false)}
          >
            Cancelar
          </button>,
        ]}
        width={800}
        style={{ padding: "20px" }}
      >
        <div>
          <p className="mb-4 text-xl font-bold">Selecciona una secadora:</p>
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
                .filter((machine) => machine.machineType === "secadora")
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
                          checked={selectedDryMachine === machine}
                          onChange={() => handleSelectDryMachine(machine)}
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

export default PedidosLavanderia;
