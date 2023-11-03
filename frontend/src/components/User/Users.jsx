import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import useSWR, { useSWRConfig } from "swr";
import ReactPaginate from "react-paginate";
import { BsFillTrashFill } from "react-icons/bs"
import { AiFillEdit } from "react-icons/ai"

//Dialogs
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

function Users() {
  const [userSelName, setUserSelName] = useState();
  const [userSelId, setUserSelId] = useState();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // Cantidad de elementos a mostrar por página
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

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

  const handleClickOpen = (userName, userId) => {
    setUserSelId(userId);
    setUserSelName(userName);
    console.log(userId);
    console.log(userName);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteAndClose = (userId) => {
    handleClose();
    // console.log(userId)
    deleteUser(userId);
  };

  return (
    <div>
      <div className="title-container">
        <strong className="title-strong">Lista de Empleados</strong>
      </div>
      <div className="w-full pt-4">
        <button onClick={() => navigate("/addUser")} className="btn-primary">
          Añadir Nuevo Usuario
        </button>
        <div className="shadow-container" style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr className="title-tr">
                <th>ID de Usuario</th>
                <th>Nombre de usuario</th>
                <th>Nombre</th>
                <th>Apellido Paterno</th>
                <th>Apellido Materno</th>
                <th>Rol</th>
                <th>Email</th>
                <th>Telefono</th>
                <th>Contraseña</th>
                <th>Opciones</th>
              </tr>
            </thead>
            <tbody>
              {data
                .slice(
                  currentPage * itemsPerPage,
                  (currentPage + 1) * itemsPerPage
                )
                .map((user) => (
                  <tr key={user.id_user}>
                    <td>{user.id_user}</td>
                    <td className="text-slate-700 font-semibold">
                      {user.username}
                    </td>
                    <td>{user.name}</td>
                    <td>{user.firstLN}</td>
                    <td>{user.secondLN}</td>
                    <td
                      className={`${
                        user.role === "admin"
                          ? "text-blue-500 font-semibold"
                          : "text-green-500 font-semibold"
                      }`}
                    >
                      {user.role === "admin" ? "Administrador" : "Empleado"}
                    </td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.pass}</td>
                    <td>
                      <button
                        onClick={() => navigate(`/editUser/${user.id_user}`)}
                        className="btn-edit"
                      >
                        <AiFillEdit/>
                      </button>
                      <button
                        onClick={() => handleClickOpen(user.name, user.id_user)}
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
                          {"Eliminación de el Empleado"}
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText id="alert-dialog-description">
                            <p>
                              Se desea eliminar al Empleado:{" "}
                              <p className="text-dodgerBlue">{userSelName}</p>
                            </p>
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleClose}>Cancelar</Button>
                          <Button
                            onClick={() => deleteAndClose(userSelId)}
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

export default Users;
