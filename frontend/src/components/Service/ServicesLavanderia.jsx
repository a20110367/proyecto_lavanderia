import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useSWR, { useSWRConfig } from "swr";
import ReactPaginate from "react-paginate";
import { BsFillTrashFill } from "react-icons/bs"
import { AiFillEdit } from "react-icons/ai"
import api from '../../api/api'

// Dialogs
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

function ServicesLavanderia() {
  const [serviceSelDesc, setServiceSelDesc] = useState();
  const [serviceSelId, setServiceSelId] = useState();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // Cantidad de elementos a mostrar por página
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const { mutate } = useSWRConfig();
  const fetcher = async () => {
    const response = await api.get("/servicesLaundry");
    return response.data;
  };

  const { data } = useSWR("servicesLaundry", fetcher);
  if (!data) return <h2>Loading...</h2>;

  // Filtrar servicios relacionados con lavandería
  const filteredData = data.filter((service) => {
    const description = service.description.toLowerCase();
    const exclusionKeywords = [
      "autoservicio",
      "auto servicio",
      "autoservicios",
      "auto servicios",
    ];
    const excludeService = exclusionKeywords.some((keyword) =>
      new RegExp(keyword, "i").test(description)
    );
    return (
      (description.includes("lavado") ||
        description.includes("lavados") ||
        description.includes("lavanderia")) &&
      !excludeService
    );
  });

  const deleteService = async (serviceId) => {
    await api.delete(`/servicesLaundry/${serviceId}`);
    mutate("servicesLaundry");
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
        <strong className="title-strong">Servicios de Encargo</strong>
      </div>
      <div className="w-full pt-4">
        <button
          onClick={() => navigate("/addServiceLavanderia")}
          className="btn-primary"
        >
          Añadir Nuevo Servicio
          <br />
          de Encargo
        </button>
        <div className="shadow-container" style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
              <th>No. servicio</th> 
                <th>Descripción</th>
                <th>Categoria</th>
                <th>Precio</th>
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
                    <td>{service.Category.categoryDescription}</td>
                    <td>${service.price}</td>
                    <td>
                      <button
                        onClick={() =>
                          navigate(
                            `/editServiceLavanderia/${service.id_service}`
                          )
                        }
                        className=" btn-edit"
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

export default ServicesLavanderia;
