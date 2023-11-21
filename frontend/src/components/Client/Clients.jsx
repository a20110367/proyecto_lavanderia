import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import useSWR, { useSWRConfig } from "swr";
import printJS from "print-js";
import moment from "moment";
import IMAGES from "../../images/images";
import ReactPaginate from "react-paginate";
import { BsFillTrashFill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";

// Dialogs
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

function Clients() {
  const [clientSelName, setClientSelName] = useState();
  const [clientSelId, setClientSelId] = useState();
  const [word, setWord] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const date = moment().format("DD / MM / YYYY");
  const hour = moment().format("LT");
  const [paid, setPaid] = useState(true);
  1;

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // Cantidad de elementos a mostrar por página
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const { mutate } = useSWRConfig();
  const fetcher = async () => {
    const response = await api.get("/clients");
    return response.data;
  };

  const { data } = useSWR("clients", fetcher);
  if (!data) return <h2>Loading...</h2>;

  const deleteClient = async (clientId) => {
    await api.delete(`/clients/${clientId}`);
    mutate("clients");
  };

  const handleClickOpen = (clientName, clientId) => {
    setClientSelId(clientId);
    setClientSelName(clientName);
    console.log(clientId);
    console.log(clientName);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteAndClose = (clientId) => {
    handleClose();
    deleteClient(clientId);
  };

  // Si fue a la entrega se genera ticket y se queda en blanco la forma de pago
  /* si es a la entrega se genera un comprobante de pago(otro ticket distinto) 
  folio folio, fecha */

  const html = `
        <form class="form-container" id="container" style="font-size:small">
            <div class="PrintOnly">
                <div class="info" style="text-align: center;"> 
                    <img src="${
                      IMAGES.caprelogo
                    }" width="150" height="100" alt="logo" class="logo">
                    <p>**CAPREL**</p>
                    <p>VISTA A LA CAMPIÑA #3215, COL. MIRADOR DEL TESORO</p>
                    <p>TLAQUEPAQUE, JALISCO</p>
                    <p>TEL. (33) 30001789</p>
                    <p>RFC: RORS010912QZ6</p>
                </div>
                <hr class="hr-header">
                <div style=" padding-top: 0px">                    
                    <h2>FOLIO No.: 87668</h2>
                    <h2>TIPO PAGO: ANTICIPADO</h2>                     
                    ${
                      paid ? "<h2>PAGADO</h2>" : "<h2>NO PAGADO</h2>"
                    }                    
                    <hr class="hr-header">  
                    <div class="grid" style="display: grid; grid-template-columns: auto auto auto; padding: 10px;">    
                        <p>Color</p>
                        <p>Estampado</p>
                        <p>Fibra</p>
                        <p>Cant.</p>
                        <p>Producto</p>
                        <p>Precio</p>           
                        <p>1</p>
                        <p>EDREDON MATRIMONIAL</p>
                        <p>95.00</p>
                    </div>
                    <hr class="hr-header">       
                    <h4 style="text-align:center;">Total Pagado: $95.00</h4>
                    <!--*<p style="text-align:center;">NOVENTA Y CINCO Pesos 00/100 M.N.)</p>-->
                    <p style="text-align:center;">${word}</p>            
                        <p>F. PAGO: EFECTIVO</p>
                        <p>Pago recibido: $100.00</p>
                        <p>Cambio devuelto: $5.00</p> 
                        <p>Cajero: YADIRA</p> 
                    <hr class="hr-header">   
                        <p>Cliente: biagai</p>         
                        <p>F. Recepción: 20/07/2023 JUEVES 09:35 PM</p>
                        <h4>F. Entrega: 22/07/2023 SABADO 12:00 PM</h4>        
                        <hr class="hr-header">
                    <p>Observaciones Generales: </p>
                    <hr class="hr-header">
                    <div style="text-align:center;">
                        <p>PROFECO N. REGISTRO: 4390/2013</p>
                        <p>N. EXPEDIENTE: PFC.B.E. 7/005243/20013</p>
                        <p>FECHA: ${date}</p>
                        <p>HORA: ${hour}</p>                    
                        <p>GRACIAS POR SU VISITA</p>
                    </div>
                </div>
            </div>
        </form>
    `;

  return (
    <div>
      <div className="title-container">
        <strong className="title-strong">Lista de Clientes</strong>
      </div>
      <div className="w-full pt-4">
        <button className="btn-primary" onClick={() => navigate("/addClient")}>
          Añadir Nuevo Cliente
        </button>
        <div
          className="shadow-container"
          style={{ overflowX: "auto", maxWidth: "100%" }}
          id="client-table"
        >
          <table>
            <thead>
              <tr>
                <th>No. Cliente</th>
                <th>Nombre del cliente</th>
                <th>Apellido Paterno</th>
                <th>Apellido Materno</th>
                <th>Email</th>
                <th>Telefono</th>
                <th>Opciones</th>
              </tr>
            </thead>
            <tbody>
              {data
                .filter((client) => client.id_client !== 1)
                .slice(
                  currentPage * itemsPerPage,
                  (currentPage + 1) * itemsPerPage
                )
                .map((client, index) => (
                  <tr key={client.id_client}>
                    <td>{index + 1}</td>
                    <td>{client.name}</td>
                    <td>{client.firstLN}</td>
                    <td>{client.secondLN}</td>
                    <td>{client.email}</td>
                    <td>{client.phone}</td>
                    <td>
                      <button
                        onClick={() =>
                          navigate(`/editClient/${client.id_client}`)
                        }
                        className="btn-edit"
                      >
                        <AiFillEdit />
                      </button>
                      <button
                        onClick={() =>
                          handleClickOpen(client.name, client.id_client)
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
                          {"Eliminación del cliente"}
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText id="alert-dialog-description">
                            <p>
                              Se desea eliminar al Empleado:{" "}
                              <p className="text-dodgerBlue">{clientSelName}</p>
                            </p>
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleClose}>Cancelar</Button>
                          <Button
                            onClick={() => deleteAndClose(clientSelId)}
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
      {/* <button
        className="btn-cancel"
        type="button"
        onClick={() =>
          printJS({
            printable: data,
            type: "json",
            properties: [
              "id_client",
              "name",
              "username",
              "firstLN",
              "secondLN",
              "email",
              "phone",
              "pass",
            ],
            header: "PrintJS - Form Element Selection",
          })
        }
      >
        Print Data JSON
      </button>
      <button
        className="btn-cancel"
        type="button"
        onClick={() =>
          printJS({
            printable: "client-table",
            type: "html",
            header: "PrintJS - Form Element Selection",
          })
        }
      >
        Print Data ID HTML
      </button>*/}
      {/* -----------------------------PAGINADOR -----------------------------*/}
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

export default Clients;
