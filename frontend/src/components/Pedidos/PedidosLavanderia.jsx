import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { Modal, Checkbox } from "antd";
import useSWR from "swr";
import ReactPaginate from "react-paginate";
import api from "../../api/api";
import { useAuth } from "../../hooks/auth/auth";

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
  const { cookies } = useAuth();
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

  const [isDryingProcessConfirmedInModal, setIsDryingProcessConfirmedInModal] =
    useState(false);

  const fetcher = async () => {
    const response = await api.get("/laundryQueue");
    return response.data;
  };

  const { data } = useSWR("laundryQueue", fetcher);


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
        pedido.id_laundryEvent.toString().includes(filtro)
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
    }, 500);
  };

  const handleSelectMachine = (machine) => {
    setSelectedWashMachine(machine);
  };

  const handleSelectDryMachine = (machine) => {
    setSelectedDryMachine(machine);
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
        p.id_laundryEvent === selectedPedido.id_laundryEvent
          ? { ...p, serviceStatus: "inProgressWash" }
          : p
      );

      setPedidos(updatedPedidos);

      setShowMachineName(false);

      await api.patch(`/orders/${selectedPedido.fk_idServiceOrder}`, {
        orderStatus: "inProgress",
      });

      await api.patch(`/updateWashDetails/${selectedPedido.id_laundryEvent}`, {
        fk_idWashMachine: selectedWashMachine.id_machine,
        fk_idStaffMember: cookies.token,
      });

      setShowMachineName(false);
      showNotification(`Pedido iniciado en ${selectedWashMachine.model}`);
    } catch (error) {
      console.error("Error al confirmar la máquina:", error);
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
      setIsDryingProcessConfirmedInModal(false);

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
        if (selectedWashMachine) {
          const updatedWashers = availableMachines.map((machine) =>
            machine.id_machine === selectedWashMachine.id_machine
              ? { ...machine, freeForUse: true }
              : machine
          );
          setAvailableMachines(updatedWashers);

          // También actualizar la base de datos
          await api.patch(`/machines/${selectedWashMachine.id_machine}`, {
            freeForUse: true,
          });
        } else {
          const res = await api.get(`/laundryQueueById/${selectedPedido.id_laundryEvent}`)
          const selectedWashMachine = res.data.WashDetail
          await api.patch(`/finishLaundryQueue/${selectedPedido.id_laundryEvent}`, {
            fk_idDryMachine: selectedWashMachine.fk_idWashMachine,
            fk_idStaffMember: cookies.token,
          });

          await api.patch(`/machines/${selectedWashMachine.fk_idWashMachine}`, {
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

      // Actualizar el estado del pedido a "inProgressDry"
      const updatedPedido = { ...selectedPedido, serviceStatus: "inProgressDry" };
      const updatedPedidos = pedidos.map((p) =>
        p.id_laundryEvent === selectedPedido.id_laundryEvent ? updatedPedido : p
      );
      setPedidos(updatedPedidos);

      setShowDryerSelection(false); // Ocultar la selección de secadora
      setIsDryingProcessConfirmedInModal(true);

      await api.patch(`/updateDryDetails/${selectedPedido.id_laundryEvent}`, {
        fk_idDryMachine: selectedDryMachine.id_machine,
        fk_idStaffMember: cookies.token,
      });

      showNotification(`Pedido Secado en ${selectedDryMachine.model}`);

    } catch (error) {
      console.error("Error al confirmar la secadora:", error);
    }

  };

  const handleFinishProcess = async (pedido) => {

    try {

      if (!pedido) {
        console.error("El pedido seleccionado es indefinido.");
        return;
      }

      if (selectedDryMachine) {

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

        await api.patch(`/finishLaundryQueue/${pedido.id_laundryEvent}`, {
          fk_idDryMachine: selectedDryMachine.id_machine,
          fk_idStaffMember: cookies.token,
        });

      } else {
        const res = await api.get(`/laundryQueueById/${pedido.id_laundryEvent}`)
        const selectedDryMachine = res.data.DryDetail
        
        await api.patch(`/finishLaundryQueue/${pedido.id_laundryEvent}`, {
          fk_idDryMachine: selectedDryMachine.fk_idDryMachine,
          fk_idStaffMember: cookies.token,
        });

        await api.patch(`/machines/${selectedDryMachine.fk_idDryMachine}`, {
          freeForUse: true,
        });
      }

      // Actualizar el estado del pedido a "finish"
      const updatedPedido = { ...pedido, serviceStatus: "finished" };
      const updatedPedidos = pedidos.map((p) =>
        p.id_laundryEvent === pedido.id_laundryEvent ? updatedPedido : p
      );
      setPedidos(updatedPedidos);

      showNotification(`Pedido Finalizado`);

      setShowMachineName(false);

      //   showNotification("NOTIFICACIÓN ENVIADA...");
      //   await api.post("/sendMessage", {
      //     id_laundryEvent: selectedPedido.id_laundryEvent,
      //     name: selectedPedido.client.name,
      //     email: selectedPedido.client.email,
      //     tel: "521" + selectedPedido.client.phone,
      //     message: `Tu pedido con el folio: ${selectedPedido.id_laundryEvent} está listo, Ya puedes pasar a recogerlo.`,
      //     subject: "Tu Ropa esta Lista",
      //     text: `Tu ropa esta lista, esperamos que la recojas a su brevedad`,
      //     warning: false,
      //   });
      //   console.log("NOTIFICACIÓN ENVIADA...");
      //   showNotification(`Pedido finalizado correctamente`);
      // } catch (error) {
      //   console.error("Error al actualizar el pedido:", error);
      // }
    } catch (err) {
      console.log(err)
    }
  };

  const formatDateToGMTMinus6 = (dateStr) => {
    const date = new Date(dateStr);
    date.setHours(date.getHours() - 6);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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
              .filter(
                (pedido) =>
                  pedido.serviceStatus !== "finished" &&
                  pedido.serviceStatus !== "delivered"
              ) // Filtrar pedidos que no tienen estado "finished"
              .slice(startIndex, endIndex)
              .map((pedido) => (
                <tr key={pedido.id_laundryEvent}>
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
                    {pedido.LaundryService.description}
                  </td>

                  <td className="py-3 px-6">
                    {formatDateToGMTMinus6(pedido.LaundryService.created)}
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
                    ) : pedido.serviceStatus === "inProgressWash" || pedido.serviceStatus === "inProgressDry" ? (
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
                  <td className="py-3 px-6">
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
                        onClick={() => handleStartDryerProcess(pedido)}
                        className="btn-primary ml-2 mt-1"
                      >
                        Secado
                      </button>
                    )}

                    {pedido.serviceStatus === "inProgressDry" && (
                      <button
                        onClick={() => handleFinishProcess(pedido)}
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
                pedido.serviceStatus !== "finished" &&
                pedido.serviceStatus !== "delivered"
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
                .filter(
                  (machine) =>
                    machine.machineType === "lavadora" &&
                    machine.status === "available"
                )
                .map((machine) => (
                  <tr key={machine.id_machine}>
                    <td>{machine.machineType}</td>
                    <td>{machine.model}</td>
                    <td>{machine.cicleTime}</td>
                    <td>{machine.weight}</td>
                    <td
                      className={`${machine.freeForUse ? "text-green-500" : "text-red-500"
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
                .filter(
                  (machine) =>
                    machine.machineType === "secadora" &&
                    machine.status === "available"
                )
                .map((machine) => (
                  <tr key={machine.id_machine}>
                    <td>{machine.machineType}</td>
                    <td>{machine.model}</td>
                    <td>{machine.cicleTime}</td>
                    <td>{machine.weight}</td>
                    <td
                      className={`${machine.freeForUse ? "text-green-500" : "text-red-500"
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
