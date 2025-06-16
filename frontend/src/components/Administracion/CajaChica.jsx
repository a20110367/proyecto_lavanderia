import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { Modal, Button, Input } from "antd";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import moment from "moment";
import { useAuth } from "../../hooks/auth/auth";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import useSWR from "swr";
import { formatDate } from "../../utils/format";
import Swal from "sweetalert2";
import api from "../../api/api";

function CajaChica() {
  const navigate = useNavigate();
  const [retiros, setRetiros] = useState([]);
  const [filteredRetiros, setFilteredRetiros] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [visible, setVisible] = useState(false);
  const [visibleAbono, setVisibleAbono] = useState(false);
  const [monto, setMonto] = useState("");
  const [motivo, setMotivo] = useState("");
  const [montoError, setMontoError] = useState("");
  const [motivoError, setMotivoError] = useState("");
  const [usuarioError, setUsuarioError] = useState("");
  const { cookies } = useAuth();

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // Cantidad de elementos a mostrar por página
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const fetcher = async () => {
    const response = await api.get("/pettyCash");
    return response.data;
  };

  const { data } = useSWR("pettyCash", fetcher);

  useEffect(() => {
    if (data) {
      // const retirosFiltrados = data.filter((pettyCash) => pettyCash.PettyCashType === "deposit");
      setRetiros(data);
      setFilteredRetiros(data);
    }
  }, [data]);

  const handleFiltroChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filtered = retiros.filter((retiro) => {
      const formattedDate = moment(retiro.movementDate).format("DD/MM/YYYY");
      return (
        retiro.id_movement.toString().toLowerCase().includes(searchTerm) ||
        formattedDate.includes(searchTerm) ||
        retiro.cause.toLowerCase().includes(searchTerm) ||
        retiro.user.name.toLowerCase().includes(searchTerm)
      );
    });
    setFiltro(event.target.value);
    setFilteredRetiros(filtered);
    setCurrentPage(0);
  };

  const handleRetiro = () => {
    if (!localStorage.getItem("cashCutId")) {
      Swal.fire({
        icon: "warning",
        title: "No has inicializado caja!",
        text: "Da click en Iniciar Caja.",
        confirmButtonColor: "#034078",
      });
      navigate("/inicioCaja");
      return;
    }
    setVisible(true);
  };

  const handleAbono = () => {
    if (!localStorage.getItem("cashCutId")) {
      Swal.fire({
        icon: "warning",
        title: "No has inicializado caja!",
        text: "Da click en Iniciar Caja.",
        confirmButtonColor: "#034078",
      });
      navigate("/inicioCaja");
      return;
    }
    setVisibleAbono(true);
  };

  const handleMotivoInput = () => {
    setMotivoError(""); // Ocultar el mensaje de error cuando se escribe en el campo "Monto"
  };

  const handleMontoInput = () => {
    setMontoError(""); // Ocultar el mensaje de error cuando se escribe en el campo "Monto"
  };

  const handleConfirmAbono = async () => {
    let isValid = true;

    if (!monto) {
      setMontoError("Este campo es obligatorio");
      isValid = false;
    } else {
      setMontoError("");
    }

    if (!motivo) {
      setMotivoError("Este campo es obligatorio");
      isValid = false;
    } else {
      setMotivoError("");
    }

    if (!localStorage.getItem("cashCutId")) {
      setMotivoError("No se ha inicializado la caja");
      isValid = false;
    } else {
      setMotivoError("");
    }

    if (isValid) {
      try {
        const date = moment().format();

        const res = await api.post("/pettyCashDeposit", {
          pettyCashType: "deposit",
          amount: parseFloat(monto),
          fk_user: cookies.token,
          balance: parseFloat(0),
          cause: motivo,
          movementDate: date,
        });
        setVisibleAbono(false);

        const pettyCash = {
          id_movement: res.data.id_movement,
          balance: res.data.balance,
          pettyCashType: 'deposit',
          amount: monto,
          casher: cookies.username,
          cause: motivo,
          movementDate: date
        }

        await api.post('/generatePettyCashTicket', {
          pettyCash: pettyCash,
        })

        const nuevoRetiro = {
          id_movement: res.data.id_movement,
          pettyCashType: "deposit",
          amount: parseFloat(monto),
          fk_user: cookies.token,
          balance: parseFloat(res.data.balance),
          cause: motivo,
          movementDate: date,
          user: {
            name: cookies.username,
          },
        };

        setRetiros([...retiros, nuevoRetiro]);
        setFilteredRetiros([...retiros, nuevoRetiro]);

        await api.post("/sendMessage", {
          id_order: nuevoRetiro.id_movement,
          name: "Rafa",
          email: "a20110341@ceti.mx",
          tel: "5213313839768",
          message: `Se ha realizado un ABONO en la CAJA CHICA 
          Monto: ${monto}, 
          Motivo: ${motivo}. 
          Cajero: ${cookies.username} 
          Fecha: ${formatDate(date)}`,
          subject: "Se ha realizado un ABONO en la CAJA CHICA",
          text: `Se ha realizado un ABONO en la CAJA CHICA con monto de: ${monto}`,
          warning: true,
        });
        console.log("NOTIFICACIÓN ENVIADA...");
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleConfirmRetiro = async () => {
    let isValid = true;

    if (!monto) {
      setMontoError("Este campo es obligatorio");
      isValid = false;
    } else {
      setMontoError("");
    }

    if (!motivo) {
      setMotivoError("Este campo es obligatorio");
      isValid = false;
    } else {
      setMotivoError("");
    }

    if (!localStorage.getItem("cashCutId")) {
      setMotivoError("No se ha inicializado la caja");
      isValid = false;
    } else {
      setMotivoError("");
    }

    const saldoTotal = retiros.reduce((total, movimiento) => {
      if (movimiento.pettyCashType === "deposit") {
        return total + movimiento.amount;
      } else {
        return total - movimiento.amount;
      }
    }, 0);

    if (saldoTotal === 0) {
      Swal.fire({
        icon: "warning",
        title: "El saldo de la caja es $0",
        text: "No puedes realizar retiros cuando el saldo es $0",
        confirmButtonColor: "#034078",
      });
      return;
    }

    if (parseFloat(monto) > saldoTotal) {
      Swal.fire({
        icon: "warning",
        title: "El monto del retiro excede el saldo total de la caja",
        text: "Ingrese un monto menor o igual al saldo disponible",
        confirmButtonColor: "#034078",
      });
      return;
    }

    if (isValid) {
      try {
        const date = moment().format();

        const res = await api.post("/pettyCashWithdrawal", {
          pettyCashType: "withdrawal",
          amount: parseFloat(monto),
          fk_user: cookies.token,
          balance: parseFloat(0),
          cause: motivo,
          movementDate: date,
        });
        setVisible(false);

        const pettyCash = {
          id_movement: res.data.id_movement,
          balance: res.data.balance,
          pettyCashType: 'withdrawal',
          amount: monto,
          casher: cookies.username,
          cause: motivo,
          movementDate: date
        }

        await api.post('/generatePettyCashTicket', {
          pettyCash: pettyCash,
        })

        const nuevoRetiro = {
          id_movement: res.data.id_movement,
          pettyCashType: "withdrawal",
          amount: parseFloat(monto),
          fk_user: cookies.token,
          balance: parseFloat(res.data.balance),
          cause: motivo,
          movementDate: date,
          user: {
            name: cookies.username,
          },
        };

        setRetiros([...retiros, nuevoRetiro]);
        setFilteredRetiros([...retiros, nuevoRetiro]);

        await api.post("/sendMessage", {
          id_order: nuevoRetiro.id_movement,
          name: "Rafa",
          email: "a20110341@ceti.mx",
          tel: "5213313839768",
          message: `Se ha realizado un RETIRO en la CAJA CHICA
          Monto: ${monto},
          Motivo: ${motivo}.
          Cajero: ${cookies.username}
          Fecha: ${formatDate(date)}`,
          subject: "Se ha realizado un RETIRO en la CAJA CHICA",
          text: `Se ha realizado un RETIRO en la CAJA CHICA con monto de: ${monto}`,
          warning: true,
        });
        console.log("NOTIFICACIÓN ENVIADA...");
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleClose = () => {
    setVisible(false);
    setMonto("");
    setMotivo("");
  };

  const handleAbonoClose = () => {
    setVisibleAbono(false);
    setMonto("");
    setMotivo("");
  };

  return (
    <div>
      <div className="mb-3">
        <div className="title-container">
          <strong className="title-strong">Caja Chica</strong>
        </div>
      </div>
      <div className="flex items-center">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Buscar..."
            className="input-search"
            value={filtro}
            onChange={handleFiltroChange}
          />
          <div className="absolute top-2.5 left-1 text-gray-400">
            <HiOutlineSearch fontSize={20} className="text-gray-400" />
          </div>
        </div>
      </div>
      <div className="flex">
        <div className="mt-3 mb-3 mr-2">
          <button
            onClick={handleRetiro}
            className="btn-primary bg-FireBrick hover:bg-RedPantone"
          >
            Registrar Retiro
          </button>
        </div>

        <div className="mt-3 mb-3">
          <button onClick={handleAbono} className="btn-primary">
            Registrar Abono
          </button>
        </div>
      </div>

      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-200">
          <tr>
            <th>No. Folio</th>
            <th>Tipo</th>
            <th>Fecha</th>
            <th>Monto</th>
            <th>Motivo</th>
            <th>Usuario</th>
            <th>
              Saldo <br />
              Caja{" "}
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredRetiros
            .slice()
            .reverse()
            .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
            .map((pettyCash) => (
              <tr className="bg-white border-b" key={pettyCash.id_movement}>
                <td className="py-3 px-1 text-center">
                  {pettyCash.id_movement}
                </td>
                <td
                  className={`font-semibold ${
                    pettyCash.pettyCashType === "withdrawal"
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {pettyCash.pettyCashType === "withdrawal" ? (
                    <>
                      <FaArrowTrendDown className="inline-block mr-1" />
                      Retiro
                    </>
                  ) : (
                    <>
                      <FaArrowTrendUp className="inline-block mr-1" />
                      Abono
                    </>
                  )}
                </td>
                <td className="py-3 px-6">
                  {formatDate(pettyCash.movementDate)}
                </td>
                <td className="py-3 px-6">${pettyCash.amount}</td>
                <td className="py-3 px-6">{pettyCash.cause}</td>
                <td className="py-3 px-6">{pettyCash.user.name} {pettyCash.user.firsLN} {pettyCash.user.secondLN}</td>
                <td
                  className={`py-3 px-6 ${
                    pettyCash.pettyCashType === "withdrawal"
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {pettyCash.pettyCashType === "withdrawal" ? (
                    <>
                      <FaArrowTrendDown className="inline-block mr-1" />$
                      {pettyCash.balance}
                    </>
                  ) : (
                    <>
                      <FaArrowTrendUp className="inline-block mr-1" />$
                      {pettyCash.balance}
                    </>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <Modal
        title="Registrar Retiro de Caja"
        open={visible}
        onOk={handleConfirmRetiro}
        onCancel={handleClose}
        width={600}
        footer={[
          <Button
            key="confirmar"
            onClick={handleConfirmRetiro}
            className="btn-print text-white"
          >
            Confirmar Retiro de Caja
          </Button>,
          <Button
            key="cancelar"
            onClick={handleClose}
            className="btn-cancel-modal text-white"
          >
            Cancelar
          </Button>,
        ]}
      >
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Monto:
            </label>
            <Input
              type="number"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="Ingrese el monto"
              addonBefore="$"
              onInput={handleMontoInput}
            />
            <p className="text-red-500">{montoError}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Motivo:
            </label>
            <Input
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ingrese el motivo"
              onInput={handleMotivoInput}
            />
            <p className="text-red-500">{motivoError}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Usuario:
            </label>
            <Input
              value={cookies.username} // Utiliza el nombre de usuario desde las cookies
              readOnly // Hacer el campo solo de lectura
            />
            <p className="text-red-500">{usuarioError}</p>
          </div>
        </form>
      </Modal>

      <Modal
        title="Registrar Abono"
        open={visibleAbono}
        onOk={handleConfirmAbono}
        onCancel={handleAbonoClose}
        width={600}
        footer={[
          <Button
            key="confirmar"
            onClick={handleConfirmAbono}
            className="btn-print text-white"
          >
            Confirmar Abono de Caja chica
          </Button>,
          <Button
            key="cancelar"
            onClick={handleAbonoClose}
            className="btn-cancel-modal text-white"
          >
            Cancelar
          </Button>,
        ]}
      >
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Monto:
            </label>
            <Input
              type="number"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="Ingrese el monto"
              addonBefore="$"
              onInput={handleMontoInput}
            />
            <p className="text-red-500">{montoError}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Motivo:
            </label>
            <Input
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ingrese el motivo"
              onInput={handleMotivoInput}
            />
            <p className="text-red-500">{motivoError}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Usuario:
            </label>
            <Input
              value={cookies.username} // Utiliza el nombre de usuario desde las cookies
              readOnly // Hacer el campo solo de lectura
            />
            <p className="text-red-500">{usuarioError}</p>
          </div>
        </form>
      </Modal>

      <div className="flex justify-center mt-4 mb-4">
        <ReactPaginate
          previousLabel={"Anterior"}
          nextLabel={"Siguiente"}
          breakLabel={"..."}
          pageCount={Math.ceil(filteredRetiros.length / itemsPerPage)}
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

export default CajaChica;
