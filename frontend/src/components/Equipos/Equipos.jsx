import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import useSWR, { useSWRConfig } from "swr";
import ReactPaginate from "react-paginate";
import { BsFillTrashFill } from "react-icons/bs"
import { AiFillEdit } from "react-icons/ai"

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
  const navigate = useNavigate();
  const [filtroTipo, setFiltroTipo] = useState("");

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5; // Cantidad de elementos a mostrar por página
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

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
         <div className="flex justify-between items-center w-full pt-4">
          <button className="btn-primary" onClick={() => navigate("/addEquipo")}>
            Añadir Nueva Maquina
          </button>
          <select
            className="select-category"
            value={filtroTipo}
            onChange={handleFiltroTipoChange}
          >
            <option className="text-base font-semibold" value="">
              Todos
            </option>
            <option
              value="lavadora"
              className="text-dodgerBlue font-semibold text-base"
            >
              Lavadoras
            </option>
            <option
              value="secadora"
              className="text-green-500 font-semibold text-base"
            >
              Secadoras
            </option>
            <option
              value="plancha"
              className="text-yellow-500 font-semibold text-base"
            >
              Planchas
            </option>
          </select>
        </div>
        <div className="shadow-container" style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>No. Equipo</th>
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
                .filter(
                  (machine) => !filtroTipo || machine.machineType === filtroTipo
                )
                .slice(
                  currentPage * itemsPerPage,
                  (currentPage + 1) * itemsPerPage
                )
                .map((machine, index) => (
                  <tr key={machine.id_machine}>
                    <td>{index + 1}</td>
                    <td
                      className={`font-semibold ${machine.machineType === "lavadora"
                          ? "text-dodgerBlue"
                          : machine.machineType === "plancha"
                            ? "text-yellow-500"
                            : "text-green-500"
                        }`}
                    >
                      {machine.machineType === "lavadora"
                        ? "Lavadora"
                        : machine.machineType === "plancha"
                          ? "Plancha"
                          : "Secadora"}
                    </td>

                    <td>{machine.model}</td>
                    <td>{machine.cicleTime}</td>
                    <td>{machine.weight}</td>
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
                      <button
                        onClick={() =>
                          navigate(`/editEquipo/${machine.id_machine}`)
                        }
                        className="btn-edit"
                      >
                        <AiFillEdit />
                      </button>
                      <button
                        onClick={() =>
                          handleClickOpen(machine.model, machine.id_machine)
                        }
                        className="btn-cancel"
                      >
                        <BsFillTrashFill />
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
      <div className="flex justify-center mt-4 mb-4">
        <ReactPaginate
          previousLabel={"Anterior"}
          nextLabel={"Siguiente"}
          breakLabel={"..."}
          pageCount={Math.ceil(
            data.filter(
              (machine) => !filtroTipo || machine.machineType === filtroTipo
            ).length / itemsPerPage
          )}
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

export default Equipos;
