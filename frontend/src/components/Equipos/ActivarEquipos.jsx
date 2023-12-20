import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useSWR from "swr";
import ReactPaginate from "react-paginate";
import api from "../../api/api";

function ActivarEquipos() {
  const [machineSelModel, setMachineSelModel] = useState();
  const [machineSelId, setMachineSelId] = useState();
  const [open, setOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // Cantidad de elementos a mostrar por página
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };
  const [allEquipment, setAllEquipment] = useState([]);

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
    setAllEquipment(allData);
    return allData;
  };
  const { data } = useSWR("turnOnMachines", fetcher);
  if (!data) return <h2>Loading...</h2>;

  const handleClickOpen = (machineModel, machineId) => {
    setMachineSelId(machineId);
    setMachineSelModel(machineModel);
    setOpen(true);
  };

  const availableMachines = data.filter(
    (machine) => machine.status === "available"
  );

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
                      className={`font-semibold ${
                        machine.machineType === "lavadora"
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
                      className={`${
                        machine.status === "available"
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
                      <Link
                        to={`/pedidosGeneral?machineId=${machine.id_machine}&machineModel=${machine.model}`}
                      >
                        <button
                          onClick={() =>
                            handleClickOpen(machine.model, machine.id_machine)
                          }
                          className={`btn-primary mt-1 mb-1 ${
                            machine.status === "available" ? "" : "btn-disabled"
                          }`}
                          disabled={machine.status !== "available"}
                        >
                          Activar Equipo
                        </button>
                      </Link>
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
