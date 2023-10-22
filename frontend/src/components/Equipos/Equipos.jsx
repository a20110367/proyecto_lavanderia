import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import useSWR, { useSWRConfig } from "swr";

// Dialogs
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

function Equipos() {
  const [machineSelModel, setMachineSelModel] = useState();
  const [machineSelId, setMachineSelId] = useState();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate()
  const [filtroTipo, setFiltroTipo] = useState("");

  const { mutate } = useSWRConfig();
  const fetcher = async () => {
    const response = await Axios.get("http://localhost:5000/machines");
    return response.data;
  };

  const { data } = useSWR("machines", fetcher);
  if (!data) return <h2>Loading...</h2>;

  const filteredMachines = filtroTipo
  ? data.filter((machine) => machine.machineType === filtroTipo)
  : data;

  
  const deleteMachine = async (machineId) => {
    await Axios.delete(`http://localhost:5000/machines/${machineId}`);
    mutate("machines");
  };

  const handleClickOpen = (machineModel, machineId) => {
    setMachineSelId(machineId);
    setMachineSelModel(machineModel);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteAndClose = (machineId) => {
    handleClose();
    deleteMachine(machineId);
  };

  const handleFiltroTipoChange = (event) => {
    setFiltroTipo(event.target.value);
  };

  return (
    <div>
      <div className="title-container">
        <strong className="title-strong">Equipos</strong>
      </div>
      <div className="w-full pt-4">
        <button className="btn-primary" onClick={() => navigate('/addEquipo')}>
          Añadir Nueva Maquina
        </button>
        <select
          className="ml-2 border-2 font-bold text-base rounded-md py-2 px-4 text-black focus:outline-none focus:ring focus:border-blue-300 border-black"
          value={filtroTipo}
          onChange={handleFiltroTipoChange}
        >
          <option className="text-base font-semibold" value="">
            Todos
          </option>
          <option value="lavadora" className="text-dodgerBlue font-semibold text-base">
            Lavadoras
          </option>
          <option value="secadora" className="text-green-500 font-semibold text-base">
            Secadoras
          </option>
          <option value="plancha" className="text-yellow-500 font-semibold text-base">
            Planchas
          </option>
        </select>
        <div className="shadow-container"  style={{ overflowX: 'auto' }}>
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
            {data
                .filter((machine) => !filtroTipo || machine.machineType === filtroTipo)
                .map((machine, index) => (
                <tr key={machine.id_machine}>
                  <td>{index + 1}</td>
                  <td className={`font-semibold ${
  machine.machineType === "lavadora"
    ? "text-dodgerBlue"
    : machine.machineType === "plancha"
    ? "text-yellow-500"
    : "text-green-500"
}`}>
  {machine.machineType === "lavadora"
    ? "Lavadora"
    : machine.machineType === "plancha"
    ? "Plancha"
    : "Secadora"
}
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
                    {machine.status === 'available' ? 'Disponible' : 'No Disponible'}
                  </td>
                  <td>{machine.notes}</td>
                  <td>
                    <button
                      onClick={() => navigate(`/editEquipo/${machine.id_machine}`)}
                      className="btn-edit"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleClickOpen(machine.model, machine.id_machine)}
                      className="btn-cancel"
                    >
                      Borrar
                    </button>

                    <Dialog
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle id="alert-dialog-title">
                        {"Eliminación de la máquina"}
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          ¿Deseas eliminar la máquina: {machineSelModel}?
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClose}>Cancelar</Button>
                        <Button
                          onClick={() => deleteAndClose(machineSelId)}
                          autoFocus
                        >
                          Eliminar
                        </Button>
                      </DialogActions>
                    </Dialog>
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

export default Equipos;
