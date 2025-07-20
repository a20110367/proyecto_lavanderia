import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import useSWR, { useSWRConfig } from "swr";
import moment from "moment";
import IMAGES from "../../images/images";
import ReactPaginate from "react-paginate";
import { AiFillEdit } from "react-icons/ai";
import { HiOutlineSearch } from "react-icons/hi";
import { RiUserSearchFill } from "react-icons/ri";
import { FaExclamationCircle } from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";

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
  const [filtro, setFiltro] = useState("");
  const [filteredClients, setFilteredClients] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // Cantidad de elementos a mostrar por página
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const { mutate } = useSWRConfig();
  const { data: clients } = useSWR("clients", async () => {
    const response = await api.get("/clients");
    return response.data;
  });

  useEffect(() => {
    if (clients) {
      const filtered = clients.filter((client) => {
        const searchTerm = filtro.toLowerCase();
        const searchTermsArray = searchTerm.split(" ");

        const isMatch = searchTermsArray.every((term) =>
          [client.name, client.firstLN, client.secondLN]
            .join(" ")
            .toLowerCase()
            .includes(term)
        );
        return (
          isMatch ||
          client.email.toLowerCase().includes(searchTerm) ||
          client.phone.toLowerCase().includes(searchTerm)
        );
      });
      setFilteredClients(filtered);
      setCurrentPage(0);
    }
  }, [filtro, clients]);

  const shouldShowTable = filtro == "" || filteredClients.length > 0;


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

  return (
    <div>
      <div className="title-container">
        <strong className="title-strong">Lista de Clientes</strong>
      </div>
      <div className="flex w-full justify-between place-items-center">
        <button className="btn-primary h-1/2" onClick={() => navigate("/addClient")}>
          Añadir Nuevo Cliente
        </button>
        <div className="fc h-1/2">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Buscar..."
              className="input-search"
              value={filtro}
              onChange={(event) => setFiltro(event.target.value)}
            />
            <div className="absolute top-2.5 left-3 text-gray-400">
              <HiOutlineSearch fontSize={20} className="text-gray-400" />
            </div>
            <div className=" flex items-center">
              <AiOutlineInfoCircle className="text-yellow-500" size={24} />
              <span className="ml-1 text-black font-bold text-base">
                Busca por nombre, correo o teléfono
              </span>
            </div>
          </div>
        </div>
      </div>
      {shouldShowTable ? (
        <div className="w-full pt-2">
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
                {filteredClients
                  .filter((client) => client.id_client !== 1)
                  .slice(
                    currentPage * itemsPerPage,
                    (currentPage + 1) * itemsPerPage
                  )
                  .map((client, index) => (
                    <tr key={client.id_client}>
                      <td>{client.id_client}</td>
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
                        {/* <button
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
                      </Dialog> */}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {/* -----------------------------PAGINADOR -----------------------------*/}
          <div className="flex justify-center mt-4 mb-4">
            <ReactPaginate
              previousLabel={"Anterior"}
              nextLabel={"Siguiente"}
              breakLabel={"..."}
              pageCount={Math.ceil(filteredClients.length / itemsPerPage)}
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
      ) : (
        <div className="text-gray-500 text-center bg-white rounded-md mt-4 p-4 border border-blue-600">
          <div className="fcj">
            <FaExclamationCircle className="mr-2 text-2xl text-red-500" />{" "}
            <span className="title">No se encontraron coincidencias</span>
          </div>
        </div>
      )}
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
    </div>
  );
}

export default Clients;
