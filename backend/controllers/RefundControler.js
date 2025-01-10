import { PrismaClient } from "@prisma/client";
import moment from 'moment'
moment.locale('es-mx');

const prisma = new PrismaClient();


export const getRefunds = async (req, res) => {
    try {
        const response = await prisma.refund.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
            },
        }
        );
        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}

export const getActiveRefunds = async (req, res) => {
    try {

        let lastDate = (moment().subtract(180, 'days').startOf('day').toISOString())

        const response = await prisma.refund.findMany({

            where: {
                created: {
                    gte: new Date(lastDate)
                },
            },

            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
            },
        }
        );
        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}

export const getRefundById = async (req, res) => {
    try {
        const response = await prisma.refund.findUnique({
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
            },
            where: {
                id_refund: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}

export const createRefund = async (req, res) => {

    try {

        let refund;

        const findOrder = await prisma.serviceOrder.findFirst({
            where: {
                id_order: Number(req.body.serviceOrder)
            }
        });

        const validationExistRefund = await prisma.refund.findFirst({
            where: {
                serviceOrder: Number(req.body.serviceOrder)
            }
        });


        if (validationExistRefund == null && findOrder.orderStatus.toString() == "finished" && findOrder.payStatus.toString == "paid") {

            const createRefund = await prisma.refund.create({
                data: req.body
            });

            const updateOrderStatus = await prisma.serviceOrder.update({
                where: {
                    id_order: Number(findOrder.id_order)
                },

                data: {
                    orderStatus: "cancelled"
                }

            });

            const cancelPayment = prisma.payment.update({

                where: {
                    fk_idOrder: Number(findOrder.id_order)
                },
    
                data: {
                    cancelled: true
                }
            });

            refund = createRefund;

            res.status(201).json(refund);
        }
        refund = null;
        res.status(200).json(refund);

    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const validationRefund = async (req, res) => {

    try {

        let lastDate = (moment().subtract(30, 'days').startOf('day').toISOString())

        const findOrder = await prisma.serviceOrder.findFirst({
            where: {
                AND: [
                    {
                        id_order: Number(req.params.id)
                    },
                    {
                        updatedAt: {
                            gte: new Date(lastDate)
                        },
                    },
                    {
                        orderStatus: "finished"
                    },
                    {
                        payStatus: "paid"
                    }
                ]
            },

            select: {
                totalPrice: true
            }
        });

        res.status(200).json(findOrder);

    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const updateRefund = async (req, res) => {
    try {
        const refund = await prisma.refund.update({
            where: {
                id_refund: Number(req.params.id)
            },

            data: req.body
        });
        res.status(200).json(refund);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const deleteRefund = async (req, res) => {
    try {
        const refund = await prisma.refund.delete({
            where: {
                id_refund: Number(req.params.id)
            },
        });
        res.status(200).json(refund);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}