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
                                phone: true,
                                email: true,
                            },
                        },

                        notes: true,
                    },
                },
                WashDetail: {
                    select: {
                        id_washDetail: true,
                        fk_laundryEvent: true,
                        fk_idStaffMember: true,
                        Machine: {
                            select: {
                                ipAddress: true,
                                id_machine: true,
                                model: true,
                            }
                        },
                    },
                },
                DryDetail: {
                    select: {
                        id_dryDetail: true,
                        fk_laundryEvent: true,
                        fk_idStaffMember: true,
                        Machine: {
                            select: {
                                ipAddress: true,
                                id_machine: true,
                                model: true,
                            }
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


export const getLaundryQueueById = async (req, res) => {
    try {
        const response = await prisma.laundryQueue.findUnique({
            where: {
                id_laundryEvent: Number(req.params.id)
            },

            include: {

                WashDetail: true,
                DryDetail: true,
            },
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
        const laundryEvents = await prisma.laundryQueue.createMany({
            data: req.body

        });
        res.status(201).json(laundryEvents);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const updateLaundryQueue = async (req, res) => {
    try {
        const laundryEvent = await prisma.laundryQueue.update({
            where: {
                id_laundryEvent: Number(req.params.id)
            },

            data: req.body
        });
        res.status(200).json(laundryEvent);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const updateWashDetails = async (req, res) => {

    try {
        const washDetail = await prisma.washDetail.update({
            where: {
                fk_laundryEvent: Number(req.params.id)
            },

            data: req.body
        });

        const laundryEvent = await prisma.laundryQueue.update({
            where: {
                id_laundryEvent: Number(req.params.id)
            },

            data: {
                serviceStatus: "inProgressWash"
            }
        });

        res.status(200).json(washDetail);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }

}

export const updateDryDetails = async (req, res) => {

    try {
        const dryDetail = await prisma.dryDetail.update({
            where: {
                fk_laundryEvent: Number(req.params.id)
            },

            data: req.body
        });

        const laundryEvent = await prisma.laundryQueue.update({
            where: {
                id_laundryEvent: Number(req.params.id)
            },

            data: {
                serviceStatus: "inProgressDry"
            }
        });
        res.status(200).json(dryDetail);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }

}

export const finishLaundryQueue = async (req, res) => {
    try {
        const laundryEvent = await prisma.laundryQueue.update({
            where: {
                id_laundryEvent: Number(req.params.id)
            },

            data: {
                serviceStatus: "finished"
            }
        });

        const serviceOrderFinished = await prisma.laundryQueue.findMany({
            where: {
                AND: [
                    {
                        fk_idServiceOrder: laundryEvent.fk_idServiceOrder
                    },
                    {
                        OR: [
                            {
                                serviceStatus: "inProgress"
                            },
                            {
                                serviceStatus: "pending"
                            }
                        ]
                    },
                ],
            },
        })

        var response;
        if (serviceOrderFinished.length === 0) {

            const serviceOrder = await prisma.serviceOrder.update({

                where: {
                    id_order: laundryEvent.fk_idServiceOrder
                },
                data: {
                    orderStatus: "finished"
                }
            });

            response = {
                "id_order ": serviceOrder.id_order,
                "orderStatus": "finished"
            };

        } else {

            response = {
                "id_order ": laundryEvent.fk_idServiceOrder,
                "orderStatus": "inProgress"
            };

        }

        ///incluir en response un valor que diga si el pedido termino

        res.status(200).json(response);
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
                                phone: true,
                                email: true,
                            },
                        },

                        notes: true,
                    },
                },
                //WashDetail:true,
                //DryDetail:true,
                machine: {
                    select: {
                        ipAddress: true,
                        id_machine: true,
                        model: true,
                    }
                },
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
                id_serviceEvent: Number(req.params.id)
            },
            include: {
                machine: {
                    select: {
                        ipAddress: true,
                        id_machine: true,
                        model: true,
                    }
                },
            }
        });
        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}

export const getSelfServiceQueueByOrderId = async (req, res) => {
    try {
        const response = await prisma.selfServiceQueue.findUnique({
            where: {
                fk_idServiceOrder: Number(req.params.fk_Order)
            }
        });
        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}

export const createManySelfServiceQueue = async (req, res) => {

    try {
        const selfServiceEvent = await prisma.selfServiceQueue.createMany({
            data: req.body

        });
        res.status(201).json(selfServiceEvent);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const updateSelfServiceQueue = async (req, res) => {
    try {
        const selfServiceEvent = await prisma.selfServiceQueue.update({
            where: {
                id_serviceEvent: Number(req.params.id)
            },

            data: req.body
        });
        res.status(200).json(selfServiceEvent);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const updateStartSelfServiceQueue = async (req, res) => {

    try {
        const startSelfService = await prisma.selfServiceQueue.update({
            where: {
                id_serviceEvent: Number(req.params.id)
            },

            data: {

                fk_idMachine: req.body.fk_idMachine,
                serviceStatus: "inProgress"

            }
        });

        res.status(200).json(startSelfService);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }

}

export const updateFinishSelfServiceQueue = async (req, res) => {

    try {

        const selfServiceEvent = await prisma.selfServiceQueue.update({
            where: {
                id_serviceEvent: Number(req.params.id)
            },

            data: {
                serviceStatus: "finished"
            }
        });

        const serviceOrderFinished = await prisma.selfServiceQueue.findMany({
            where: {
                AND: [
                    {
                        fk_idServiceOrder: selfServiceEvent.fk_idServiceOrder
                    },
                    {
                        OR: [
                            {
                                serviceStatus: "inProgress"
                            },
                            {
                                serviceStatus: "pending"
                            }
                        ]
                    },
                ],
            },
        })

        var response;
        if (serviceOrderFinished.length === 0) {

            const serviceOrder = await prisma.serviceOrder.update({

                where: {
                    id_order: selfServiceEvent.fk_idServiceOrder
                },
                data: {
                    orderStatus: "delivered"
                }
            });

            response = {
                "id_order ": serviceOrder.id_order,
                "orderStatus": "delivered"
            };

        } else {

            response = {
                "id_order ": selfServiceEvent.fk_idServiceOrder,
                "orderStatus": "inProgress"
            };

        }

        res.status(200).json(response);
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
                client: {
                    select: {
                        name: true,
                        firstLN: true,
                        secondLN: true,
                        phone: true,
                        email: true,
                    },
                },
                notes: true,


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
                id_ironEvent: Number(req.params.id)
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
                fk_idServiceOrder: Number(req.params.fk_Order)
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

export const startIronQueue = async (req, res) => {

    try {
        const { fk_idStaffMember, fk_idIronStation } = req.body;
        const startIronQueue = await prisma.ironQueue.updateMany({
            where: {
                fk_idServiceOrder: Number(req.params.id)
            },

            data: {
                fk_idIronStation: fk_idIronStation,
                fk_idStaffMember: fk_idStaffMember,
                serviceStatus: "inProgress"
            }
        });

        const serviceOrder = await prisma.serviceOrder.update({
            where: {
                id_order: Number(req.params.id)
            },

            data: {
                orderStatus: "inProgress"
            }
        });

        res.status(200).json(startIronQueue);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }

}

export const finishIronQueue = async (req, res) => {

    try {

        const { fk_idStaffMember, fk_idIronStation } = req.body;
        const finishIronQueue = await prisma.ironQueue.updateMany({
            where: {
                fk_idServiceOrder: Number(req.params.id)
            },

            data: {
                serviceStatus: "finished"
            }
        });

        const serviceOrder = await prisma.serviceOrder.update({
            where: {
                id_order: Number(req.params.id)
            },

            data: {
                orderStatus: "finished"
            }
        });
        res.status(200).json(finishIronQueue);
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


export const getDrycleanQueue = async (req, res) => {
    try {
        const response = await prisma.serviceOrder.findMany({
            where: {

                fk_categoryId: 4
            },

            select: {
                id_order: true,
                orderStatus: true,
                scheduledDeliveryDate: true,
                drycleanPieces: true,
                express: true,
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
                client: {
                    select: {
                        name: true,
                        firstLN: true,
                        secondLN: true,
                        phone: true,
                        email: true,
                    },
                },
                notes: true,

            },
        });
        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}

export const getDrycleanQueueById = async (req, res) => {
    try {
        const response = await prisma.drycleanQueue.findUnique({
            where: {
                id_drycleanEvent: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}

export const getDrycleanQueueByOrderId = async (req, res) => {
    try {
        const response = await prisma.drycleanQueue.findMany({
            where: {
                fk_idServiceOrder: Number(req.params.fk_Order)
            }
        });
        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}

export const createManyDrycleanQueue = async (req, res) => {

    try {
        const drycleanEvent = await prisma.drycleanQueue.createMany({
            data: req.body

        });
        res.status(201).json(ironEvent);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const updateDrycleanQueue = async (req, res) => {
    try {
        const id_drycleanEvent = await prisma.drycleanQueue.update({
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

export const deliveryDrycleanQueue = async (req, res) => {

    try {
        const { fk_idStaffMember } = req.body;
        const deliveryDrycleanQueue = await prisma.drycleanQueue.updateMany({
            where: {
                fk_idServiceOrder: Number(req.params.id)
            },

            data: {
                fk_idStaffMember: fk_idStaffMember,
                serviceStatus: "inProgress"
            }
        });

        const serviceOrder = await prisma.serviceOrder.update({
            where: {
                id_order: Number(req.params.id)
            },

            data: {
                orderStatus: "inProgress"
            }
        });

        res.status(200).json(deliveryDrycleanQueue);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }

}

export const receptionDrycleanQueue = async (req, res) => {

    try {

        //const { fk_idStaffMember, fk_idIronStation } = req.body;
        const finishDrycleanQueue = await prisma.drycleanQueue.updateMany({
            where: {
                fk_idServiceOrder: Number(req.params.id)
            },

            data: {
                serviceStatus: "finished"
            }
        });

        const serviceOrder = await prisma.serviceOrder.update({
            where: {
                id_order: Number(req.params.id)
            },

            data: {
                orderStatus: "finished"
            }
        });
        res.status(200).json(finishDrycleanQueue);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }

}

export const deleteDrycleanQueue = async (req, res) => {
    try {
        const id_drycleanEvent = await prisma.drycleanQueue.delete({
            where: {
                id_drycleanEvent: Number(req.params.id)
            }
        });
        res.status(200).json(id_drycleanEvent);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}



export const getOtherQueue = async (req, res) => {
    try {
        const response = await prisma.otherQueue.findMany({


            include: {
                otherService: true,
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
                                phone: true,
                                email: true,
                            },
                        },

                        notes: true,
                    },
                },
                //WashDetail:true,
                //DryDetail:true,
                machine: {
                    select: {
                        ipAddress: true,
                        id_machine: true,
                        model: true,
                    },
                },
            },

        });
        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}

export const getOtherQueueById = async (req, res) => {
    try {
        const response = await prisma.otherQueue.findUnique({
            where: {
                id_otherEvent: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}

export const getOtherQueueByOrderId = async (req, res) => {
    try {
        const response = await prisma.otherQueue.findUnique({
            where: {
                fk_idServiceOrder: Number(req.params.fk_Order)
            }
        });
        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}

export const createManyOtherQueue = async (req, res) => {

    try {
        const otherEvent = await prisma.otherQueue.createMany({
            data: req.body

        });
        res.status(201).json(otherEvent);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const updateOtherQueue = async (req, res) => {
    try {
        const selfServiceEvent = await prisma.otherQueue.update({
            where: {
                id_otherEvent: Number(req.params.id)
            },

            data: req.body
        });
        res.status(200).json(selfServiceEvent);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const updateStartOtherQueue = async (req, res) => {

    try {
        const startOtherService = await prisma.otherQueue.update({
            where: {
                id_otherEvent: Number(req.params.id)
            },

            data: {

                fk_idStaffMember: req.body.fk_idStaffMember,
                serviceStatus: "inProgress"

            }
        });

        res.status(200).json(startOtherService);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }

}

export const updateFinishOtherQueue = async (req, res) => {

    try {

        const otherServiceEvent = await prisma.otherQueue.update({
            where: {
                id_otherEvent: Number(req.params.id)
            },

            data: {
                serviceStatus: "finished"
            }
        });

        const serviceOrderFinished = await prisma.otherQueue.findMany({
            where: {
                AND: [
                    {
                        fk_idServiceOrder: otherServiceEvent.fk_idServiceOrder
                    },
                    {
                        OR: [
                            {
                                serviceStatus: "inProgress"
                            },
                            {
                                serviceStatus: "pending"
                            }
                        ]
                    },
                ],
            },
        })

        var response;
        if (serviceOrderFinished.length === 0) {

            const serviceOrder = await prisma.serviceOrder.update({

                where: {
                    id_order: otherServiceEvent.fk_idServiceOrder
                },
                data: {
                    orderStatus: "finished"
                }
            });

            response = {
                "id_order ": serviceOrder.id_order,
                "orderStatus": "finished"
            };

        } else {

            response = {
                "id_order ": otherServiceEvent.fk_idServiceOrder,
                "orderStatus": "inProgress"
            };

        }

        res.status(200).json(response);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }

}

export const deleteOtherQueue = async (req, res) => {
    try {
        const id_otherEvent = await prisma.otherQueue.delete({
            where: {
                id_otherEvent: Number(req.params.id)
            }
        });
        res.status(200).json(id_otherEvent);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}
