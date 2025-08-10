import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useSWR, { useSWRConfig } from "swr";
import ReactPaginate from "react-paginate";
import { BsFillTrashFill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import { IoCard } from "react-icons/io5";
import { Modal } from "antd";
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

function ServicesTintoreria() {
  const [serviceSelDesc, setServiceSelDesc] = useState();
  const [serviceSelId, setServiceSelId] = useState();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);

  const [clothType, setClothType] = useState("");
  const [clothColor, setClothColor] = useState("");
  const [clothFinish, setClothFinish] = useState("");
  const [clothPrint, setClothPrint] = useState("");

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // Cantidad de elementos a mostrar por página
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const { mutate } = useSWRConfig();
  const fetcher = async () => {
    const response = await api.get("/servicesDryclean");
    return response.data;
  };

  const { data } = useSWR("servicesDryclean", fetcher);
  if (!data) return <h2>Loading...</h2>;



  const deleteService = async (serviceId) => {
    console.log(serviceId)
    await api.delete(`/servicesDryclean/${serviceId}`);
    mutate("servicesDryclean");
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
    if (p === 'm') {
      !localStorage.getItem('cashCutId')
        ? navigate(`/editServiceTintoreria/${service.id_service}`)
        : Swal.fire("No se puede modificar el servicio mientras la caja este abierta", "", "warning")
    } else {
      !localStorage.getItem('cashCutId')
        ? handleClickOpen(service.description, service.id_service)
        : Swal.fire("No se puede eliminar el servicio mientras la caja este abierta", "", "warning")
    }
  }

  const handleCloseDryCleanDetailModal = (e) => {
    e.preventDefault()
    setIsFinishModalOpen(false);
  }

  const handleSaveDryCleanDetail = async (e) => {
    e.preventDefault();
    let res
    try {
      if (clothType) {
        res = await api.post("/clothingTypes", {
          clothingDescription: clothType
        })
      } else if (clothColor) {
        res = await api.post("/clothingColors", {
          colorDescription: clothColor
        })
        console.log(res)
      } else if (clothPrint) {
        res = await api.post("/clothingPrints", {
          printDescription: clothPrint
        })
      } else if (clothFinish) {
        res = await api.post("/clothingFinishes", {
          finishDescription: clothFinish
        })
      } else {
        Swal.fire("Todos los campos estan vacios", "Rellene algún campo para poder guardar", "error")
        return
      }
      Swal.fire("Acabado guardado", "Rellene algún campo para poder guardar", "success")
      console.log(res.data)
      setIsFinishModalOpen(false)
    } catch (err) {
      console.error(err)
      if (err.status === 400) {
        Swal.fire("Ya existe", "Ingrese un elemento distinto", "warning")
        return
      }
    }
  }

  const handleOpenDryCleanModal = () => {
    setClothColor("")
    setClothFinish("")
    setClothPrint("")
    setClothType("")
    setIsFinishModalOpen(true)
  }

  return (
    <div>
      <div className="title-container">
        <strong className="title-strong">Servicios de Tintoreria</strong>
      </div>
      <div className="w-full pt-4">
        <div className="flex place-content-between mx-10">
          <button
            onClick={() => navigate("/addServiceTintoreria")}
            className="btn-primary"
          >
            Añadir Nuevo Servicio
            <br />
            de Tintoreria
          </button>

          <button
            onClick={() => handleOpenDryCleanModal(true)}
            className="btn-primary bg-"
          >
            Añadir Acabados
          </button>
        </div>
        <div className="shadow-container" style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>No. servicio</th>
                <th>Descripción</th>
                <th>Piezas</th>
                <th>Categoria</th>
                <th><div className="flex"><BsCashCoin size={25} className="text-green-700 mr-3" />Precio Efectivo</div></th>
                <th><div className="flex"><IoCard size={25} className="text-blue-700 mr-3" />Precio Tarjeta</div></th>
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
                  <tr key={service.id_service}>
                    <td>{service.id_service}</td>
                    <td>{service.description}</td>
                    <td>{service.pieces}</td>
                    <td>{service.Category.categoryDescription}</td>
                    <td className="text-cash">${service.price}</td>
                    <td className="text-card">${service.priceCredit}</td>
                    <td>
                      <button
                        onClick={() =>
                          checkIfCashCutIsOpen(service, 'm')
                        }
                        className="btn-edit"
                      >
                        <AiFillEdit />
                      </button>
                      <button
                        onClick={() =>
                          checkIfCashCutIsOpen(service, 'd')
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
      <Modal
        title={<p className="font-bold text-xl ">Añadiendo Nuevo Acabado</p>}
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isFinishModalOpen}
        width={800}
        className="add-modal"
        // // onOk={ () => handleDetallesClick()}
        onCancel={() => setIsFinishModalOpen(false)}
        footer={null}
      >
        <div className="grid ">
          <form className="mx-4">
            <label className="form-lbl" htmlFor="clothType">
              Tipo de Ropa:
            </label>
            <input
              className="form-input"
              type="text"
              id="clothType"
              onChange={(e) => setClothType(e.target.value)}
              value={clothType}
              disabled={clothColor || clothFinish || clothPrint}
            />

            <label className="form-lbl" htmlFor="clothColor">
              Colores de Ropa:
            </label>
            <input
              className="form-input"
              type="text"
              id="clothColor"
              onChange={(e) => setClothColor(e.target.value)}
              value={clothColor}
              disabled={clothType || clothFinish || clothPrint}
            />

            <label className="form-lbl" htmlFor="clothPrint">
              Estampado de Ropa:
            </label>
            <input
              className="form-input"
              type="text"
              id="clothPrint"
              onChange={(e) => setClothPrint(e.target.value)}
              value={clothPrint}
              disabled={clothType || clothFinish || clothColor}
            />

            <label className="form-lbl" htmlFor="clothFinish">
              Terminado de Ropa
            </label>
            <input
              className="form-input"
              type="text"
              id="clothFinish"
              onChange={(e) => setClothFinish(e.target.value)}
              value={clothFinish}
              disabled={clothType || clothPrint || clothColor}
            />

            <div className="float-right mt-6">
              <button
                className="pos_modal_button"
                type="submit"
                onClick={handleSaveDryCleanDetail}
                value="Submit"
              >
                Guardar Acabado
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleCloseDryCleanDetailModal}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default ServicesTintoreria;
