import React from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import useSWR, { useSWRConfig } from "swr";

// Dialogs
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

function Servicios() {
  const [serviceSelDesc, setServiceSelDesc] = React.useState();
  const [serviceSelId, setServiceSelId] = React.useState();

  const { mutate } = useSWRConfig();
  const fetcher = async () => {
    const response = await Axios.get("http://localhost:5000/servs");
    return response.data;
  };

  const { data } = useSWR("services", fetcher);
  if (!data) return <h2>Loading...</h2>;

  const deleteService = async (serviceId) => {
    await Axios.delete(`http://localhost:5000/services/${serviceId}`);
    mutate("services");
  };

  const [open, setOpen] = React.useState(false);

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
      <div className="bg-white px-4 pt-3 pb-4 rounded-sm border vorder-gray-200 flex-1">
        <strong>Servicios</strong>
      </div>
      <div className="w-full pt-4">
        <Link
          to="/addServicio"
          className="bg-green-500 hover:bg-green-700 border border-slate-200 text-white font-bold py-2 px-4 rounded-lg"
        >
          Agregar un Nuevo Servicio
        </Link>
        <div className="relative shadow rounded-lg mt-3">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th className="py-3 px-1 text-center">ID</th>
                <th className="py-3 px-6">Descripción</th>
                <th className="py-3 px-6">Precio</th>
                <th className="py-3 px-6">Tiempo</th>
                <th className="py-3 px-6">Peso</th>
                <th className="py-3 px-1 text-center">Opciones</th>
              </tr>
            </thead>
            <tbody>
              {data.map((service, index) => (
                <tr className="bg-white border-b" key={service.id_service}>
                  <td className="py-3 px-1 text-center">{index + 1}</td>
                  <td className="py-3 px-6 font-medium text-gray-900">
                    {service.description}
                  </td>
                  <td className="py-3 px-6">${service.price}</td>
                  <td className="py-3 px-6">{service.time} minutos</td>
                  <td className="py-3 px-6">{service.weight} kg</td>
                  <td className="py-3 px-1 text-center">
                    <Link
                      to={`/editService/${service.id_service}`}
                      className="font-medium bg-blue-400 hover:bg-blue-500 px-3 py-1 rounded text-white mr-1"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() =>
                        handleClickOpen(service.description, service.id_service)
                      }
                      className="font-medium bg-red-400 hover:bg-red-500 px-3 py-1 rounded text-white"
                    >
                      Eliminar
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
    </div>
  );
}

export default Servicios;
