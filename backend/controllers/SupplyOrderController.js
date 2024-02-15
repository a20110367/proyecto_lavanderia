import index from "@green-api/whatsapp-api-client";
import { OrderStatus, PrismaClient } from "@prisma/client";
import { response } from "express";
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
        const supplyOrder = await prisma.supplyOrder.create({
            data: req.body

        });
        res.status(201).json(supplyOrder);
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