import React, { useState } from "react";
import { Link } from "react-router-dom";
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

  const { mutate } = useSWRConfig();
  const fetcher = async () => {
    const response = await Axios.get("http://localhost:5000/machines");
    return response.data;
  };

  const { data } = useSWR("machines", fetcher);
  if (!data) return <h2>Loading...</h2>;

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

  return (
    <div>
      <div className=" bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1">
        <strong>Equipos</strong>
      </div>
      <div className="w-full pt-4">
        <Link
          to="/addEquipo"
          className="bg-green-500 hover:bg-green-700 border border-slate-200 text-white font-bold py-2 px-4 rounded-lg pt-"
        >
          Añadir Nueva Máquina
        </Link>
        <div className="relative shadow rounded-lg mt-3">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th className="py-3 px-1 text-center">ID</th>
                <th className="py-3 px-6">Tipo de Máquina</th>
                <th className="py-3 px-6">Modelo</th>
                <th className="py-3 px-6">Tiempo de Ciclo</th>
                <th className="py-3 px-6">Peso</th>
                <th className="py-3 px-6">Estado</th>
                <th className="py-3 px-6">Notas</th>
                <th className="py-3 px-1 text-center">Opciones</th>
              </tr>
            </thead>
            <tbody>
              {data.map((machine, index) => (
                <tr className="bg-white border-b" key={machine.id_machine}>
                  <td className="py-3 px-1 text-center">{index + 1}</td>
                  <td className="py-3 px-6 font-medium text-gray-900">
                    {machine.machineType}
                  </td>
                  <td className="py-3 px-6 font-medium text-gray-900">
                    {machine.model}
                  </td>
                  
                  <td className="py-3 px-6">{machine.cicleTime}</td>
                  <td className="py-3 px-6">{machine.weight}</td>
                  <td className="py-3 px-6">{machine.status}</td>
                  <td className="py-3 px-6">{machine.notes}</td>

                  <td className="py-3 px-1 text-center">
                    
                    <Link
                      to={`/editEquipo/${machine.id_machine}`}
                      className="font-medium bg-blue-400 hover:bg-blue-500 px-3 py-1 rounded text-white mr-1"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() =>
                        handleClickOpen(machine.model, machine.id_machine)
                      }
                      className="font-medium bg-red-400 hover:bg-red-500 px-3 py-1 rounded text-white"
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
