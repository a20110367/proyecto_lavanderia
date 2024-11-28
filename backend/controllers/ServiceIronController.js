import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();


export const getIronServices = async (req, res) => {
    try {
        const response = await prisma.ironService.findMany({
            where: {
                deleted: false
            },
            select: {
                id_service: true,
                description: true,
                price: true,
                priceCredit:true,
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
                id_service: Number(req.params.id)
            },

            select: {
                id_service: true,
                description: true,
                price: true,
                priceCredit:true,
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

        let service;

        const ironServiceStatus = await prisma.ironService.findFirst({
            where: {
                description: req.body.description
            }
        });

        if (ironServiceStatus == null) {
            
            const ironServiceNew = await prisma.ironService.create({
                data: req.body
            });

            service=ironServiceNew;

            res.status(201).json(service);
        }
        else{

            const ironServiceReactivation = await prisma.ironService.update({
                where: {
                    description: req.body.description
                },
                data: {

                    price: req.body.price,
                    priceCredit: req.body.priceCredit,
                    pieces: req.body.pieces,
                    deleted: false
                }
            });

            service=ironServiceReactivation;

            res.status(201).json(service);

        }

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
                id_service: Number(req.params.id)
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
        const service = await prisma.ironService.update({
            where: {
                id_service: Number(req.params.id)
            },
            data: {
                deleted: true,
            }

        });
        res.status(200).json(service);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

