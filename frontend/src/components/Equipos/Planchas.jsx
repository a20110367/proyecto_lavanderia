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

function Planchas() {
  const [ironSelId, setIronSelId] = useState();
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
    const response = await Axios.get("http://localhost:5000/ironStations");
    return response.data;
  };

  const { data } = useSWR("ironStations", fetcher);
  if (!data) return <h2>Loading...</h2>;


  const deleteIron = async (id_ironStation) => {
    await Axios.delete(`http://localhost:5000/ironStations/${id_ironStation}`);
    mutate("ironStations");
  };

  const handleClickOpen = (id_ironStation) => {
    setIronSelId(id_ironStation);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteAndClose = (id_ironStation) => {
    handleClose();
    deleteIron(id_ironStation);
  };

  const handleFiltroTipoChange = (event) => {
    setFiltroTipo(event.target.value);
  };

  return (
    <div>
      <div className="title-container">
        <strong className="title-strong">Planchas</strong>
      </div>
      <div className="w-full pt-4">
         <div className="flex justify-between items-center w-full pt-4">
          <button className="btn-primary" onClick={() => navigate("/addPlancha")}>
            Añadir Nueva Plancha
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
                <th>Piezas</th>
                <th>Estado</th>
                <th>Notas</th>
                <th>Opciones</th>
              </tr>
            </thead>
            <tbody>
              {data
                .slice(
                  currentPage * itemsPerPage,
                  (currentPage + 1) * itemsPerPage
                )
                .map((iron, index) => (
                  <tr key={iron.id_ironStation}> 
                    <td>{index + 1}</td>
                    <td
                      className={`font-semibold ${iron.machineType === "lavadora"
                          ? "text-dodgerBlue"
                          : iron.machineType === "plancha"
                            ? "text-yellow-500"
                            : "text-green-500"
                        }`}
                    >
                      {iron.machineType === "lavadora"
                        ? "Lavadora"
                        : iron.machineType === "plancha"
                          ? "Plancha"
                          : "Secadora"}
                    </td>
                    <td>{iron.pieces}</td>
                    <td
                      className={`${iron.status === "available"
                          ? "text-green-500"
                          : "text-red-500"
                        }`}
                    >
                      {iron.status === "available"
                        ? "Disponible"
                        : "No Disponible"}
                    </td>
                    <td>{iron.notes}</td>
                    <td>
                      <button
                        onClick={() =>
                          navigate(`/editPlancha/${iron.id_ironStation}`)
                        }
                        className="btn-edit"
                      >
                        <AiFillEdit />
                      </button>
                      <button
                        onClick={() =>
                          handleClickOpen(iron.id_ironStation)
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
                            ¿Deseas eliminar la máquina: {ironSelId}?
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleClose}>Cancelar</Button>
                          <Button
                            onClick={() => deleteAndClose(ironSelId)}
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
          pageCount={Math.ceil(data.length / itemsPerPage)}
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

export default Planchas;
