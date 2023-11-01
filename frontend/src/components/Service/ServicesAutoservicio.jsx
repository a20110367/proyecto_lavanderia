import { useState } from "react";
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

function ServicesAutoservicio() {
  const [serviceSelDesc, setServiceSelDesc] = useState();
  const [serviceSelId, setServiceSelId] = useState();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5; // Cantidad de elementos a mostrar por página
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const { mutate } = useSWRConfig();
  const fetcher = async () => {
    const response = await Axios.get("http://localhost:5000/services");
    return response.data;
  };

  const { data } = useSWR("services", fetcher);
  if (!data) return <h2>Loading...</h2>;

  const filteredData = data.filter((service) => {
    const description = service.description.toLowerCase();
    return description.includes("autoservicio");
  });

  const deleteService = async (serviceId) => {
    await Axios.delete(`http://localhost:5000/services/${serviceId}`);
    mutate("services");
  };

  const handleClickOpen = (serviceDesc, serviceId) => {
    setServiceSelId(serviceId);
    setServiceSelDesc(serviceDesc);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteAndClose = (serviceId) => {
    handleClose();
    deleteService(serviceId);
  };

  return (
    <div>
      <div className="title-container">
        <strong className="title-strong">Servicios De Autoservicio</strong>
      </div>
      <div className="w-full pt-4">
        <button
          onClick={() => navigate("/addServiceAutoServicio")}
          className="btn-primary"
        >
          Añadir Nuevo Servicio
          <br />
          de Autoservicio
        </button>
        <div className="shadow-container" style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
              <th>No. servicio</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Tiempo</th>
                <th>Peso</th>
                <th>Piezas</th>
                <th>Fecha de Creación</th>
                <th>Fecha de Actualización</th>
                <th>Opciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredData
                .slice(
                  currentPage * itemsPerPage,
                  (currentPage + 1) * itemsPerPage
                )
                .map((service, index) => (
                  <tr key={service.id_service}>
                    <td>{index + 1}</td>
                    <td>{service.description}</td>
                    <td>${service.price}</td>
                    <td>{service.time} minutos</td>
                    <td>
                      {service.weight} {service.weight ? "kg" : ""}
                    </td>
                    <td>
                      {service.pieces} {service.pieces ? "pz" : ""}
                    </td>
                    <td>{service.created}</td>
                    <td>{service.updatedAT}</td>
                    <td>
                      <button
                        onClick={() =>
                          navigate(
                            `/editServiceAutoservicio/${service.id_service}`
                          )
                        }
                        className="btn-edit btn-edit"
                      >
                        <AiFillEdit/>
                      </button>
                      <button
                        onClick={() =>
                          handleClickOpen(
                            service.description,
                            service.id_service
                          )
                        }
                        className="btn-cancel"
                      >
                        <BsFillTrashFill/>
                      </button>
                      <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                      >
                        <DialogTitle id="alert-dialog-title">
                          {"Eliminar el servicio"}
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText id="alert-dialog-description">
                            ¿Deseas eliminar el servicio: {serviceSelDesc}?
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleClose}>Cancelar</Button>
                          <Button
                            onClick={() => deleteAndClose(serviceSelId)}
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
          pageCount={Math.ceil(filteredData.length / itemsPerPage)}
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

export default ServicesAutoservicio;
