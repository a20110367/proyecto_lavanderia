import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Axios from "axios";
import useSWR, { useSWRConfig } from "swr";

function ActivarEquipos() {
  const [machineSelModel, setMachineSelModel] = useState();
  const [machineSelId, setMachineSelId] = useState();
  const [open, setOpen] = useState(false);

  const fetcher = async () => {
    const response = await Axios.get("http://localhost:5000/machines");
    return response.data;
  };

  const { data } = useSWR("machines", fetcher);
  if (!data) return <h2>Loading...</h2>;


  const handleClickOpen = (machineModel, machineId) => {
    setMachineSelId(machineId);
    setMachineSelModel(machineModel);
    setOpen(true);
  };


  return (
    <div>
      <div className="title-container">
        <strong className="title-strong">Activar Equipos</strong>
      </div>
      <div className="w-full pt-4">
        <div className="shadow-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tipo de Máquina</th>
                <th>Modelo</th>
                <th>Tiempo de Ciclo</th>
                <th>Peso</th>
                <th>Estado</th>
                <th>Notas</th>
                <th>Opciones</th>
              </tr>
            </thead>
            <tbody>
              {data.map((machine, index) => (
                <tr key={machine.id_machine}>
                  <td>{index + 1}</td>
                  <td
                    className={`font-semibold ${
                      machine.machineType === "lavadora"
                        ? "text-dodgerBlue"
                        : "text-green-500"
                    }`}
                  >
                    {machine.machineType === "lavadora"
                      ? "Lavadora"
                      : "Secadora"}
                  </td>
                  <td>{machine.model}</td>
                  <td>{machine.cicleTime}</td>
                  <td>{machine.weight}</td>
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
                        className={`btn-edit ${
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
    </div>
  );
}

export default ActivarEquipos;
