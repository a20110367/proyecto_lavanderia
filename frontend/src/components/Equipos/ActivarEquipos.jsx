import React, { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
import useSWR from "swr";
import ReactPaginate from "react-paginate";
import api from "../../api/api";

function ActivarEquipos() {
  const [availableMachines, setAvailableMachines] = useState([]);
  const [machineSelModel, setMachineSelModel] = useState();
  const [machineSelId, setMachineSelId] = useState();
  const [open, setOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // Cantidad de elementos a mostrar por página
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const fetcher = async () => {
    const machinesResponse = await api.get("/machines");
    const ironsResponse = await api.get("/ironStations");
    const machinesData = machinesResponse.data.map((machine) => ({
      ...machine,
      type: "machine", // Agregar un campo 'type' para diferenciar las máquinas
    }));
    const ironsData = ironsResponse.data.map((iron) => ({
      ...iron,
      type: "iron", // Agregar un campo 'type' para diferenciar las planchas
    }));
    const allData = [...machinesData, ...ironsData];
    const available = (allData.filter((machine) => machine.status === 'available'))
    return available;
  };

  const { data } = useSWR("activeMachines", fetcher);

  useEffect(() => {
    if (data) {
      setAvailableMachines(data)
    }
  }, [data]);
  if (!data) return <h2>Loading...</h2>;

  const handleClickOpen = (machineModel, machineId) => {
    setMachineSelId(machineId);
    setMachineSelModel(machineModel);
    setOpen(true);
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
        const res = await api.post(
          `http://${ip}/relay/0?turn=on&timer=${time * 60}`
        );
        const available = availableMachines.map((mach) =>
          mach.id_machine === machine.id_machine
            ? { ...mach, freeForUse: false }
            : mach
        );
        setAvailableMachines(available);
        console.log(res);
        await api.patch(`/machines/${machine.id_machine}`, {
          freeForUse: false
        });
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
        const res = await api.post(`http://${ip}/relay/0?turn=off`);
        const available = availableMachines.map((mach) =>
          mach.id_machine === machine.id_machine
            ? { ...mach, freeForUse: true }
            : mach
        );
        setAvailableMachines(available);
        console.log(res);
        await api.patch(`/machines/${machine.id_machine}`, {
          freeForUse: true
        });
      } catch (err) {
        console.warn("El equipo Shelly esta desconectado");
      }
    }
  };

  return (
    <div>
      <div className="title-container">
        <strong className="title-strong">Activar Equipos</strong>
      </div>
      <div className="w-full pt-4">
        <div className="shadow-container" style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>No. Equipo</th>
                <th>Tipo de Máquina</th>
                <th>Modelo</th>
                <th>Tiempo de Ciclo</th>
                <th>Peso / Piezas</th>
                <th>Estado</th>
                <th>Notas</th>
                <th>Dirección IP</th>
                <th>Opciones</th>
              </tr>
            </thead>
            <tbody>
              {availableMachines
                .slice(
                  currentPage * itemsPerPage,
                  (currentPage + 1) * itemsPerPage
                )
                .map((machine, index) => (
                  <tr
                    key={
                      machine.machineType === "lavadora" ||
                        machine.machineType === "secadora"
                        ? machine.id_machine + "-" + machine.machineType
                        : machine.id_ironStation + "-" + machine.machineType
                    }
                  >
                    <td>{index + 1}</td>
                    <td
                      className={`font-semibold ${machine.machineType === "lavadora"
                        ? "text-dodgerBlue"
                        : "text-green-500"
                        }`}
                    >
                      {machine.machineType === "lavadora" ? (
                        "Lavadora"
                      ) : machine.machineType === "plancha" ? (
                        <span className="text-yellow-500">Plancha</span>
                      ) : (
                        "Secadora"
                      )}
                    </td>
                    <td>
                      {machine.machineType === "plancha"
                        ? machine.description
                        : machine.machineType === "lavadora"
                          ? machine.model
                          : machine.machineType === "secadora"
                            ? machine.model
                            : ""}
                    </td>
                    <td>{machine.cicleTime}</td>
                    <td>
                      {" "}
                      {
                        machine.machineType === "plancha"
                          ? machine.pieces
                          : machine.weight
                      }
                    </td>
                    <td
                      className={`${machine.status === "available"
                        ? "text-green-500"
                        : "text-red-500"
                        }`}
                    >
                      {machine.status === "available"
                        ? "Disponible"
                        : "No Disponible"}
                    </td>
                    <td>{machine.notes}</td>
                    <td>
                      {machine.ipAddress ? machine.ipAddress : '-'}
                    </td>
                    <td>
                      {/* <Link
                        to={`/pedidosGeneral?machineId=${machine.id_machine}&machineModel=${machine.model}`}
                      > */}
                      {(machine.freeForUse && machine.ipAddress) ? (
                        <button
                          onClick={() =>
                            turnOnMachine(machine)
                          }
                          className={`${machine.status === "available" ? "btn-primary mt-1 mb-1" : "btn-disabled"}`}
                          disabled={machine.status === "unavailable"}
                        >
                          Activar Equipo
                        </button>
                      ) : (!machine.freeForUse && machine.ipAddress) ? (
                        <button
                          onClick={() =>
                            turnOffMachine(machine)
                          }
                          className={`${machine.status === "unavailable" ? "btn-primary mt-1 mb-1" : "btn-disabled"}`}
                          disabled={machine.status === "unavailable"}
                        >
                          Desactivar Equipo
                        </button>
                      ) : (
                        <button
                          className={`${machine.status === "unavailable" ? "btn-primary mt-1 mb-1" : "btn-disabled"}`}
                          disabled
                        >
                          No tiene
                        </button>
                      )
                      }
                      {/* </Link> */}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-center mt-4 mb-4">
        <ReactPaginate
          previousLabel={"Anterior"}
          nextLabel={"Siguiente"}
          breakLabel={"..."}
          pageCount={Math.ceil(availableMachines.length / itemsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={2}
          onPageChange={handlePageChange}
          containerClassName={"pagination flex"}
          pageLinkClassName="pageLinkClassName"
          previousLinkClassName="prevOrNextLinkClassName"
          nextLinkClassName="prevOrNextLinkClassName"
          breakLinkClassName="breakLinkClassName"
          activeLinkClassName="activeLinkClassName"
        />
      </div>
    </div>
  );
}

export default ActivarEquipos;
