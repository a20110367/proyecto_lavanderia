import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { GiWashingMachine, GiClothesline } from "react-icons/gi";
import { BiSolidDryer } from "react-icons/bi";
import { Modal, Checkbox } from "antd";
import useSWR from "swr";
import ReactPaginate from "react-paginate";
import api from "../../api/api";
import { formatDate, formatTime } from "../../utils/format";
import { useAuth } from "../../hooks/auth/auth";

import {
  IssuesCloseOutlined,
  CheckCircleOutlined,
  MinusCircleOutlined,
  ClockCircleOutlined,
  StopOutlined,
  DropboxOutlined,
} from "@ant-design/icons";
import Swal from "sweetalert2";

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
  const [combinedWash, setCombinedWash] = useState(false);
  const [combinedDry, setCombinedDry] = useState(false);
  // const [lastDryMachine, setLastDryMachine] = useState({
  //   id_machine: 0,
  //   machineNumber: 0,
  //   machineType: "SECA",
  //   model: "LG",
  //   cicleTime: 0,
  //   weight: 0,
  //   freeForUse: false,
  //   isDummy: true,
  // });
  // const [lastWashMachine, setLastWashMachine] = useState({
  //   id_machine: 0,
  //   machineNumber: 0,
  //   machineType: "LAVA",
  //   model: "LG",
  //   cicleTime: 0,
  //   weight: 0,
  //   freeForUse: false,
  //   isDummy: true,
  // });
  const [lastDryMachine, setLastDryMachine] = useState();
  const [lastWashMachine, setLastWashMachine] = useState();
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
  console.log(data)

  useEffect(() => {
    if (data) {
      setPedidos(data);
      setFilteredPedidos(data);
    }
    // if(!localStorage.getItem("selectedCombinedDryMachine")){
    //   const localSDry = localStorage.getItem("selectedCombinedDryMachine")
    //   setLastDryMachine(JSON.parse(localSDry))
    // }
    // if(!localStorage.getItem("selectedCombinedWashMachine")){
    //   const localSWash = localStorage.getItem("selectedCombinedWashMachine")
    //   setLastWashMachine(JSON.parse(localSWash))
    // }
    if (localStorage.getItem("selectedCombinedDryMachine") == null) {
      const dummy = {
        id_machine: 0,
        machineNumber: 0,
        machineType: "SECA",
        model: "LG",
        cicleTime: 0,
        weight: 0,
        freeForUse: false,
        isDummy: true,
      }
      setLastDryMachine(dummy)
    } else {
      setLastDryMachine(JSON.parse(localStorage.getItem("selectedCombinedDryMachine")))
      // setCombinedDry(true);
    }
    if (localStorage.getItem("selectedCombinedWashMachine") == null) {
      const dummy = {
        id_machine: 0,
        machineNumber: 0,
        machineType: "LAVA",
        model: "LG",
        cicleTime: 0,
        weight: 0,
        freeForUse: false,
        isDummy: true,
      }
      setLastWashMachine(dummy)
    } else {
      setLastWashMachine(JSON.parse(localStorage.getItem("selectedCombinedWashMachine")))
      // setCombinedWash(true);
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
        pedido.id_laundryEvent.toString().includes(filtro) ||
        pedido.id_laundryEvent.toString().includes(filtro) ||
        pedido.id_description.toLowerCase().includes(filtro.toLowerCase())
      );
    });

    setFilteredPedidos(textFiltered);
    setCurrentPage(0);
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

  const handleSelectWashMachine = (machine) => {
    setSelectedWashMachine(machine);
    setCombinedWash(false);
  };

  const handleSelectDryMachine = (machine) => {
    setSelectedDryMachine(machine);
    setCombinedWash(false);
  };

  const handleSelectCombinedWashMachine = (machine) => {
    setSelectedWashMachine(machine);
    setCombinedWash(true)
  };

  const handleSelectCombinedDryMachine = (machine) => {
    setSelectedDryMachine(machine);
    setCombinedWash(true);
  };

  const handleStartProcess = async (pedido) => {
    console.log(pedido)
    try {
      setLoading(true);

      setShowMachineName(true);
      setShowDryerSelection(false);

      // Obtener datos de las máquinas y estaciones de planchado
      const [machinesResponse] = await Promise.all([api.get("/machines")]);

      const allMachines = [...machinesResponse.data];

      setAvailableMachines(allMachines);
      setSelectedWashMachine(null);
      setSelectedPedido(pedido);
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

      setShowMachineName(false);
      showNotification(`Pedido iniciado en ${selectedWashMachine.model}`);

      // Modificar el estado local de la lavadora seleccionada
      const updatedMachines = availableMachines.map((machine) =>
        machine.id_machine === selectedWashMachine.id_machine
          ? { ...machine, freeForUse: false }
          : machine
      );
      setAvailableMachines(updatedMachines);

      // await api.patch(`/machines/${selectedWashMachine.id_machine}`, {
      //   freeForUse: false,
      // });

      !combinedWash ? localStorage.setItem("selectedCombinedWashMachine", JSON.stringify(selectedWashMachine)) : console.log("NOT TOGETHER");
      // lastWashMachine.machineNumber === 0 || lastWashMachine != selectedWashMachine ? localStorage.setItem("selectedCombinedWashMachine", JSON.stringify(selectedWashMachine)) : console.log("NOT TOGETHER");

      const updatedPedidos = pedidos.map((p) =>
        p.id_laundryEvent === selectedPedido.id_laundryEvent
          ? {
            ...p,
            serviceStatus: "inProgressWash",
            WashDetail: {
              Machine: {
                model: selectedWashMachine.model,
                machineNumber: selectedWashMachine.machineNumber,
                machineType: selectedWashMachine.machineType,
                id_machine: selectedWashMachine.id_machine
              },
            },
          }
          : p
      );

      setPedidos(updatedPedidos);

      await api.patch(`/orders/${selectedPedido.fk_idServiceOrder}`, {
        orderStatus: "inProgress",
      });

      await api.patch(`/updateWashDetails/${selectedPedido.id_laundryEvent}`, {
        combinedWash: combinedWash,
        fk_idWashMachine: selectedWashMachine.id_machine,
        fk_idStaffMember: cookies.token,
      });
    } catch (error) {
      console.error("Error al confirmar la máquina:", error);
    }
  };

  const handleStartDryerProcess = async (pedido) => {
    try {
      setLoading(true);
      setShowDryerSelection(true);
      setIsDryingProcessConfirmedInModal(false);

      // Obtener datos de las secadoras
      const dryersResponse = await api.get("/machines", {
        params: { machineType: "secadora" },
      });

      const availableDryers = dryersResponse.data;

      setAvailableMachines(availableDryers);
      setSelectedDryMachine(null);
      setSelectedPedido(pedido);
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

      setShowDryerSelection(false); // Ocultar la selección de secadora
      setIsDryingProcessConfirmedInModal(true);
      showNotification(`Pedido Secado en ${selectedDryMachine.model}`);

      const [machinesResponse] = await Promise.all([api.get("/machines")]);
      const availableMachines = [...machinesResponse.data];
      const res = await api.get(
        `/laundryQueueById/${selectedPedido.id_laundryEvent}`
      );
      const selectedWashMachine = res.data.WashDetail;

      // Si hay una lavadora seleccionada, cambiar su estado a true
      if (selectedDryMachine.machineType === "secadora") {
        if (selectedWashMachine) {
          // Actualizar el estado del pedido a "inProgressDry"
          const updatedPedido = {
            ...selectedPedido,
            serviceStatus: "inProgressDry",
            DryDetail: {
              Machine: {
                model: selectedDryMachine.model,
                  machineNumber: selectedDryMachine.machineNumber,
                    machineType: selectedDryMachine.machineType,
                      id_machine: selectedDryMachine.id_machine
              },
            },
        };
        const updatedPedidos = pedidos.map((p) =>
          p.id_laundryEvent === selectedPedido.id_laundryEvent
            ? updatedPedido
            : p
        );
        setPedidos(updatedPedidos);

        const updatedWashers = availableMachines.map((machine) =>
          machine.id_machine === selectedWashMachine.fk_idWashMachine
            ? { ...machine, freeForUse: true }
            : machine
        );
        setAvailableMachines(updatedWashers);

        // También actualizar la base de datos
        // await api.patch(`/machines/${selectedWashMachine.fk_idWashMachine}`, {
        //   freeForUse: true,
        // });

        // await api.patch(
        //   `/finishLaundryQueue/${selectedPedido.id_laundryEvent}`,
        //   {
        //     fk_idDryMachine: selectedWashMachine.fk_idWashMachine,
        //     fk_idStaffMember: cookies.token,
        //   }
        // );
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
    // await api.patch(`/machines/${selectedDryMachine.id_machine}`, {
    //   freeForUse: false,
    // });

    !combinedDry ? localStorage.setItem("selectedCombinedDryMachine", JSON.stringify(selectedDryMachine)) : console.log("TOGETHER");

    await api.patch(`/updateDryDetails/${selectedPedido.id_laundryEvent}`, {
      combinedWash: await selectedPedido.combinedWash,
      combinedDry: combinedDry,
      fk_idWashMachine: await selectedPedido.WashDetail.Machine.id_machine,
      fk_idDryMachine: selectedDryMachine.id_machine,
      fk_idStaffMember: cookies.token,
    });
  } catch (error) {
    console.error("Error al confirmar la secadora:", error);
  }
};

const handleClothesLineDry = (pedido) => {
  try {
    Swal.fire('OCUPA TENDER LA ROPA', 'Estas prendas son tendidas a mano', 'info').then(async (results) => {
      if (results.isConfirmed) {
        console.log("SECADO A MANO")

        const [machinesResponse] = await Promise.all([api.get("/machines")]);
        const availableMachines = [...machinesResponse.data];
        const res = await api.get(
          `/laundryQueueById/${selectedPedido.id_laundryEvent}`
        );
        const selectedWashMachine = res.data.WashDetail;

        // Si hay una lavadora seleccionada, cambiar su estado a true
        if (selectedWashMachine) {
          // Actualizar el estado del pedido a "inProgressDry"
          const updatedPedido = {
            ...selectedPedido,
            serviceStatus: "inProgressDry",
          };
          const updatedPedidos = pedidos.map((p) =>
            p.id_laundryEvent === selectedPedido.id_laundryEvent
              ? {
                ...updatedPedido,
                DryDetail: {
                  Machine: {
                    model: "Dummy",
                    machineNumber: 0,
                  },
                },
                LaundryService: {
                  dryWeight: 0,
                  dryCycleTime: 0,
                }
              }
              : p
          );
          setPedidos(updatedPedidos);

          const updatedWashers = availableMachines.map((machine) =>
            machine.id_machine === selectedWashMachine.fk_idWashMachine
              ? { ...machine, freeForUse: true }
              : machine
          );
          setAvailableMachines(updatedWashers);

          // También actualizar la base de datos
          // await api.patch(`/machines/${selectedWashMachine.fk_idWashMachine}`, {
          //   freeForUse: true,
          // });
        }

        await api.patch(`/updateDryDetails/${pedido.id_laundryEvent}`, {
          combinedWash: pedido.combinedWash,
          combinedDry: combinedDry,
          fk_idWashMachine: await selectedPedido.WashDetail.Machine.id_machine,
          fk_idDryMachine: null,
          fk_idStaffMember: cookies.token,
        });
      }
    });
  } catch (err) {
    console.error(err);
  }
}

const handleFinishProcess = async (pedido) => {
  try {
    if (!pedido) {
      console.error("El pedido seleccionado es indefinido.");
      return;
    }

    setShowMachineName(false);

    let selectedDryMachine = 0;
    let availableMachines = "some";
    if (pedido.LaundryService.dryWeight != 0 && pedido.LaundryService.dryCycleTime != 0) {
      const [machinesResponse] = await Promise.all([api.get("/machines")]);
      availableMachines = [...machinesResponse.data];
      const res = await api.get(`/laundryQueueById/${pedido.id_laundryEvent}`);
      selectedDryMachine = res.data.DryDetail;
    }

    // Liberar la secadora seleccionada
    if (selectedDryMachine) {
      if (pedido.LaundryService.dryWeight != 0 || pedido.LaundryService.dryCycleTime != 0) {
        const updatedDryers = availableMachines.map((machine) =>
          machine.id_machine === selectedDryMachine.fk_idDryMachine
            ? { ...machine, freeForUse: true }
            : machine
        );
        setAvailableMachines(updatedDryers);
      }

      // También actualizar la base de datos
      const res = await api.patch(`/finishLaundryQueue/${pedido.id_laundryEvent}`, {
        combinedDry: pedido.combinedDry,
        fk_idDryMachine: selectedDryMachine != 0 ? selectedDryMachine.fk_idDryMachine : null,
        fk_idStaffMember: cookies.token,
      });

      // const resOrder = await api.get(`orderStatusById/${pedido.fk_idServiceOrder}`)

      // Actualizar el estado del pedido a "finish"
      const updatedPedido = { ...pedido, serviceStatus: "finished" };
      const updatedPedidos = pedidos.map((p) =>
        p.id_laundryEvent === pedido.id_laundryEvent ? updatedPedido : p
      );
      setPedidos(updatedPedidos);

      // if (pedido.LaundryService.dryWeight != 0 || pedido.LaundryService.dryCycleTime != 0) {
      //   await api.patch(`/machines/${selectedDryMachine.fk_idDryMachine}`, {
      //     freeForUse: true,
      //   });
      // }

      if (res.data.orderStatus === "finished") {
        showNotification(
          "Pedido finalizado correctamente, NOTIFICACIÓN ENVIADA..."
        );
        await api.post("/sendMessage", {
          id_order: pedido.fk_idServiceOrder,
          name:
            pedido.serviceOrder.client.name +
            " " +
            pedido.serviceOrder.client.firstLN +
            " " +
            pedido.serviceOrder.client.secondLN,
          email: pedido.serviceOrder.client.email,
          tel: "521" + pedido.serviceOrder.client.phone,
          message: `Tu pedido con el folio: ${pedido.fk_idServiceOrder} está listo, Ya puedes pasar a recogerlo.`,
          subject: "Tu Ropa esta Lista",
          text: `Tu ropa esta lista, esperamos que la recojas a su brevedad`,
          warning: false,
        });
        console.log("NOTIFICACIÓN ENVIADA...");
      } else {
        showNotification(`Tarea del Pedido finalizada correctamente`);
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const hideWashModal = async () => {
  setCombinedWash(false);
  setShowMachineName(false);
};

const hideDryerModal = async () => {
  setCombinedDry(false);
  setShowDryerSelection(false);
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
          className="text-Cerulean font-semibold text-base"
        >
          En Proceso de Lavado
        </option>
        <option
          value="inProgressDry"
          className="text-yellow-600 font-semibold text-base"
        >
          En Proceso de Secado
        </option>

      </select>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-200">
          <tr>
            <th>No. Pedido</th>
            <th>Recibió</th>
            <th>Cliente</th>
            <th>Detalles</th>
            <th>Fecha de Entrega</th>
            <th>Equipo</th>
            <th>Estatus</th>
            <th>Observaciones</th>
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
                  {pedido.serviceOrder.user.name} {pedido.serviceOrder.user.firstLN} {pedido.serviceOrder.user.secondLN}
                </td>

                <td className="py-3 px-6 font-medium text-gray-900">
                  {pedido.serviceOrder.client.name} {pedido.serviceOrder.client.firstLN} {pedido.serviceOrder.client.secondLN}
                </td>
                <td className="py-3 px-6">
                  {pedido.LaundryService.description}
                </td>

                <td className="py-3 px-6">
                  <p>{formatDate(pedido.serviceOrder.scheduledDeliveryDate)}</p>
                  <p>{formatTime(pedido.serviceOrder.scheduledDeliveryTime)}</p>
                </td>

                <td className="py-3 px-7 text-black">{pedido.serviceStatus === "inProgressWash" && pedido.WashDetail.Machine ?
                  <div className="flex"><GiWashingMachine className="text-blue-700" size={32} />
                    <div className="grid-flow-col">
                      <p className="font-semibold">No. Equipo: <span className="font-black text-blue-600">{pedido.WashDetail.Machine.machineNumber}</span></p>
                      <p className="font-semibold">Modelo: <span className="font-normal">{pedido.WashDetail.Machine.model}</span></p>
                    </div>
                  </div> :
                  pedido.serviceStatus === "inProgressDry" && (pedido.DryDetail.Machine && pedido.LaundryService.dryWeight != 0 && pedido.LaundryService.dryCycleTime != 0) ?
                    <div className="flex"><BiSolidDryer className="text-green-500" size={32} />
                      <div className="grid-flow-col">
                        <p className="font-semibold">No. Equipo: <span className="font-black text-green-600">{pedido.DryDetail.Machine.machineNumber}</span></p>
                        <p className="font-semibold">Modelo: <span className="font-normal">{pedido.DryDetail.Machine.model}</span></p>
                      </div>
                    </div> :
                    pedido.serviceStatus === "inProgressDry" && (pedido.LaundryService.dryWeight == 0 && pedido.LaundryService.dryCycleTime == 0) ?
                      <div className="flex"><GiClothesline className="text-red-500" size={32} />
                        <div className="grid-flow-col">
                          <p className="ml-2 font-semibold">Secado <span className="font-black text-red-600">Tendido</span></p>
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
                  ) : pedido.serviceStatus === "inProgressWash" ? (
                    <span className="text-Cerulean pl-1">
                      <ClockCircleOutlined /> En Proceso de Lavado
                    </span>
                  ) : pedido.serviceStatus === "inProgressDry" ? (
                    <span className="text-yellow-600 pl-1">
                      <ClockCircleOutlined /> En Proceso de Secado
                    </span>
                  ) : pedido.serviceStatus === "finished" ? (
                    <span className="text-blue-600 pl-1">
                      <IssuesCloseOutlined /> Finalizado no entregado
                    </span>
                  ) : pedido.serviceStatus === "delivered" ? (
                    <span className="text-green-600 pl-1">
                      <CheckCircleOutlined /> Finalizado Entregado
                    </span>
                  ) : pedido.serviceStatus === "cancelled" ? (
                    <span className="text-red-600 pl-1">
                      <StopOutlined /> Cancelado
                    </span>
                  ) : (
                    <span className="text-gray-600 pl-1">
                      Estado Desconocido
                    </span>
                  )}
                </td>
                <td>
                  {pedido.serviceOrder.notes
                    ? pedido.serviceOrder.notes
                    : "No hay notas"}
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

                  {pedido.serviceStatus === "inProgressWash" && pedido.LaundryService.dryWeight == 0 && pedido.LaundryService.dryCycleTime == 0 && (
                    <button
                      onClick={() => handleClothesLineDry(pedido)}
                      className="btn-dry ml-2 mt-1"
                    >
                      Secado
                    </button>
                  )}

                  {pedido.serviceStatus === "inProgressWash" && pedido.LaundryService.dryWeight != 0 && pedido.LaundryService.dryCycleTime != 0 && (
                    <button
                      onClick={() => handleStartDryerProcess(pedido)}
                      className="btn-dry ml-2 mt-1"
                    >
                      Secado
                    </button>
                  )}

                  {pedido.serviceStatus === "inProgressDry" && (
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
      onCancel={() => hideWashModal()}
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
          onClick={() => hideWashModal()}
        >
          Cancelar
        </button>,
      ]}
      width={1000}
      style={{
        body: {
          height: 400,
          overflow: "hidden",
          overflowY: "scroll",
        },
      }}
    >
      <div>
        <p className="mb-4 text-xl font-bold">Selecciona una lavadora:</p>
        <table className="w-full text-center">
          <thead className="bg-gray-200">
            <tr>
              <th>No. de Equipo</th>
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
                  <td className="font-bold text-blue-600">{machine.machineNumber}</td>
                  <td className="text-blue-600">{machine.machineType}</td>
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
                        onChange={() => handleSelectWashMachine(machine)}
                        className="mb-2"
                        disabled={!machine.freeForUse}
                      />
                      <span className="text-blue-500">Seleccionar</span>
                    </div>
                  </td>
                </tr>
              ))}
            {lastWashMachine.machineNumber != 0 ? <td colSpan={7}><p className="font-bold text-lg text-center">Es Lavadora Combinada ?</p></td> : <td colSpan={7}><p className="font-bold  text-lg text-center">No hay Lavadora Anterior</p></td>}
            {console.log("WASHMACHINE " + lastWashMachine)}
            {lastWashMachine.machineNumber != 0 ? (
              <tr key={lastWashMachine.id_machine}>
                <td className="font-bold text-blue-600">{lastWashMachine.machineNumber}</td>
                <td className="text-blue-600">{lastWashMachine.machineType}</td>
                <td>{lastWashMachine.model}</td>
                <td>{lastWashMachine.cicleTime}</td>
                <td>{lastWashMachine.weight}</td>
                <td
                  className={`${lastWashMachine.freeForUse ? "text-green-500" : "text-red-500"
                    }`}
                >
                  {lastWashMachine.freeForUse ? "Libre" : "Ocupado"}
                </td>

                <td>
                  <div className="flex flex-col items-center">
                    <Checkbox
                      key={`checkbox_${lastWashMachine.id_machine}`}
                      checked={selectedWashMachine === lastWashMachine}
                      onChange={() => handleSelectCombinedWashMachine(lastWashMachine)}
                      // disabled={!selectedWashMachine}
                      // disabled={combinedWash}
                      className="mb-2"
                    />
                    <span className="text-blue-500">Seleccionar</span>
                  </div>
                </td>
              </tr>
            ) : (
              ""
            )}
          </tbody>
        </table>
      </div>
    </Modal>

    <Modal
      open={showDryerSelection}
      onCancel={() => hideDryerModal()}
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
          onClick={() => hideDryerModal()}
        >
          Cancelar
        </button>,
      ]}
      width={1000}
      style={{
        body: {
          height: 400,
          overflow: "hidden",
          overflowY: "scroll",
        },
      }}
    >
      <div>
        <p className="mb-4 text-xl font-bold">Selecciona una secadora:</p>
        <table className="w-full text-center border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th>No. de Equipo</th>
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
                  <td className="font-bold text-green-500">{machine.machineNumber}</td>
                  <td className="text-green-500">{machine.machineType}</td>
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
            {lastDryMachine.machineNumber != 0 ? <td colSpan={7}><p className="font-bold text-lg text-center">Es Secadora Combinada ?</p></td> : <td colSpan={7}><p className="font-bold  text-lg text-center">No hay Secadora Anterior</p></td>}
            {console.log("DRYMACHINE " + lastDryMachine)}
            {lastDryMachine.machineNumber != 0 ? (
              <tr key={lastDryMachine.id_machine}>
                <td className="font-bold text-green-500">{lastDryMachine.machineNumber}</td>
                <td className="text-green-500">{lastDryMachine.machineType}</td>
                <td>{lastDryMachine.model}</td>
                <td>{lastDryMachine.cicleTime}</td>
                <td>{lastDryMachine.weight}</td>
                <td
                  className={`${lastDryMachine.freeForUse ? "text-green-500" : "text-red-500"
                    }`}
                >
                  {lastDryMachine.freeForUse ? "Libre" : "Ocupado"}
                </td>

                <td>
                  <div className="flex flex-col items-center">
                    <Checkbox
                      key={`checkbox_${lastDryMachine.id_machine}`}
                      checked={selectedDryMachine === lastDryMachine}
                      onChange={() => handleSelectCombinedDryMachine(lastDryMachine)}
                      // disabled={combinedDry}
                      className="mb-2"
                    />
                    <span className="text-blue-500">Seleccionar</span>
                  </div>
                </td>
              </tr>
            ) : (
              ""
            )}
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
