import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import useSWR, { useSWRConfig } from "swr";

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

    return (
        <div>
            <div  className="title-container">
                <strong className="title-strong">Lista de Clientes</strong>
            </div>
            <div className="w-full pt-4">
                <button className="btn-primary" onClick={() => navigate('/addClient')}>
                    Añadir Nuevo Cliente
                </button>
                <div className="shadow-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Nombre de usuario</th>
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
                                    <td>{client.name}</td>
                                    <td>{client.username}</td>
                                    <td>{client.firstName}</td>
                                    <td>{client.secondName}</td>
                                    <td>{client.email}</td>
                                    <td>{client.phone}</td>
                                    <td>{client.pass || "N/A"}</td>
                                    <td>
                                        <button 
                                            onClick={() => navigate(`/editClient/${client.id_client}`)} 
                                            className="btn-edit"
                                            >Editar
                                        </button>
                                        <button
                                            onClick={() => handleClickOpen(client.name, client.id_client)}
                                            className="btn-cancel"
                                            >Borrar
                                        </button>
                                        <Dialog
                                            open={open}
                                            onClose={handleClose}
                                            aria-labelledby="alert-dialog-title"
                                            aria-describedby="alert-dialog-description"
                                        >
                                            <DialogTitle id="alert-dialog-title">
                                                {"Delete Client"}
                                            </DialogTitle>
                                            <DialogContent>
                                                <DialogContentText id="alert-dialog-description">
                                                    Estas seguro de eliminar al cliente: {clientSelName}?
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={handleClose}>Cancelar</Button>
                                                <Button onClick={() => deleteAndClose(clientSelId)} autoFocus>
                                                    Borrar
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
        </div>
    );
}

export default Clients;
