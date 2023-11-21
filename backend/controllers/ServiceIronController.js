import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();


export const getIronServices = async (req, res) => {
    try {
        const response = await prisma.ironService.findMany({
            select: {
                id_ironService: true,
                description: true,
                price: true,
                pieces: true,
                cycleTime: true,
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

export const getIronServicesById = async (req, res) => {
    try {
        const response = await prisma.ironService.findUnique({
            
            where: {
                id_ironService: Number(req.params.id)
            },
            
            select: {
                id_ironService: true,
                description: true,
                price: true,
                pieces: true,
                cycleTime: true,
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


export const createIronService = async (req, res) => {

    try {
        const service = await prisma.ironService.create({
            data: req.body
        });
        res.status(201).json(service);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}


export const createIronServiceMany = async (req, res) => {
    try {
        const serviceMany = await prisma.ironService.createMany({
            data: req.body
        });
        res.status(201).json(serviceMany);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}


export const updateIronService = async (req, res) => {

    try {
        const service = await prisma.ironService.update({
            where: {
                id_ironService: Number(req.params.id)
            },
            data: req.body
        });
        res.status(200).json(service);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}



export const deleteIronService = async (req, res) => {

    try {
        const service = await prisma.ironService.delete({
            where: {
                id_ironService: Number(req.params.id)
            }

        });
        res.status(200).json(service);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

