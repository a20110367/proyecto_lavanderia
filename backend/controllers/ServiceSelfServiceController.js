import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const getSelfServices = async (req, res) => {
    try {
        const response = await prisma.selfService.findMany({
            select: {

                id_selfService: true,
                description: true,
                price: true,
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
                id_selfService: Number(req.params.id)
            },

            select: {

                id_selfService: true,
                description: true,
                price: true,
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
        const selfService = await prisma.selfService.create({
            data: req.body
        });
        res.status(201).json(selfService);
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
                id_selfService: Number(req.params.id)
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
        const selfService = await prisma.selfService.delete({
            where: {
                id_selfService: Number(req.params.id)
            }

        });
        res.status(200).json(selfService);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}