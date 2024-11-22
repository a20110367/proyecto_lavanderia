import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { GiWashingMachine } from "react-icons/gi";
import { BiSolidDryer } from "react-icons/bi";
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

/*setTimeout 60000 const relays = [] 
machine.map( machine => 
    if(machine.ipAddress){
      relays.push(api.get(`http://${machine.ipAddress}/relay/0?`)
    }else{
      relay.push('-')
    }
  ))
*/

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
  const [shellyTime, setShellyTime] = useState()
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const { cookies } = useAuth();
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const checkShelly = async (machine) => {
    const ip = machine.ipAddress;
    const res = await api.get(`http://${ip}/relay/0`);
    return res.data.timer_remaining
  };

  const fetcher = async () => {
    const response = await api.get("/selfServiceQueue");
    const data = response.data.filter((pedido) => pedido.serviceStatus !== "finished")
    // const shellyData = data.map((p) =>
    //   p.serviceStatus === 'inProgress'
    //     ? { ...p, timerRemaining: shellyTime }
    //     : { ...p, timerRemaining: '-' }
    // );
    return data
  };

  const { data } = useSWR("selfServiceQueue", fetcher);

  useEffect(() => {
    if (data) {
      setPedidos(data);
      setFilteredPedidos(data);
    }
  }, [data]);

  // const fetcherShelly = async () => {
  //   const shellyData = data.forEach(p => {
  //     p.serviceStatus === 'inProgress' ? checkShelly(p.machine).then((response) => {
  //       setShellyTime(response.data)
  //       return response.data
  //     }) : '-'
  //   });
  //   return shellyData
  // };

  // const { shellyData } = useSWR("shellyInfoWithSelfServiceQueue", fetcherShelly);

  // console.log(shellyData)

  // console.log(shellyTime)

  // useEffect(() => {
  //   if (shellyData) {
  //     setPedidos(shellyData);
  //     setFilteredPedidos(shellyData);
  //   }
  // }, [shellyData]);

  useEffect(() => {
    const filtered = pedidos.filter((pedido) => {
      if (filtroEstatus === "") {
        return true;
      } else {
        return pedido.serviceStatus === filtroEstatus;
      }
    });

    console.log(data)

    const textFiltered = filtered.filter((pedido) => {
      const searchTerm = filtro.toLowerCase();
      const searchTermsArray = searchTerm.split(" ");


      const isMatch = searchTermsArray.every((term) =>
        [pedido.serviceOrder.client.name, pedido.serviceOrder.client.firstLN, pedido.serviceOrder.client.secondLN]
          .join(" ")
          .toLowerCase()
          .includes(term)
      );
      return (
        isMatch ||
        pedido.serviceOrder.user.name
          .toLowerCase()
          .includes(filtro.toLowerCase()) ||
        pedido.serviceOrder.user.name
          .toLowerCase()
          .includes(filtro.toLowerCase()) ||
        pedido.id_description.toString().includes(filtro) ||
        pedido.id_serviceEvent.toString().includes(filtro) ||
        pedido.id_serviceEvent.toString().includes(filtro)
      );
    });

    setFilteredPedidos(textFiltered);
    setCurrentPage(0);
  }, [filtro, filtroEstatus, pedidos]);

  if (!data) return <h2>Loading...</h2>;
  const handleFiltroChange = (event) => {
    setFiltro(event.target.value);
  };

  const turnOnMachine = async (machine) => {
    // GET http://192.168.1.77/relay/0?turn=on&timer=300
    // Harcoded
    // const ip = '192.168.1.77'
    // const time = '30'

    const ip = machine.ipAddress;
    if (ip === null) {
      console.warn("No se encontro IP del equipo");
    } else {
      try {
        const time = machine.cicleTime;
        const res = await api.get(
          `http://${ip}/relay/0?turn=on&timer=${time * 60}`
        );
        console.log(res);
      } catch (err) {
        console.warn("El equipo Shelly esta desconectado");
        // console.error(err)
      }
    }
  };

  const turnOffMachine = async (machine) => {
    const ip = machine.ipAddress;
    if (ip === null) {
      console.warn("No se encontro IP del equipo");
    } else {
      try {
        const res = await api.get(`http://${ip}/relay/0?turn=off`);
        console.log(res);
      } catch (err) {
        console.warn("El equipo Shelly esta desconectado");
      }
    }
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

      turnOnMachine(selectedMachine);

      const updatedPedidos = pedidos.map((p) =>
        p.id_serviceEvent === selectedPedido.id_serviceEvent
          ? { ...p, serviceStatus: "inProgress"}
          : p
      );
      setPedidos(updatedPedidos);

      await api.patch(
        `/startSelfServiceQueue/${selectedPedido.id_serviceEvent}`,
        {
          fk_idMachine: selectedMachine.id_machine,
          fk_idStaffMember: cookies.token,
        }
      );

      setShowMachineName(false);
      showNotification(`Pedido iniciado en ${selectedMachine.model}`);
    } catch (error) {
      console.error("Error al actualizar el pedido o la máquina:", error);
    }
  };

  const handleFinishProcess = async (pedido) => {
    if (!pedido) {
      console.error("El pedido seleccionado es indefinido.");
      setLoading(false);
      return;
    }

    try {
      const [machinesResponse] = await Promise.all([api.get("/machines")]);
      const availableMachines = [...machinesResponse.data];
      const res = await api.get(
        `/selfServiceQueueById/${pedido.id_serviceEvent}`
      );
      const selectedMachine = res.data;

      // Actualizar localmente el estado del pedido a "finished"
      const updatedPedidos = pedidos.map((p) =>
        p.id_serviceEvent === pedido.id_serviceEvent
          ? { ...p, serviceStatus: "finished"}
          : p
      );
      setPedidos(updatedPedidos);

      // Actualizar en la base de datos el estado de la máquina a "freeForUse"
      await api.patch(`/machines/${selectedMachine.fk_idMachine}`, {
        freeForUse: true,
      });

      turnOffMachine(selectedMachine.machine);

      // Actualizar localmente el estado de la máquina a "freeForUse"
      const updatedMachines = availableMachines.map((machine) =>
        machine.id_machine === selectedMachine.fk_idMachine
          ? { ...machine, freeForUse: true }
          : machine
      );
      setAvailableMachines(updatedMachines);

      await api.patch(`/finishSelfServiceQueue/${pedido.id_serviceEvent}`, {
        fk_idMachine: selectedMachine.fk_idMachine,
        fk_idStaffMember: cookies.token,
      });

      setShowMachineName(false);
    } catch (error) {
      console.error("Error al finalizar el pedido:", error);
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
            value="inProgress"
            className="text-yellow-600 font-semibold text-base"
          >
            En Proceso
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
              <th>Equipo</th>
              <th>Estatus</th>
              {/* <th>Tiempo Restante</th> */}
              <th>Observaciones</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredPedidos
              .filter((pedido) => pedido.serviceStatus !== "finished") // Filtrar pedidos que no tienen estado "finished"
              .slice(startIndex, endIndex)
              .map((pedido) => (
                <tr key={pedido.id_serviceEvent}>
                  <td className="py-3 px-1 text-center">
                    {pedido.id_description}
                  </td>
                  <td className="py-3 px-6 font-medium text-gray-900">
                    {pedido.serviceOrder.user.name} {pedido.serviceOrder.user.firstLN} {pedido.serviceOrder.user.secondLN}
                  </td>

                  <td className="py-3 px-6 font-medium text-gray-900">
                    {pedido.serviceOrder.client.name} {pedido.serviceOrder.client.firstLN} {pedido.serviceOrder.client.secondLN}
                  </td>
                  <td className="py-3 px-6">
                    {pedido.SelfService.description}
                  </td>

                  <td className="py-3 px-6">
                    {formatDate(pedido.serviceOrder.scheduledDeliveryDate)}
                  </td>

                  <td className="py-3 px-7 text-black">{
                  pedido.machine.machineType === "lavadora" && pedido.serviceStatus === "inProgress"  && pedido.machine ?
                    <div className="flex"><GiWashingMachine className="text-blue-700" size={32}/>
                      <div className="grid-flow-col">
                        <p className="font-semibold">No. Equipo: <span className="font-black text-blue-600">{pedido.machine.machineNumber}</span></p>
                        <p className="font-semibold">Modelo: <span className="font-normal">{pedido.machine.model}</span></p>
                        {/* {pedido.machine.ipAddress ? 
                        <div>
                          <p className="font-semibold">IP: <span className="font-normal">{pedido.machine.ipAddress}</span></p> 
                          <p className="font-semibold">Restante: <span className="font-normal">{}20min</span></p> 
                        </div>
                        : ""} */}
                        </div>
                    </div>  :
                    pedido.machine.machineType === "secadora" && pedido.serviceStatus === "inProgress" && pedido.machine ?
                    <div className="flex"><BiSolidDryer className="text-green-500" size={32} />
                      <div className="grid-flow-col">
                        <p className="font-semibold">No. Equipo: <span className="font-black text-green-600">{pedido.machine.machineNumber}</span></p>
                        <p className="font-semibold">Modelo: <span className="font-normal">{pedido.machine.model}</span></p>
                        {/* {pedido.machine.ipAddress ? 
                        <div>
                          <p className="font-semibold">IP: <span className="font-normal">{pedido.machine.ipAddress}</span></p> 
                          <p className="font-semibold">Restante: <span className="font-normal">{}15min</span></p> 
                        </div>
                        : ""} */}
                      </div>
                    </div> : "-"}
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
                    ) : pedido.serviceStatus === "inProgress" ? (
                      <span className="text-yellow-600 pl-1">
                        <ClockCircleOutlined /> En Proceso
                      </span>
                    ) : pedido.serviceStatus === "finished" ? (
                      <span className="text-blue-600 pl-1">
                        <IssuesCloseOutlined /> Finalizado
                      </span>
                    ) : pedido.serviceStatus === "cancelled" ? (
                      <span className="text-red-600 pl-1">
                        <StopOutlined /> Cancelado
                      </span>
                    ) : (
                      <span className="text-gray-600 pl-1">Desconocido</span>
                    )}
                  </td>
                  {/* <td>
                    {pedido.timerRemaining}
                  </td> */}
                  {/* {pedido.fk_idMachine ? (
                    <td>
                      {pedido.machine ?  checkShelly(pedido.machine).then((response) =>
                        response.data).then((user) => { return 'Pito' })
                      : 'No ha comenzado'}
                    </td>
                  ) : (
                    <td>-</td>
                  )} */}

                  <td>
                    {pedido.serviceOrder.notes
                      ? pedido.serviceOrder.notes
                      : "No hay notas"}
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

                    {pedido.serviceStatus === "inProgress" && (
                      <button
                        onClick={() => handleFinishProcess(pedido)}
                        className="btn-finish ml-2 mt-1"
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
              (pedido) => pedido.serviceStatus !== "finished"
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
                      className={`${machine.freeForUse ? "text-green-500" : "text-red-500"
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
