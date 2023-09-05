import React from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import useSWR, { useSWRConfig } from "swr";

//Dialogs
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function Users() {
    const [userSelName, setUserSelName] = React.useState();
    const [userSelId, setUserSelId] = React.useState();

    const { mutate } = useSWRConfig();
    const fetcher = async () => {
        const response = await Axios.get("http://localhost:5000/users");
        return response.data;
    };

    const { data } = useSWR("users", fetcher);
    if (!data) return <h2>Loading...</h2>;

    const deleteUser = async (userId) => {
        await Axios.delete(`http://localhost:5000/users/${userId}`);
        mutate("users");
    };

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = (userName, userId) => {    
        setUserSelId(userId)
        setUserSelName(userName)
        console.log(userId)
        console.log(userName)
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteAndClose = (userId) => {
        handleClose()
        // console.log(userId)
        deleteUser(userId)
    }

    return (
        <div className="flex flex-col mt-5">
            <div  className=" bg-white px-4 pt-3 pb-4 rounded-sm border vorder-gray-200 flex-1">
                <strong>Usuarios</strong>
            </div>
            <div className="w-full pt-4">
                <Link
                    to="/addUser"
                    className="bg-green-500 hover:bg-green-700 border border-slate-200 text-white font-bold py-2 px-4 rounded-lg pt-"
                >
                    Añadir un Nuevo Usuario
                </Link>
                <div className="relative shadow rounded-lg mt-3">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                            <tr>
                                <th className="py-3 px-1 text-center">ID</th>
                                <th className="py-3 px-6">Nombre</th>
                                <th className="py-3 px-6">Rol</th>
                                <th className="py-3 px-6">Email</th>
                                <th className="py-3 px-6">Telefono</th>
                                <th className="py-3 px-6">Contraseña</th>
                                <th className="py-3 px-1 text-center">Opciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((user, index) => (
                                <tr className="bg-white border-b" key={user.id}>
                                    <td className="py-3 px-1 text-center">{index + 1}</td>
                                    <td className="py-3 px-6 font-medium text-gray-900">
                                        {user.name}
                                    </td>
                                    <td className="py-3 px-6">{user.rol}</td>
                                    <td className="py-3 px-6">{user.email}</td>
                                    <td className="py-3 px-6">{user.phone}</td>
                                    <td className="py-3 px-6">{user.pass}</td>
                                    <td className="py-3 px-1 text-center">
                                        <Link
                                            to={`/editUser/${user.id}`}
                                            className="font-medium bg-blue-400 hover:bg-blue-500 px-3 py-1 rounded text-white mr-1"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleClickOpen(user.name, user.id)}
                                            className="font-medium bg-red-400 hover:bg-red-500 px-3 py-1 rounded text-white"
                                        >
                                            Delete
                                        </button>
                                        <Dialog
                                            open={open}
                                            onClose={handleClose}
                                            aria-labelledby="alert-dialog-title"
                                            aria-describedby="alert-dialog-description"
                                        >
                                            <DialogTitle id="alert-dialog-title">
                                                {"Eliminación de el usuario"}
                                            </DialogTitle>
                                            <DialogContent>
                                                <DialogContentText id="alert-dialog-description">
                                                    Se desea eliminar al usuario: {userSelName}?
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={handleClose}>Cancelar</Button>
                                                <Button onClick={() => deleteAndClose(userSelId)} autoFocus>
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
        </div>
    );
};

export default Users