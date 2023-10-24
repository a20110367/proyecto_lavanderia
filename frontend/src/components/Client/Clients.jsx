import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import useSWR, { useSWRConfig } from "swr";
import printJS from 'print-js'
import IMAGES from "../../images/images";

// Dialogs
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function Clients() {
    const [clientSelName, setClientSelName] = useState();
    const [clientSelId, setClientSelId] = useState();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate()
    const [a, setA] = useState('Me gusta la letra A');

    const { mutate } = useSWRConfig();
    const fetcher = async () => {
        const response = await Axios.get("http://localhost:5000/clients");
        return response.data;
    };

    const { data } = useSWR("clients", fetcher);
    if (!data) return <h2>Loading...</h2>;

    const deleteClient = async (clientId) => {
        await Axios.delete(`http://localhost:5000/clients/${clientId}`);
        mutate("clients");
    };

    const handleClickOpen = (clientName, clientId) => {
        setClientSelId(clientId)
        setClientSelName(clientName)
        console.log(clientId)
        console.log(clientName)
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteAndClose = (clientId) => {
        handleClose()
        deleteClient(clientId)
    }

    const html = `

<form class="form-container" id="container">
  <div class="PrintOnly">
    <div style="display: flex; align-items: center;" id="mainHeaders"> 
      <img src="${IMAGES.pdfIcon}" width="150" height="150" alt="logo" class="logo">  
      <hr class="hr-hor">
      <h2 class="main-color" style="margin-top: 20px;">  information  </h2> 
    </div>
    <hr class="hr-header">
    <div>
      <div style="display: flex; align-items: center; padding-top: 0px">
        <p class="main-color">  ID:</p> 
        <p class="secondary-color" style="margin-left: 8px">${a}</p>
        <p class="main-color" style="margin-left: 61px">Date of birth:</p> 
        <p class="secondary-color" style="margin-left: 8px">${a}</p>
      </div>
      <div class="p-n-personal" style=" margin-top: 5px"> 
        <p class="main-color600">
          <img src="${IMAGES.pdfIcon}" width="150" height="150" alt="icon" style="float:left;margin-right: 18.5px;" class="icon">
          Address
        </p>
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
                <button className="btn-primary" onClick={() => navigate('/addClient')}>
                    Añadir Nuevo Cliente
                </button>
                <div className="shadow-container" style={{ overflowX: 'auto', maxWidth: '100%' }} id="client-table">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre de usuario</th>
                                <th>Nombre del cliente</th>
                                <th>Apellido Paterno</th>
                                <th>Apellido Materno</th>
                                <th>Email</th>
                                <th>Telefono</th>
                                <th>Contraseña</th>
                                <th>Opciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((client, index) => (
                                <tr key={client.id_client}>
                                    <td>{index + 1}</td>
                                    <td className="font-semibold text-slate-700" >{client.username}</td>
                                    <td>{client.name}</td>
                                    <td>{client.firstLN}</td>
                                    <td>{client.secondLN}</td>
                                    <td>{client.email}</td>
                                    <td>{client.phone}</td>
                                    <td>{client.pass || "N/A"}</td>
                                    <td>
                                        <button
                                            onClick={() => navigate(`/editClient/${client.id_client}`)}
                                            className="btn-edit m-1"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleClickOpen(client.name, client.id_client)}
                                            className="btn-cancel mt-1"
                                        >
                                            Borrar
                                        </button>
                                        <Dialog
                                            open={open}
                                            onClose={handleClose}
                                            aria-labelledby="alert-dialog-title"
                                            aria-describedby="alert-dialog-description"
                                        >
                                            {/* ... (your dialog code) */}
                                        </Dialog>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <button className="btn-cancel" type="button" onClick={() => printJS({ printable: data, type: 'json', properties: ['id_client', 'name', 'username', 'firstLN', 'secondLN', 'email', 'phone', 'pass'], header: 'PrintJS - Form Element Selection' })}>
                Print Data JSON
            </button>
            <button className="btn-cancel" type="button" onClick={() => printJS({ printable: 'client-table', type: 'html', header: 'PrintJS - Form Element Selection' })}>
                Print Data ID HTML
            </button>
            <button className="btn-cancel" type="button" onClick={() => printJS({ printable: html, type: 'raw-html', header: 'PrintJS - Form Element Selection' })}>
                Print Data Raw HTML
            </button>
        </div>
    );
}

export default Clients;
