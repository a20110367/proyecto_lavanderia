import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useSWR, { useSWRConfig } from "swr";
import ReactPaginate from "react-paginate";
import { BsFillTrashFill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import api from "../../api/api";

// Dialogs
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

function Productos() {
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
    const response = await api.get("/supplies");
    return response.data;
  };

  const { data } = useSWR("supplies", fetcher);
  if (!data) return <h2>Loading...</h2>;

 

  const deleteService = async (serviceId) => {
    await api.delete(`/supplies/${serviceId}`);
    mutate("supplies");
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
        <strong className="title-strong">Productos</strong>
      </div>
      <div className="w-full pt-4">
        <button
          onClick={() => navigate("/addProductos")}
          className="btn-primary"
        >
          Añadir Nuevo <br /> Producto
        </button>
        <div className="shadow-container" style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>ID Producto</th>
                <th>Descripción</th>
                <th>Categoria</th>
                <th>Medida</th>
                <th>Unidades</th>
                <th>Precio</th>
                <th>Opciones</th>
              </tr>
            </thead>
            <tbody>
              {data
                .slice(
                  currentPage * itemsPerPage,
                  (currentPage + 1) * itemsPerPage
                )
                .map((service, index) => (
                  <tr key={service.id_supply}>
                    <td>{index + 1}</td>
                    <td>{service.description}</td>
                    <td>{service.category}</td>
                    <td>{service.unit}</td>
                    <td>{service.value}</td>
                    <td>${service.price}</td>
                    <td>
                      <button
                        onClick={() =>
                          navigate(
                            `/editProductos/${service.id_supply}`
                          )
                        }
                        className=" btn-edit"
                      >
                        <AiFillEdit />
                      </button>
                      <button
                        onClick={() =>
                          handleClickOpen(
                            service.description,
                            service.id_supply
                          )
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

export default Productos;
