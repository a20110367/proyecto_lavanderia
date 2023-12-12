import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const getOtherServices = async (req, res) => {
    try {
        const response = await prisma.otherService.findMany({
            select: {

                id_service: true,
                description: true,
                price: true,
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

export const getOtherServicesById = async (req, res) => {
    try {
        const response = await prisma.otherService.findUnique({

            where: {
                id_service: Number(req.params.id)
            },

            select: {

                id_service: true,
                description: true,
                price: true,

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


export const createOtherService = async (req, res) => {

    try {
        const otherService = await prisma.otherService.create({
            data: req.body
        });
        res.status(201).json(otherService);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const createOtherServiceMany = async (req, res) => {
    try {
        const otherServiceMany = await prisma.otherService.createMany({
            data: req.body
        });
        res.status(201).json(otherServiceMany);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const updateOtherService = async (req, res) => {

    try {
        const otherService = await prisma.otherService.update({
            where: {
                id_service: Number(req.params.id)
            },
            data: req.body
        });
        res.status(200).json(otherService);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const deleteOtherService = async (req, res) => {

    try {
        const otherService = await prisma.otherService.delete({
            where: {
                id_service: Number(req.params.id)
            }

        });
        res.status(200).json(otherService);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}