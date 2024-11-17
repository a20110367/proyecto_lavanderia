import index from "@green-api/whatsapp-api-client";
import { OrderStatus, PrismaClient } from "@prisma/client";
import { response } from "express";
import moment from 'moment'
moment.locale('es-mx');

const prisma = new PrismaClient();
//Regresa todas las ordenes  nrevisar si se usa en el sistema
export const getOrders = async (req, res) => {
    let lastDate = (moment().subtract(180, 'days').startOf('day').toISOString())
    try {
        const response = await prisma.serviceOrder.findMany({

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
                ServiceOrderDetail: true,
                payment: true,
                deliveryDetail: {
                    select: {
                        user: {
                            select: {
                                name: true,
                                firstLN: true,
                                secondLN: true,
                            },
                        },
                    },
                },
            },
        });


        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}

export const getActiveOrders = async (req, res) => {
    let lastDate = (moment().subtract(60, 'days').startOf('day').toISOString())
    console.log(lastDate)
    try {
        const response = await prisma.serviceOrder.findMany({

            where: {
                AND: [
                    {
                        created: {
                            gte: new Date(lastDate)
                        },
                    },
                    {
                        NOT:
                        {
                            OR:
                                [
                                    {
                                        orderStatus: "stored",
                                    },
                                    {
                                        orderStatus: "cancelled",
                                    }
                                ]
                        }

                    }
                ]
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
                ServiceOrderDetail: true,
                payment: true,
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
                    },
                },
            },
        });


        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}

export const getPendingOrders = async (req, res) => {
    let lastDate = (moment().subtract(90, 'days').startOf('day').toISOString())
    console.log(lastDate)
    try {
        const response = await prisma.serviceOrder.findMany({

            where: {
                AND:
                    [
                        {
                            created: {
                                gte: new Date(lastDate)
                            },
                        },
                        {
                            orderStatus: "pending"
                        }

                    ],

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
                ServiceOrderDetail: true,
                payment: true,
                deliveryDetail: {
                    select: {
                        user: {
                            select: {
                                name: true,
                                firstLN: true,
                                secondLN: true,
                            },
                        },
                    },
                },
            },
        });


        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}

export const getOrdersById = async (req, res) => {
    try {
        const response = await prisma.serviceOrder.findFirst({
            where: {
                id_order: Number(req.params.id)
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
                ServiceOrderDetail: {
                    select: {
                        SelfService: {
                            select: {
                                description: true,
                                price: true,
                                priceCredit: true,
                            }
                        },
                        LaundryService: {
                            select: {
                                description: true,
                                price: true,
                                priceCredit: true,
                            }
                        },
                        IronService: {
                            select: {
                                description: true,
                                price: true,
                                priceCredit: true,
                            }
                        },
                        DrycleanService: {
                            select: {
                                description: true,
                                price: true,
                                priceCredit: true,
                            }
                        },
                        OtherService: {
                            select: {
                                description: true,
                                price: true,
                                priceCredit: true,
                            }
                        },
                        subtotal: true,
                        units: true

                    }
                },
                payment: true,
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

export const getOrdersStatusById = async (req, res) => {
    try {
        const response = await prisma.serviceOrder.findFirst({
            where: {
                id_order: Number(req.params.id)
            },

            select: {
                orderStatus: true
            },


        });

        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}

export const getOrdersByClientName = async (req, res) => {

    let lastDate = (moment().subtract(365, 'days').startOf('day').toISOString())

    try {
        // let clientNameArray = req.body.clientName.split(" ")
        // const clienSecondLN = clientNameArray.pop()
        // const clientFirstLN = clientNameArray.pop()
        // const clientNewName = clientNameArray.toString()
        // const clientName = clientNewName.replace(/,/g, ' ')
        // console.log(clientNameArray, clientName, clientFirstLN, clienSecondLN)

        const clientName = req.body.clientName
        const clientFirstLN = req.body.firstName
        const clienSecondLN = req.body.secondNameClient

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
                    },
                    {
                        created: {
                            gte: new Date(lastDate)
                        },
                    }

                ],
            },

            select: {
                id_client: true,
            }

        });

        console.log(client)

        let response = "";
        if (client != null) {

            response = await prisma.serviceOrder.findMany({
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
                    ServiceOrderDetail: {
                        select: {
                            SelfService: {
                                select: {
                                    description: true,
                                    price: true,
                                    priceCredit: true,
                                }
                            },
                            LaundryService: {
                                select: {
                                    description: true,
                                    price: true,
                                    priceCredit: true,
                                }
                            },
                            IronService: {
                                select: {
                                    description: true,
                                    price: true,
                                    priceCredit: true,
                                }
                            },
                            DrycleanService: {
                                select: {
                                    description: true,
                                    price: true,
                                    priceCredit: true,
                                }
                            },
                            OtherService: {
                                select: {
                                    description: true,
                                    price: true,
                                    priceCredit: true,
                                }
                            },
                            subtotal: true,
                            units: true

                        }
                    },
                    payment: true,
                    deliveryDetail: {
                        select: {
                            deliveryDate: true,
                            deliveryTime: true,
                            user: {
                                select: {
                                    name: true,
                                    firstLN: true,
                                    secondLN: true,
                                },
                            },



                        },

                    },
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

export const getStoredOrdersByClientName = async (req, res) => {

    try {
        // let clientNameArray = req.body.clientName.split(" ")
        // const clienSecondLN = clientNameArray.pop()
        // const clientFirstLN = clientNameArray.pop()
        // const clientNewName = clientNameArray.toString()
        // const clientName = clientNewName.replace(/,/g, ' ')
        // console.log(clientNameArray, clientName, clientFirstLN, clienSecondLN)

        const clientName = req.body.clientName
        const clientFirstLN = req.body.firstName
        const clienSecondLN = req.body.secondNameClient

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

            response = await prisma.serviceOrder.findMany({
                where: {
                    AND: [
                        {
                            fk_client: client.id_client
                        },
                        {
                            orderStatus: "stored"
                        }

                    ]

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
                    ServiceOrderDetail: true,
                    payment: true,
                    deliveryDetail: {

                        select: {
                            deliveryDate: true,
                            deliveryTime: true,
                            user: {
                                select: {
                                    name: true,
                                    firstLN: true,
                                    secondLN: true,
                                },
                            },
                        },

                    },
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

export const getOrdersByIdUser = async (req, res) => {

    let lastDate = (moment().subtract(365, 'days').startOf('day').toISOString())

    try {
        const response = await prisma.serviceOrder.findMany({
            where: {

                AND:
                    [
                        {
                            fk_user: Number(req.params.fk_user)
                        },
                        {
                            created: {
                                gte: new Date(lastDate)
                            },
                        }
                    ]

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
                ServiceOrderDetail: true,
            },
        });
        res.status(201).json(response);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const getOrdersByIdClient = async (req, res) => {

    let lastDate = (moment().subtract(365, 'days').startOf('day').toISOString())

    try {
        const response = await prisma.serviceOrder.findMany({
            where: {
                AND:
                    [
                        {
                            fk_client: Number(req.params.fk_client)
                        },
                        {
                            created: {
                                gte: new Date(lastDate)
                            },
                        }
                    ]

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
                ServiceOrderDetail: true,
            },
        });
        res.status(201).json(response);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const getOrdersSelfService = async (req, res) => {

    let lastDate = (moment().subtract(90, 'days').startOf('day').toISOString())

    try {
        const response = await prisma.serviceOrder.findMany({
            where: {
                AND:
                    [
                        {
                            fk_categoryId: 1
                        },
                        {
                            created: {
                                gte: new Date(lastDate)
                            },
                        }
                    ]

            },
            include: {
                client: {
                    select: {
                        name: true,
                        firstLN: true,
                        secondLN: true,
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
                ServiceOrderDetail: {
                    select: {
                        id_serviceOrderDetail: true,
                        units: true,
                        subtotal: true,
                        SelfService: {
                            select: {
                                description: true,
                                price: true,
                                priceCredit: true,
                                machineType: true,
                            },
                        },
                    },
                },
                payment: true,
            },
        });
        res.status(201).json(response);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const getOrdersLaundry = async (req, res) => {
    let lastDate = (moment().subtract(90, 'days').startOf('day').toISOString())

    try {
        const response = await prisma.serviceOrder.findMany({
            where: {
                AND:
                    [
                        {
                            fk_categoryId: 2
                        },
                        {
                            created: {
                                gte: new Date(lastDate)
                            },
                        }
                    ]

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
                ServiceOrderDetail: {
                    select: {
                        id_serviceOrderDetail: true,
                        units: true,
                        subtotal: true,
                        LaundryService: {
                            select: {
                                description: true,
                                price: true,
                                priceCredit: true,
                            },
                        },
                    },
                },
                payment: true,
            },
        });
        res.status(201).json(response);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const getOrdersIron = async (req, res) => {
    let lastDate = (moment().subtract(90, 'days').startOf('day').toISOString())

    try {
        const response = await prisma.serviceOrder.findMany({
            where: {
                AND:
                    [
                        {
                            fk_categoryId: 3
                        },
                        {
                            created: {
                                gte: new Date(lastDate)
                            },
                        }
                    ]

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
                ServiceOrderDetail: {
                    select: {
                        id_serviceOrderDetail: true,
                        units: true,
                        subtotal: true,
                        IronService: {
                            select: {
                                description: true,
                                price: true,
                                priceCredit: true,
                            },
                        },
                    },
                },
                payment: true,
            },
        });
        res.status(201).json(response);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const getOrdersDryclean = async (req, res) => {
    let lastDate = (moment().subtract(90, 'days').startOf('day').toISOString())

    try {
        const response = await prisma.serviceOrder.findMany({
            where: {
                AND:
                    [
                        {
                            fk_categoryId: 4
                        },
                        {
                            created: {
                                gte: new Date(lastDate)
                            },
                        }
                    ]

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
                ServiceOrderDetail: {
                    select: {
                        id_serviceOrderDetail: true,
                        units: true,
                        subtotal: true,
                        DrycleanService: {
                            select: {
                                description: true,
                                price: true,
                                priceCredit: true,
                            },
                        },
                    },
                },
                payment: true,
            },
        });
        res.status(201).json(response);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const getOrderOtherService = async (req, res) => {
    let lastDate = (moment().subtract(90, 'days').startOf('day').toISOString())

    try {
        const response = await prisma.serviceOrder.findMany({
            where: {
                AND:
                    [
                        {
                            fk_categoryId: 5
                        },
                        {
                            created: {
                                gte: new Date(lastDate)
                            },
                        }
                    ]

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
                ServiceOrderDetail: {
                    select: {
                        id_serviceOrderDetail: true,
                        units: true,
                        subtotal: true,
                        OtherService: {
                            select: {
                                description: true,
                                price: true,
                                priceCredit: true,
                            },
                        },
                    },
                },
                payment: true,
            },
        });
        res.status(201).json(response);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const getOrdersLaundryFinished = async (req, res) => {
    try {
        const response = await prisma.serviceOrder.findMany({
            where: {
                AND: [
                    {
                        orderStatus: "finished",
                    },
                    {
                        fk_categoryId: 2
                    }

                ]

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
                ServiceOrderDetail: {
                    select: {
                        id_serviceOrderDetail: true,
                        units: true,
                        subtotal: true,
                        LaundryService: {
                            select: {
                                description: true,
                                price: true,
                                priceCredit: true,
                            },
                        },
                    },
                },
                payment: true,
            },
        });
        res.status(201).json(response);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const getOrdersIronFinished = async (req, res) => {
    try {
        const response = await prisma.serviceOrder.findMany({
            where: {
                AND: [
                    {
                        orderStatus: "finished",
                    },
                    {
                        fk_categoryId: 3
                    }

                ]
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
                ServiceOrderDetail: {
                    select: {
                        id_serviceOrderDetail: true,
                        units: true,
                        subtotal: true,
                        IronService: {
                            select: {
                                description: true,
                                price: true,
                                priceCredit: true,
                            },
                        },
                    },
                },
                payment: true,
            },
        });
        res.status(201).json(response);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const getOrdersDrycleanFinished = async (req, res) => {
    try {
        const response = await prisma.serviceOrder.findMany({
            where: {
                AND: [
                    {
                        orderStatus: "finished",
                    },
                    {
                        fk_categoryId: 4
                    }

                ]
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
                ServiceOrderDetail: {
                    select: {
                        id_serviceOrderDetail: true,
                        units: true,
                        subtotal: true,
                        DrycleanService: {
                            select: {
                                description: true,
                                price: true,
                                priceCredit: true,
                            },
                        },
                    },
                },
                payment: true,
            },
        });
        res.status(201).json(response);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const getOrdersOtherServiceFinished = async (req, res) => {
    try {
        const response = await prisma.serviceOrder.findMany({
            where: {
                AND: [
                    {
                        orderStatus: "finished",
                    },
                    {
                        fk_categoryId: 5
                    }

                ]
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
                ServiceOrderDetail: {
                    select: {
                        id_serviceOrderDetail: true,
                        units: true,
                        subtotal: true,
                        OtherService: {
                            select: {
                                description: true,
                                price: true,
                                priceCredit: true,
                            },
                        },
                    },
                },
                payment: true,
            },
        });
        res.status(201).json(response);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const getCancelableOrders = async (req, res) => {
    let lastDate = (moment().subtract(180, 'days').startOf('day').toISOString()) //dejar 365 solo temporal
    console.log(lastDate)
    try {
        const response = await prisma.serviceOrder.findMany({

            where: {

                AND: [
                    {
                        created: {
                            gte: new Date(lastDate)
                        }
                    },
                    {
                        orderStatus: "pending"
                    }
                ],
            },

            select: {
                id_order: true,
                totalPrice: true,
                orderStatus: true,
                payStatus: true,
                client: {
                    select: {
                        name: true,
                        firstLN: true,
                        secondLN: true
                    }
                },

                user: {
                    select: {
                        name: true,
                        firstLN: true,
                        secondLN: true
                    }
                }
            }
        });

        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}

export const getCancelledOrders = async (req, res) => {
    let lastDate = (moment().subtract(90, 'days').startOf('day').toISOString()) //dejar 365 solo temporal
    console.log(lastDate)
    try {
        const response = await prisma.cancelledServiceOrder.findMany({

            where: {

                created: {
                    gte: new Date(lastDate)
                }
            },

        });

        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}

export const createOrder = async (req, res) => {

    try {
        const serviceOrder = await prisma.serviceOrder.create({
            data: req.body

        });
        res.status(201).json(serviceOrder);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const createOrderMany = async (req, res) => {

    try {
        const orderMany = await prisma.serviceOrder.createMany({
            data: req.body

        });
        res.status(201).json(orderMany);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const createLaudryServiceOrder = async (req, res) => {

    try {

        const laundryDetail = [];
        const serviceOrder = await prisma.serviceOrder.create({

            data: req.body.serviceOrder,

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
        console.log(serviceOrder.id_order);
        console.log(serviceOrder.client);

        const serviceDetail = req.body.services.map(item => ({ fk_laundryService: item.fk_Service, units: item.units, subtotal: item.subtotal, fk_serviceOrder: serviceOrder.id_order }))
        console.log(serviceDetail);

        const serviceQueue = serviceDetail.map((item, index) => ({
            fk_laundryService: item.fk_laundryService, units: item.units, subtotal: item.subtotal, fk_idServiceOrder: serviceOrder.id_order
        }));

        console.log(serviceQueue);

        const services = req.body.services;
        const serviceOrderDetail = await prisma.serviceOrderDetail.createMany({

            data: serviceDetail


        });

        console.log(serviceOrderDetail);
        var i = 0;
        var series = 1;
        //const{id_service,quantity,price,category_id}=services;
        //id_description: (serviceOrder.id_order.toString() + "-" + (series + 1).toString()
        while (serviceQueue.length > i) {
            var j = 0;
            while (serviceQueue.at(i).units > j) {

                const laundryQueue = await prisma.laundryQueue.create({
                    data: {
                        id_description: (serviceQueue.at(i).fk_idServiceOrder.toString() + "-" + series.toString()),
                        fk_laundryService: serviceQueue.at(i).fk_laundryService,
                        fk_idServiceOrder: serviceQueue.at(i).fk_idServiceOrder,
                        WashDetail: {
                            create: {
                                fk_idWashMachine: null,
                                fk_idStaffMember: null,
                            },
                        },

                        DryDetail: {
                            create: {
                                fk_idDryMachine: null,
                                fk_idStaffMember: null,
                            },
                        },
                    },
                });
                laundryDetail.push(laundryQueue);
                j++;
                series++;
            }



            i++;
        }


        const response = {

            "serviceOrder": serviceOrder,
            "orderDetail": laundryDetail,

        }

        res.status(201).json(response);

    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const createOtherServiceOrder = async (req, res) => {

    try {

        const otherDetail = [];
        const serviceOrder = await prisma.serviceOrder.create({

            data: req.body.serviceOrder,

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
        console.log(serviceOrder.id_order);

        const serviceDetail = req.body.services.map(item => ({ fk_otherService: item.fk_Service, units: item.units, subtotal: item.subtotal, fk_serviceOrder: serviceOrder.id_order }))
        console.log(serviceDetail);

        const serviceQueue = serviceDetail.map((item, index) => ({
            fk_otherService: item.fk_otherService, units: item.units, subtotal: item.subtotal, fk_idServiceOrder: serviceOrder.id_order
        }));

        console.log(serviceQueue);

        const services = req.body.services;
        const serviceOrderDetail = await prisma.serviceOrderDetail.createMany({

            data: serviceDetail


        });

        console.log(serviceOrderDetail);
        var i = 0;
        var series = 1;
        //const{id_service,quantity,price,category_id}=services;
        //id_description: (serviceOrder.id_order.toString() + "-" + (series + 1).toString()
        while (serviceQueue.length > i) {
            var j = 0;
            while (serviceQueue.at(i).units > j) {

                const otherQueue = await prisma.otherQueue.create({
                    data: {
                        id_description: (serviceQueue.at(i).fk_idServiceOrder.toString() + "-" + series.toString()),
                        fk_idOtherService: serviceQueue.at(i).fk_otherService,
                        fk_idServiceOrder: serviceQueue.at(i).fk_idServiceOrder,

                    },
                });
                otherDetail.push(otherQueue);
                j++;
                series++;
            }



            i++;
        }


        const response = {

            "serviceOrder": serviceOrder,
            "orderDetail": otherDetail,

        }

        res.status(201).json(response);

    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const createSelfServiceOrder = async (req, res) => {

    try {

        const selfServiceDetail = [];
        const serviceOrder = await prisma.serviceOrder.create({

            data: req.body.serviceOrder,

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
        console.log(serviceOrder.id_order);

        const serviceDetail = req.body.services.map(item => ({ fk_selfService: item.fk_Service, units: item.units, subtotal: item.subtotal, fk_serviceOrder: serviceOrder.id_order }))
        console.log(serviceDetail);

        const serviceQueue = serviceDetail.map((item, index) => ({
            fk_selfService: item.fk_selfService, units: item.units, subtotal: item.subtotal, fk_idServiceOrder: serviceOrder.id_order
        }));

        console.log(serviceQueue);

        const services = req.body.services;
        const serviceOrderDetail = await prisma.serviceOrderDetail.createMany({

            data: serviceDetail


        });

        console.log(serviceOrderDetail);
        var i = 0;
        var series = 1;
        //const{id_service,quantity,price,category_id}=services;
        //id_description: (serviceOrder.id_order.toString() + "-" + (series + 1).toString()
        while (serviceQueue.length > i) {
            var j = 0;
            while (serviceQueue.at(i).units > j) {

                const selfServiceQueue = await prisma.selfServiceQueue.create({
                    data: {
                        id_description: (serviceQueue.at(i).fk_idServiceOrder.toString() + "-" + series.toString()),
                        fk_selfService: serviceQueue.at(i).fk_selfService,
                        fk_idServiceOrder: serviceQueue.at(i).fk_idServiceOrder,
                    },
                });
                selfServiceDetail.push(selfServiceQueue);
                j++;
                series++;
            }



            i++;
        }


        const response = {

            "serviceOrder": serviceOrder,
            "orderDetail": selfServiceDetail,

        }

        res.status(201).json(response);

    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const createIronServiceOrder = async (req, res) => {

    try {

        const ironServiceDetail = [];
        const serviceOrder = await prisma.serviceOrder.create({

            data: req.body.serviceOrder,

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
        console.log(serviceOrder.id_order);

        const serviceDetail = req.body.services.map(item => ({ fk_ironService: item.fk_Service, units: item.units, subtotal: item.subtotal, fk_serviceOrder: serviceOrder.id_order }))
        console.log(serviceDetail);

        const serviceQueue = serviceDetail.map((item, index) => ({
            fk_ironService: item.fk_ironService, units: item.units, subtotal: item.subtotal, fk_idServiceOrder: serviceOrder.id_order
        }));

        console.log(serviceQueue);

        const services = req.body.services;
        const serviceOrderDetail = await prisma.serviceOrderDetail.createMany({

            data: serviceDetail


        });

        console.log(serviceOrderDetail);
        var i = 0;
        var series = 1;
        //const{id_service,quantity,price,category_id}=services;
        //id_description: (serviceOrder.id_order.toString() + "-" + (series + 1).toString()
        while (serviceQueue.length > i) {
            var j = 0;
            while (serviceQueue.at(i).units > j) {

                const ironQueue = await prisma.ironQueue.create({
                    data: {
                        //id_description: (serviceQueue.at(i).fk_idServiceOrder.toString()+"-"+series.toString()),
                        id_description: (serviceQueue.at(i).fk_idServiceOrder.toString()),
                        fk_idIronService: serviceQueue.at(i).fk_ironService,
                        fk_idServiceOrder: serviceQueue.at(i).fk_idServiceOrder,
                    },
                });
                ironServiceDetail.push(ironQueue);
                j++;
                series++;
            }



            i++;
        }


        const response = {

            "serviceOrder": serviceOrder,
            "orderDetail": ironServiceDetail,

        }

        res.status(201).json(response);

    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const createDrycleanServiceOrder = async (req, res) => {

    try {

        const drycleanServiceDetail = [];
        const serviceOrder = await prisma.serviceOrder.create({

            data: req.body.serviceOrder,

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
        console.log(serviceOrder.id_order);

        const serviceDetail = req.body.services.map(item => ({ fk_drycleanService: item.fk_Service, units: item.units, subtotal: item.subtotal, fk_serviceOrder: serviceOrder.id_order }))
        console.log(serviceDetail);

        const serviceQueue = serviceDetail.map((item, index) => ({
            fk_drycleanService: item.fk_drycleanService, units: item.units, subtotal: item.subtotal, fk_idServiceOrder: serviceOrder.id_order
        }));

        console.log(serviceQueue);

        const services = req.body.services;
        const serviceOrderDetail = await prisma.serviceOrderDetail.createMany({

            data: serviceDetail


        });

        console.log(serviceOrderDetail);
        var i = 0;
        var series = 1;
        //const{id_service,quantity,price,category_id}=services;
        //id_description: (serviceOrder.id_order.toString() + "-" + (series + 1).toString()
        while (serviceQueue.length > i) {
            var j = 0;
            while (serviceQueue.at(i).units > j) {

                const drycleanQueue = await prisma.drycleanQueue.create({
                    data: {
                        //id_description: (serviceQueue.at(i).fk_idServiceOrder.toString()+"-"+series.toString()),
                        id_description: (serviceQueue.at(i).fk_idServiceOrder.toString()),
                        fk_idDrycleanService: serviceQueue.at(i).fk_drycleanService,
                        fk_idServiceOrder: serviceQueue.at(i).fk_idServiceOrder,
                    },
                });
                drycleanServiceDetail.push(drycleanQueue);
                j++;
                series++;
            }



            i++;
        }


        const response = {

            "serviceOrder": serviceOrder,
            "orderDetail": drycleanServiceDetail,

        }

        res.status(201).json(response);

    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const updateStoredOrders = async (req, res) => {

    let lastDate = (moment().subtract(60, 'days').startOf('day').toISOString())
    console.log(lastDate)
    try {
        const orderStored = await prisma.serviceOrder.updateMany({

            where: {
                AND: [
                    {
                        created: {
                            lte: new Date(lastDate)
                        },
                    },
                    {
                        orderStatus: "finished"
                    }


                ]

            },
            data: {
                orderStatus: "stored"
            }
        });
        res.status(200).json(orderStored);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const updateCancelledOrder = async (req, res) => {

    const { id_order, cause } = req.body;

    try {


        const getOrderDetail = prisma.serviceOrderDetail.findMany({

            where: {
                fk_serviceOrder: Number(id_order)
            },

            select: {
                fk_serviceOrder: true,
                units: true,
                subtotal: true,
                fk_laundryService: true,
                fk_selfService: true,
                fk_ironService: true,
                fk_drycleanService: true,
                fk_otherService: true
            },
        });

        const getCurrentCashCut = prisma.cashCut.findFirst({

            select: {
                fk_user: true,
                id_cashCut: true,

            }

        });

        const getOrderData = prisma.serviceOrder.findFirst({

            where: {
                id_order: Number(id_order)
            },

            select: {
                id_order: true,
                totalPrice: true,
                payStatus: true,
                ironPieces: true,
                drycleanPieces: true,
                express: true,

                category: {
                    select: {
                        categoryDescription: true,
                        id_category: true,
                    },
                },
            },
        });

        const getPaymentData = prisma.payment.findFirst({
            where: {
                fk_idOrder: Number(id_order)
            },

            select: {
                payMethod: true,
                fk_cashCut: true,
                payTotal: true
            },

        });


        const getIronControl = prisma.ironControl.findFirst({

            select: {
                id_ironControl: true
            },

        });

        const [cashCutData, orderData, orderDetail, paymentData, ironControlData] = await prisma.$transaction([getCurrentCashCut, getOrderData, getOrderDetail, getPaymentData, getIronControl])

        let payTotal = paymentData == null ? 0 : paymentData.payTotal;
        let cancelationTypeDefinition = orderData.payStatus == "paid" ? "refund" : "cancellation";
        let regularIronPieces = 0;
        let expressIronPieces = 0;
        let drycleanPieces = 0;
        let cancelledOrder;

        if (orderData.express)
            expressIronPieces = orderData.ironPieces + 0;
        else
            regularIronPieces = orderData.ironPieces + 0;

        if (drycleanPieces != null)
            drycleanPieces = orderData.drycleanPieces + 0;

        const createCancelledOrderDetail = prisma.cancelledServiceOrderDetail.createMany({
            data: orderDetail
        });

        const createCancelledOrderRecord = prisma.cancelledServiceOrder.create({
            data: {
                fk_idServiceOrder: orderData.id_order,
                fk_user: cashCutData.fk_user,
                amount: orderData.totalPrice,
                cause: cause,
                CancellationTypes: cancelationTypeDefinition
            }
        });

        const updateCancelledOrderDetail = prisma.serviceOrderDetail.updateMany({

            where: {
                fk_serviceOrder: Number(id_order)
            },

            data: {
                cancelled: true,
            }

        });

        const updateCancelledOrderStatus = prisma.serviceOrder.update({

            where: {
                id_order: Number(id_order)
            },

            data: {
                orderStatus: "cancelled"
            }

        });

        const updateIronControl = prisma.ironControl.updateMany({
            where: {
                id_ironControl: ironControlData.id_ironControl
            },

            data: {
                piecesLeft: {
                    decrement: Number(regularIronPieces),
                },
                piecesExpress: {
                    decrement: Number(expressIronPieces),
                }
            }

        })

        const cancelLaundryQueue = prisma.laundryQueue.deleteMany({
            where: {
                fk_idServiceOrder: Number(id_order)
            },

        })

        const cancelSelfServiceQueue = prisma.selfServiceQueue.deleteMany({
            where: {
                fk_idServiceOrder: Number(id_order)
            },

        })

        const cancelIronQueue = prisma.ironQueue.deleteMany({
            where: {
                fk_idServiceOrder: Number(id_order)
            },

        })

        const cancelDrycleanQueue = prisma.drycleanQueue.deleteMany({
            where: {
                fk_idServiceOrder: Number(id_order)
            },

        })

        const cancelOtherQueue = prisma.otherQueue.deleteMany({
            where: {
                fk_idServiceOrder: Number(id_order)
            },

        })

        const refoundPayment = prisma.cashWithdrawal.create({

            data: {
                fk_cashCut: cashCutData.id_cashCut,
                fk_user: cashCutData.fk_user,
                cashWithdrawalType: "service_cancelled",
                amount: payTotal,
                cause: "Orden Cancelada",
                serviceOrder: orderData.id_order,
                date: new Date(),
            }

        });

        const cancelPayment = prisma.payment.update({

            where: {
                fk_idOrder: Number(id_order)
            },

            data: {
                cancelled: true
            }

        });



        if (cancelationTypeDefinition === "refund") {
            console.log("que la chingada")

            const [cancelledOrderDetail, cancelledOrderRecord, updatedOrderDetail, updatedOrderStatus, updatedIronControl, updatedLaundryQueue, updatedSelfServiceQueue, updatedIronQueue, updatedDrycleanQueue, updatedOtherQueue, refound] =
                await prisma.$transaction
                    ([createCancelledOrderDetail,
                        createCancelledOrderRecord,
                        updateCancelledOrderDetail,
                        updateCancelledOrderStatus,
                        updateIronControl,
                        cancelLaundryQueue,
                        cancelSelfServiceQueue,
                        cancelIronQueue,
                        cancelDrycleanQueue,
                        cancelOtherQueue,
                        refoundPayment,
                        cancelPayment])
            cancelledOrder = cancelledOrderRecord;
        }
        if (cancelationTypeDefinition === "cancellation") {
            console.log("que la chingada2")
            const [cancelledOrderDetail, cancelledOrderRecord, updatedOrderDetail, updatedOrderStatus, updatedIronControl, updatedLaundryQueue, updatedSelfServiceQueue, updatedIronQueue, updatedDrycleanQueue, updatedOtherQueue] =
                await prisma.$transaction
                    ([createCancelledOrderDetail,
                        createCancelledOrderRecord,
                        updateCancelledOrderDetail,
                        updateCancelledOrderStatus,
                        updateIronControl,
                        cancelLaundryQueue,
                        cancelSelfServiceQueue,
                        cancelIronQueue,
                        cancelDrycleanQueue,
                        cancelOtherQueue
                    ])
            cancelledOrder = cancelledOrderRecord;
        }

        const response = cancelledOrder;


        res.status(200).json(response);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const updateOrder = async (req, res) => {

    try {
        const serviceOrder = await prisma.serviceOrder.update({
            where: {
                id_order: Number(req.params.id)
            },
            data: req.body
        });
        res.status(200).json(serviceOrder);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}

export const deleteOrder = async (req, res) => {
    try {
        const serviceOrder = await prisma.serviceOrder.delete({
            where: {
                id_order: Number(req.params.id)
            }
        });
        res.status(200).json(serviceOrder);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const deleteOrderAll = async (req, res) => {
    try {
        const serviceOrder = await prisma.serviceOrder.deleteMany({});
        res.status(200).json(serviceOrder);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}