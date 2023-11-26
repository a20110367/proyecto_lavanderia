import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

///Revisar comprotamiento y dependencias
export const getLaundryQueue = async (req, res) => {
    try {
        const response = await prisma.laundryQueue.findMany({
            include: {
                LaundryService: true,
                serviceOrder: {
                    select: {
                        user: {
                            select: {
                                name: true,
                                firstLN: true,
                                secondLN: true,
                            },
                        },
                        client: {
                            select: {
                                name: true,
                                firstLN: true,
                                secondLN: true,
                            },
                        },
                    },
                },
                //WashDetail:true,
                //DryDetail:true,
            },

        });
        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}


export const getLaundryQueueById = async (req, res) => {
    try {
        const response = await prisma.laundryQueue.findUnique({
            where: {
                id_washEvent: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}

export const getLaundryQueueByOrderId = async (req, res) => {
    try {
        const response = await prisma.laundryQueue.findMany({
            where: {
                fk_idServiceOrder: Number(req.params.fk_ServiceOrder)
            }
        });
        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}

export const createManyLaundryQueue = async (req, res) => {

    try {
        const id_washEvent = await prisma.laundryQueue.createMany({
            data: req.body

        });
        res.status(201).json(id_washEvent);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const updateLaundryQueue = async (req, res) => {
    try {
        const id_washEvent = await prisma.laundryQueue.update({
            where: {
                id_washEvent: Number(req.params.id)
            },

            data: req.body
        });
        res.status(200).json(id_washEvent);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const deleteLaundryQueue = async (req, res) => {
    try {
        const id_washEvent = await prisma.laundryQueue.delete({
            where: {
                id_washEvent: Number(req.params.id)
            }
        });
        res.status(200).json(id_washEvent);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const getSelfServiceQueue = async (req, res) => {
    try {
        const response = await prisma.selfServiceQueue.findMany({


            include: {
                SelfService: true,
                serviceOrder: {
                    select: {
                        user: {
                            select: {
                                name: true,
                                firstLN: true,
                                secondLN: true,
                            },
                        },
                        client: {
                            select: {
                                name: true,
                                firstLN: true,
                                secondLN: true,
                            },
                        },
                    },
                },
                //WashDetail:true,
                //DryDetail:true,
            },

        });
        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}

export const getSelfServiceQueueById = async (req, res) => {
    try {
        const response = await prisma.selfServiceQueue.findUnique({
            where: {
                id_dryEvent: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}

export const getSelfServiceQueueByOrderId = async (req, res) => {
    try {
        const response = await prisma.selfServiceQueue.findMany({
            where: {
                fk_ServiceOrder: Number(req.params.fk_ServiceOrder)
            }
        });
        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}

export const createManySelfServiceQueue = async (req, res) => {

    try {
        const id_dryEvent = await prisma.selfServiceQueue.createMany({
            data: req.body

        });
        res.status(201).json(id_dryEvent);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const updateSelfServiceQueue = async (req, res) => {
    try {
        const id_dryEvent = await prisma.selfServiceQueue.update({
            where: {
                id_dryEvent: Number(req.params.id)
            },

            data: req.body
        });
        res.status(200).json(id_dryEvent);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const deleteSelfServiceQueue = async (req, res) => {
    try {
        const id_dryEvent = await prisma.selfServiceQueue.delete({
            where: {
                id_dryEvent: Number(req.params.id)
            }
        });
        res.status(200).json(id_dryEvent);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const getIronQueue = async (req, res) => {
    try {
        const response = await prisma.serviceOrder.findMany({
            where: {

                fk_categoryId: 3
            },

            select: {
                id_order: true,
                orderStatus: true,
                scheduledDeliveryDate: true,
                ironPieces: true,
                express: true,
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

            },
        });
        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}

export const getIronQueueById = async (req, res) => {
    try {
        const response = await prisma.ironQueue.findUnique({
            where: {
                id_dryEvent: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}

export const getIronQueueByOrderId = async (req, res) => {
    try {
        const response = await prisma.ironQueue.findMany({
            where: {
                fk_ServiceOrder: Number(req.params.fk_ServiceOrder)
            }
        });
        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}

export const createManyIronQueue = async (req, res) => {

    try {
        const ironEvent = await prisma.ironQueue.createMany({
            data: req.body

        });
        res.status(201).json(ironEvent);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const updateIronQueue = async (req, res) => {
    try {
        const id_ironEvent = await prisma.ironQueue.update({
            where: {
                id_ironEvent: Number(req.params.id)
            },

            data: req.body
        });
        res.status(200).json(id_ironEvent);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const deleteIronQueue = async (req, res) => {
    try {
        const id_ironEvent = await prisma.ironQueue.delete({
            where: {
                id_ironEvent: Number(req.params.id)
            }
        });
        res.status(200).json(id_ironEvent);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}