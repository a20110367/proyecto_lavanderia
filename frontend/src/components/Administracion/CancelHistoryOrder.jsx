import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { Modal, Button } from "antd";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useAuth } from "../../hooks/auth/auth";
import ReactPaginate from "react-paginate";
import useSWR from "swr";
import Swal from "sweetalert2";
import api from "../../api/api";
import { formatDate, formatTime } from "../../utils/format";

function Cancelacion() {
    const navigate = useNavigate();
    const [cancelaciones, setCancelaciones] = useState([]);
    const [filtro, setFiltro] = useState("");
    const [visible, setVisible] = useState(false);
    const [canceledOrder, setCanceledOrder] = useState({
        id_cancelledOrder: 0,
        fk_idServiceOrder: 0,
        amount: 0,
        CancellationTypes: "refund",
        cause: "R",
        created: "2024"
    });
    const [order, setOrder] = useState({
        id_order: 0,
        user: {
            name: "A",
            firstLN: "B",
            secondLN: "C"
        },
        client: {
            name: "A",
            firstLN: "B",
            secondLN: "C"
        },
        category: {
            categoryDescription: "Autoservicio",
        },
        numberOfItems: 0,
        payStatus: "unpaid",
        payForm: "Advance",
        notes: "",
        created: "2024"
    });
    const { cookies } = useAuth();
    const [numeroPedidoError, setNumeroPedidoError] = useState("");
    const [motivoError, setMotivoError] = useState("");

    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10; // Cantidad de elementos a mostrar por página
    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage.selected);
    };

    const fetcher = async () => {
        const response = await api.get("/orderCancelled");
        return response.data;
    };
    const { data } = useSWR("orderCancelled", fetcher);

    useEffect(() => {
        if (data) {
            setCancelaciones(data);
        }
    }, [data]);

    const handleFiltroChange = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filtered = cancelaciones.filter(
            (cancelacion) => {
                return (
                    cancelacion.id_order.toString().toLowerCase().includes(searchTerm) ||
                    cancelacion.cliente.name.toLowerCase().includes(searchTerm)
                );
            });
        setFiltro(event.target.value);
        setCancelaciones(filtered);
        setCurrentPage(0);
    };

    const handleCancelacion = async (canceled) => {
        // if (!localStorage.getItem("cashCutId")) {
        //     Swal.fire({
        //         icon: "warning",
        //         title: "No has inicializado caja!",
        //         text: "Da click en Iniciar Caja.",
        //         confirmButtonColor: "#034078",
        //     });
        //     navigate("/inicioCaja");
        //     return;
        // }
        setCanceledOrder(canceled)
        const res = await api.get(`/orders/${canceled.fk_idServiceOrder}`)
        setOrder(await res.data)
        setVisible(true);
    };

    const handlePrintOrderCanceledOrder = async (canceled) => {
        try{
            if(canceledOrder && order){
                await api.post(`/generate/order/reprint`, {
                    canceled: canceledOrder,
                    order: order,
                })
                Swal.fire("Ticket Impreso", "", "success");
            }
        }catch(err){
            console.error(err);
            Swal.fire("Error al imprimir", "", "error")
        }
    }

    const handleMotivoInput = () => {
        setMotivoError(""); // Ocultar el mensaje de error cuando se escribe en el campo "Monto"
    };

    const handleConfirmCancelacion = async () => {
        try {
            setCanceledOrder
        }
        catch (err) {
            console.error(err)
        }
    };

    const handleClose = () => {
        setVisible(false);
        setCanceledOrder({
            id_cancelledOrder: 0,
            fk_idServiceOrder: 0,
            amount: 0,
            CancellationTypes: "refund",
            cause: "R",
            created: "2024"
        });
        setOrder({
            id_order: 0,
            user: {
                name: "A",
                firstLN: "B",
                secondLN: "C"
            },
            client: {
                name: "A",
                firstLN: "B",
                secondLN: "C"
            },
            category: {
                categoryDescription: "Autoservicio",
            },
            numberOfItems: 0,
            payStatus: "unpaid",
            payForm: "Advance",
            notes: "",
            created: "2024"
        });
    };

    return (
        <div>
            <div className="mb-3">
                <div className="title-container">
                    <strong className="title-strong">Cancelación de Servicios</strong>
                </div>
            </div>
            <div className="flex items-center -4">
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
            <table className="w-full text-sm text-left text-gray-500 mt-8">
                <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                    <tr>
                        <th>ID Cancelacion</th>
                        <th>No. Orden Canceladada</th>
                        <th>Monto</th>
                        <th>Tipo</th>
                        <th>Causa</th>
                        <th>Fecha de la Cancelación</th>
                        <th>Opciones</th>
                    </tr>
                </thead>
                <tbody>
                    {cancelaciones
                        .slice()
                        .reverse()
                        .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
                        .map((cancelacion) => (
                            <tr
                                className="bg-white border-b"
                                key={cancelacion.id_cancelledOrder}
                            >
                                <td className="py-3 px-1 text-center">
                                    {cancelacion.id_cancelledOrder}
                                </td>
                                {/*<td className="py-3 px-6">{cancelacion.client.name + ' ' + cancelacion.client.firstLN + ' ' + cancelacion.client.secondLN}</td>*/}
                                <td className="py-3 px-6">{cancelacion.fk_idServiceOrder}</td>
                                <td className="py-3 px-6 font-bold">{"$" + cancelacion.amount}</td>
                                <td className="py-3 px-6">{cancelacion.CancellationTypes === 'cancellation' ? 'Cancelación' : 'Rembolso'}</td>
                                <td className="py-3 px-6">{cancelacion.cause}</td>
                                <td className="py-3 px-6">{formatDate(cancelacion.created)}</td>
                                {/*<td className="py-3 px-6">{cancelacion.user.name + ' ' + cancelacion.user.firstLN + ' ' + cancelacion.user.secondLN}</td>*/}
                                <td>
                                    <button
                                        onClick={() =>
                                            handleCancelacion(cancelacion)
                                        }
                                        className="py-3 px-6 btn-payment w-11/12 p-0 m-0"
                                    >Detalles
                                    </button></td>
                            </tr>
                        ))}
                </tbody>
            </table>
            <Modal
                title="Detalles de la Orden de Cancelación"
                open={visible}
                onOk={handlePrintOrderCanceledOrder}
                onCancel={handleClose}
                width={800}
                footer={[
                    <Button
                        key="print"
                        onClick={() => handlePrintOrderCanceledOrder()}
                        className="btn-print text-white"
                    >
                        Imprimir Orden
                    </Button>,
                    <Button
                        key="close"
                        onClick={handleClose}
                        className="btn-cancel-modal text-white"
                    >
                        Cerrar
                    </Button>,
                ]}
            >
                <p className="font-bold mx-5 my-2 text-lg">Datos de la Cancelación</p>
                <div className="grid grid-cols-2 justify-center gap-4 mb-4">
                    <p className="font-bold mx-5">Folio de Cancelación de Orden: <br/><span className="font-normal">{canceledOrder.id_cancelledOrder}</span></p>
                    <p className="font-bold mx-5">Monto: <br/><span className="font-normal">${canceledOrder.amount}</span></p>

                    <p className="font-bold mx-5">Motivo: <br/><span className="font-normal">{canceledOrder.cause}</span></p>
                    <p className="font-bold mx-5">Fecha de Cancelación: <br/><span className="font-normal">{formatDate(canceledOrder.created)}</span></p>
                </div>

                <hr></hr>

                <p className="font-bold mx-5 my-2 text-lg">Datos de la Orden</p>
                <div className="grid grid-cols-3 justify-center gap-4">
                    <p className="font-bold mx-5">No. Orden Cancelada: <br/><span className="font-normal">{order.id_order}</span></p>
                    <p className="font-bold mx-5">Cliente: <br/><span className="font-normal">{order.client.name + ' ' + order.client.firstLN + ' ' + order.client.secondLN}</span></p>
                    <p className="font-bold mx-5">Cajero: <br/><span className="font-normal">{order.user.name + ' ' + order.user.firstLN + ' ' + order.user.secondLN}</span></p>

                    <p className="font-bold mx-5">Estatus de Pago: <br/><span className="font-normal">{order.payStatus === "paid" ? "PAGADO" : "NO PAGADO"}</span></p>
                    <p className="font-bold mx-5">Forma de Pago: <br/><span className="font-normal">{order.payForm === "advance" ? "Anticipado" : "A la Entrega"}</span></p>
                    <p className="font-bold mx-5">Categoria: <br/><span className="font-normal">{order.category.categoryDescription}</span></p>

                    <p className="font-bold mx-5">Fecha de Creación: <br/><span className="font-normal">{formatDate(order.created)}</span></p>
                    <p className="font-bold mx-5">No. de Servicios: <br/><span className="font-normal">{order.numberOfItems}</span></p>
                    <p className="font-bold mx-5">Notas: <br/><span className="font-normal">{order.notes}</span></p>
                </div>
            </Modal>
            <div className="flex justify-center mt-4 mb-4">
                <ReactPaginate
                    previousLabel={"Anterior"}
                    nextLabel={"Siguiente"}
                    breakLabel={"..."}
                    pageCount={Math.ceil(cancelaciones.length / itemsPerPage)}
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

export default Cancelacion;
