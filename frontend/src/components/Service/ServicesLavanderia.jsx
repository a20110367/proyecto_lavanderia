import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useSWR, { useSWRConfig } from "swr";
import ReactPaginate from "react-paginate";
import { BsFillTrashFill } from "react-icons/bs"
import { AiFillEdit } from "react-icons/ai"
import { IoCard } from "react-icons/io5";
import { BsCashCoin } from "react-icons/bs";
import Swal from "sweetalert2";
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

  const filteredData = data;

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

  const checkIfCashCutIsOpen = (service, p) => {
    if(p === 'm'){
      !localStorage.getItem('cashCutId') 
      ? navigate(`/editServiceLavanderia/${service.id_service}`)
      : Swal.fire("No se puede modificar el servicio mientras la caja este abierta", "", "warning")
    }else{
      !localStorage.getItem('cashCutId') 
      ? handleClickOpen( service.description, service.id_service)
      : Swal.fire("No se puede eliminar el servicio mientras la caja este abierta", "", "warning")
    }
  }

  return (
    <div>
      <div className="title-container">
        <strong className="title-strong">Servicios de  Encargo Ropa</strong>
      </div>
      <div className="w-full pt-4">
        <button
          onClick={() => navigate("/addServiceLavanderia")}
          className="btn-primary"
        >
          Añadir Nuevo Servicio
          <br />
          de Encargo ropa
        </button>
        <div className="shadow-container" style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
              <th>No. servicio</th> 
                <th>Descripción</th>
                <th>Categoria</th>
                <th><div className="flex"><BsCashCoin size={25} className="text-green-700 mr-3"/>Precio Efectivo</div></th>
                <th><div className="flex"><IoCard size={25} className="text-blue-700 mr-3"/>Precio Tarjeta</div></th>
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
                    <td>{service.id_service}</td>
                    <td>{service.description}</td>
                    <td>{service.Category.categoryDescription}</td>
                    <td className="text-cash">${service.price}</td>
                    <td className="text-card">${service.priceCredit}</td>
                    <td>
                      <button
                        onClick={() =>
                          checkIfCashCutIsOpen(service, 'm')
                        }
                        className=" btn-edit"
                      >
                        <AiFillEdit/>
                      </button>
                      <button
                        onClick={() =>
                          checkIfCashCutIsOpen(service, 'd')
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
