import { OrderStatus, PrismaClient } from "@prisma/client";
import moment from 'moment'
moment.locale('es-mx');

const prisma = new PrismaClient();

export const getSupplyOrders = async (req, res) => {
    try {
        const response = await prisma.supplyOrder.findMany({


            include: {
                client: {
                    select: {
                        name: true,
                        firstLN: true,
                        secondLN: true,
                        email: true,
                        phone: true,
                    },
                },

                user: {
                    select: {
                        name: true,
                        firstLN: true,
                        secondLN: true,
                    },
                },
                SupplyOrderDetail: true,
                SupplyPayment: true,
            },
        });


        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}

export const getActiveSupplyOrders = async (req, res) => {

    let lastDate = (moment().subtract(60, 'days').startOf('day').toISOString())

    try {
        const response = await prisma.supplyOrder.findMany({

            where: {
                created: {
                    gte: new Date(lastDate)
                },
            },

            include: {
                client: {
                    select: {
                        name: true,
                        firstLN: true,
                        secondLN: true,
                        email: true,
                        phone: true,
                    },
                },

                user: {
                    select: {
                        name: true,
                        firstLN: true,
                        secondLN: true,
                    },
                },
                SupplyOrderDetail: true,
                SupplyPayment: true,
            },
        });


        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}



export const getSupplyOrdersById = async (req, res) => {
    try {
        const response = await prisma.supplyOrder.findFirst({
            where: {
                id_supplyOrder: Number(req.params.id)
            },
            include: {
                client: {
                    select: {
                        name: true,
                        firstLN: true,
                        secondLN: true,
                        email: true,
                        phone: true,
                    },
                },
                category: {
                    select: {
                        categoryDescription: true,
                    }
                },
                user: {
                    select: {
                        name: true,
                        firstLN: true,
                        secondLN: true,
                    },
                },
                SupplyOrderDetail: true,
                SupplyPayment: true,
                deliveryDetail: {
                    select: {
                        user: {
                            select: {
                                name: true,
                                firstLN: true,
                                secondLN: true,
                            },
                        },
                        deliveryDate: true,
                        deliveryTime: true,
                    },
                },
            },

        });

        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}

export const getSupplyOrdersByClientName = async (req, res) => {

    try {
        let clientNameArray = req.body.clientName.split(" ")
        const clienSecondLN = clientNameArray.pop()
        const clientFirstLN = clientNameArray.pop()
        const clientNewName = clientNameArray.toString()
        const clientName = clientNewName.replace(/,/g, ' ')
        console.log(clientNameArray, clientName, clientFirstLN, clienSecondLN)


        const client = await prisma.client.findFirst({
            where: {
                AND: [
                    {
                        name: clientName,

                    },
                    {
                        firstLN: clientFirstLN,
                    },
                    {
                        secondLN: clienSecondLN,
                    }

                ],
            },

            select: {
                id_client: true,
            }

        });

        console.log(client)

        var response = "";
        if (client != null) {

            response = await prisma.supplyOrder.findMany({
                where: {
                    fk_client: client.id_client
                },
                include: {
                    client: {
                        select: {
                            name: true,
                            firstLN: true,
                            secondLN: true,
                            email: true,
                            phone: true,
                        },
                    },
                    category: {
                        select: {
                            categoryDescription: true,
                        }
                    },
                    user: {
                        select: {
                            name: true,
                            firstLN: true,
                            secondLN: true,
                        },
                    },
                    SupplyOrderDetail: true,
                    SupplyPayment: true,
                },

            });

        }
        else {
            response = null
        }

        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}


export const getSupplyOrdersByIdUser = async (req, res) => {
    try {
        const response = await prisma.supplyOrder.findMany({
            where: {
                fk_user: Number(req.params.fk_user)
            },
            include: {
                client: {
                    select: {
                        name: true,
                        firstLN: true,
                        secondLN: true,
                    },
                },
                user: {
                    select: {
                        name: true,
                        firstLN: true,
                        secondLN: true,
                    },
                },
                SupplyOrderDetail: true,
            },
        });
        res.status(201).json(response);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const getSupplyOrdersByIdClient = async (req, res) => {
    try {
        const response = await prisma.supplyOrder.findMany({
            where: {
                fk_client: Number(req.params.fk_client)
            },
            include: {
                client: {
                    select: {
                        name: true,
                        firstLN: true,
                        secondLN: true,
                    },
                },
                user: {
                    select: {
                        name: true,
                        firstLN: true,
                        secondLN: true,
                    },
                },
                SupplyOrderDetail: true,
            },
        });
        res.status(201).json(response);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}


export const createOrder = async (req, res) => {

    try {

        //const supplyOrderDetail =[]

        const supplyOrder = await prisma.supplyOrder.create({
            data: req.body.productOrder,

            include: {
                client: {
                    select: {

                        name: true,
                        firstLN: true,
                        secondLN: true
                    },
                },
            }

        });

        console.log(req.body);

        const orderDetail = req.body.products.map(item => ({ fk_supplyId: item.fk_supplyId, units: item.units, subtotal: item.subtotal, fk_supplyOrder: supplyOrder.id_supplyOrder, price : item.price }))

        const supplyOrderDetail = await prisma.supplyOrderDetail.createMany({

            data: orderDetail
        });


        const response = {

            "supplyOrder": supplyOrder,
            "supplyOrderDetail": orderDetail,
        }

        res.status(201).json(response);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}



export const createOrderMany = async (req, res) => {

    try {
        const orderMany = await prisma.supplyOrder.createMany({
            data: req.body

        });
        res.status(201).json(orderMany);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const updateOrder = async (req, res) => {

    try {
        const supplyOrder = await prisma.supplyOrder.update({
            where: {
                id_supplyOrder: Number(req.params.id)
            },
            data: req.body
        });
        res.status(200).json(supplyOrder);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}

export const updateCancelledSupplyOrder = async (req, res) => {
    try {


        const getSupplyOrderDetail = prisma.supplyOrderDetail.findMany({

            where: {
                fk_supplyOrder: Number(req.params.id)
            },

            select: {
                fk_supplyOrder: true,
                fk_supplyId: true,
                units: true,
                subtotal: true,
            },
        });
        //para terminos practicos se debe buscar el caahcut de servicios, ya que de otra forma la tabla queda con una dependencia incorrecta
        const getCurrentCashCut = prisma.cashCut.findFirst({

            select: {
                fk_user: true,
                id_cashCut: true,

            }

        });

        const getSupplyOrderData = prisma.supplyOrder.findFirst({

            where: {
                id_supplyOrder: Number(req.params.id)
            },

            select: {
                id_supplyOrder: true,
                totalPrice: true,
                payStatus: true,
                fk_client: true,
            },
        });

        const getSupplyPaymentData = prisma.supplyPayment.findFirst({
            where: {
                fk_idOrder: Number(req.params.id)
            },

            select: {
                payMethod: true,
                fk_cashCut: true,
                payTotal: true
            },

        });

        const [cashCutData, supplyOrderData, supplyPaymentData, supplyOrderDetail] = await prisma.$transaction([getCurrentCashCut, getSupplyOrderData, getSupplyPaymentData, getSupplyOrderDetail])

        let payTotal = supplyPaymentData == null ? 0 : supplyPaymentData.payTotal;
        let cancelationTypeDefinition = supplyOrderData.payStatus == "paid" ? "refund" : "cancellation";
        let cancelledOrder;

        //console.log(supplyPaymentData);
        //console.log(cancelationTypeDefinition);
        //console.log(supplyCashCutData);
        //console.log(supplyOrderData);
        console.log(supplyOrderDetail);

        const createCancelledSupplyOrderDetail = prisma.cancelledSupplyOrderDetail.createMany({
            data: supplyOrderDetail
        });

        const createCancelledSupplyOrderRecord = prisma.cancelledSupplyOrder.create({
            data: {
                fk_idSupplyOrder: supplyOrderData.id_supplyOrder,
                fk_user: cashCutData.fk_user,
                amount: supplyOrderData.totalPrice,
                cause: "Cancelacion del pedido de insumos",
                CancellationTypes: cancelationTypeDefinition
            }
        });




        const updateCancelledSupplyOrderDetail = prisma.supplyOrderDetail.updateMany({

            where: {
                fk_supplyOrder: Number(req.params.id)
            },

            data: {
                units: 0,
                subtotal: 0,
            }

        });



        const updateCancelledSupplyOrderStatus = prisma.supplyOrder.update({

            where: {
                id_supplyOrder: Number(req.params.id)
            },

            data: {
                supplyOrderStatus: "cancelled",
            }

        });



        const refoundSupplyPayment = prisma.cashWithdrawal.create({

            data: {
                fk_cashCut: cashCutData.id_cashCut,
                fk_user: cashCutData.fk_user,
                cashWithdrawalType: "supply_cancelled",
                amount: payTotal,
                cause: "cancelation order",
                supplyOrder: supplyOrderData.id_supplyOrder,
                date: new Date(),
            }

        });



        if (cancelationTypeDefinition === "refund") {
            console.log("que la chingada")

            const [cancelledSupplyOrderDetail, cancelledSupplyOrderRecord, updatedSupplyOrderDetail, updatedSupplyOrderStatus, supplyRefound] =
                await prisma.$transaction
                    ([createCancelledSupplyOrderDetail, createCancelledSupplyOrderRecord, updateCancelledSupplyOrderDetail, updateCancelledSupplyOrderStatus, refoundSupplyPayment])

            cancelledOrder = cancelledSupplyOrderRecord;

        }
        if (cancelationTypeDefinition === "cancellation") {
            console.log("que la chingada2")
            const [cancelledSupplyOrderDetail, cancelledSupplyOrderRecord, updatedSupplyOrderDetail, updatedSupplyOrderStatus] =
                await prisma.$transaction
                    ([createCancelledSupplyOrderDetail, createCancelledSupplyOrderRecord, updateCancelledSupplyOrderDetail, updateCancelledSupplyOrderStatus])

            cancelledOrder = cancelledSupplyOrderRecord;
        }


        const response = cancelledOrder;


        res.status(200).json(response);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const deleteOrder = async (req, res) => {
    try {
        const supplyOrder = await prisma.supplyOrder.delete({
            where: {
                id_supplyOrder: Number(req.params.id)
            }
        });
        res.status(200).json(supplyOrder);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const deleteOrderAll = async (req, res) => {
    try {
        const supplyOrder = await prisma.supplyOrder.deleteMany({});
        res.status(200).json(supplyOrder);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}