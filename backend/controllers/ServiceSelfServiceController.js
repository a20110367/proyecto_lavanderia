import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const getSelfServices = async (req, res) => {
    try {
        const response = await prisma.selfService.findMany({

            where: {
                deleted: false
            },

            select: {

                id_service: true,
                description: true,
                price: true,
                priceCredit: true,
                weight: true,
                cycleTime: true,
                machineType: true,
                Category: {
                    select: {
                        categoryDescription: true,
                        id_category: true
                    },
                },

            },
        });

        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}

export const getSelfServicesById = async (req, res) => {
    try {
        const response = await prisma.selfService.findUnique({

            where: {
                id_service: Number(req.params.id)
            },

            select: {

                id_service: true,
                description: true,
                price: true,
                priceCredit: true,
                weight: true,
                cycleTime: true,
                machineType: true,
                Category: {
                    select: {
                        categoryDescription: true,
                        id_category: true
                    },
                },

            },
        });

        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}


export const createSelfService = async (req, res) => {

    try {

        let selfService;

        const selfServiceStatus = await prisma.selfService.findFirst({
            where: {
                description: req.body.description
            }
        });

        if (selfServiceStatus == null) {
            const selfServiceNew = await prisma.selfService.create({
                data: req.body
            });

            selfService = selfServiceNew;

            res.status(201).json(selfService);

        }
        else {
            const selfServiceReactivation = await prisma.selfService.update({
                where: {
                    description: req.body.description
                },
                data: {
                    price: req.body.price,
                    priceCredit: req.body.priceCredit,
                    weight: req.body.weight,
                    cycleTime: req.body.cycleTime,
                    machineType: req.body.machineType,
                    deleted: false
                }
            });

            selfService = selfServiceReactivation;

            res.status(201).json(selfService);
        }

    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const createSelfServiceMany = async (req, res) => {
    try {
        const selfServiceMany = await prisma.selfService.createMany({
            data: req.body
        });
        res.status(201).json(selfServiceMany);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const updateSelfService = async (req, res) => {

    try {
        const selfService = await prisma.selfService.update({
            where: {
                id_service: Number(req.params.id)
            },
            data: req.body
        });
        res.status(200).json(selfService);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const deleteSelfService = async (req, res) => {

    try {
        const selfService = await prisma.selfService.update({
            where: {
                id_service: Number(req.params.id)
            },

            data: {
                deleted: true,
            }

        });
        res.status(200).json(selfService);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}