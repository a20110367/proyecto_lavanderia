import React from "react";
import { Link } from "react-router-dom";
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
    const [clientSelName, setClientSelName] = React.useState();
    const [clientSelId, setClientSelId] = React.useState();

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

    const [open, setOpen] = React.useState(false);

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
            <div  className=" bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1">
                <strong>Clients</strong>
            </div>
            <div className="w-full pt-4">
                <Link
                    to="/addClient"
                    className="bg-green-500 hover:bg-green-700 border border-slate-200 text-white font-bold py-2 px-4 rounded-lg"
                >
                Añadir Nuevo Cliente
                </Link>
                <div className="relative shadow rounded-lg mt-3">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                            <tr>
                                <th className="py-3 px-1 text-center">ID</th>
                                <th className="py-3 px-6">Nombre</th>
                                <th className="py-3 px-6">Nombre de usuario</th>
                                <th className="py-3 px-6">Apellido Paterno</th>
                                <th className="py-3 px-6">Apellido Materno</th>
                                <th className="py-3 px-6">Email</th>
                                <th className="py-3 px-6">Telefono</th>
                                <th className="py-3 px-6">Contraseña</th>
                                <th className="py-3 px-1 text-center">Opciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((client, index) => (
                                <tr className="bg-white border-b" key={client.id_client}>
                                    <td className="py-3 px-1 text-center">{index + 1}</td>
                                    <td className="py-3 px-6 font-medium text-gray-900">
                                        {client.name}
                                    </td>
                                    <td className="py-3 px-6 font-medium text-gray-900">
                                        {client.username}
                                    </td>
                                    <td className="py-3 px-6">{client.firstName}</td>
                                    <td className="py-3 px-6">{client.secondName}</td>
                                    <td className="py-3 px-6">{client.email}</td>
                                    <td className="py-3 px-6">{client.phone}</td>
                                    <td className="py-3 px-6">{client.pass || "N/A"}</td>
                                    <td className="py-3 px-1 text-center">
                                        <Link
                                            to={`/editClient/${client.id_client}`}
                                            className="font-medium bg-blue-400 hover:bg-blue-500 px-3 py-1 rounded text-white mr-1"
                                        >
                                            Editar
                                        </Link>
                                        <button
                                            onClick={() => handleClickOpen(client.name, client.id_client)}
                                            className="font-medium bg-red-400 hover:bg-red-500 px-3 py-1 rounded text-white"
                                        >
                                            Borrar
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
