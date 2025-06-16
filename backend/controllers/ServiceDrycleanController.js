import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();


export const getDrycleanServices = async (req, res) => {
    try {
        const response = await prisma.drycleanService.findMany({
            where: {
                deleted: false
            },
            select: {
                id_service: true,
                description: true,
                price: true,
                priceCredit: true,
                pieces: true,
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

export const getDrycleanServicesById = async (req, res) => {
    try {
        const response = await prisma.drycleanService.findUnique({

            where: {
                id_service: Number(req.params.id)
            },

            select: {
                id_service: true,
                description: true,
                price: true,
                priceCredit: true,
                pieces: true,
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


export const createDrycleanService = async (req, res) => {

    try {
        let service;

        const drycleanServiceStatus = await prisma.drycleanService.findFirst({
            where: {
                description: req.body.description
            }
        });

        if (drycleanServiceStatus == null) {

            const drycleanServiceNew = await prisma.drycleanService.create({
                data: req.body
            });

            service = drycleanServiceNew;

            res.status(201).json(service);

        }

        else {
            const drycleanServiceReactivation = await prisma.drycleanService.update({
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
            service = drycleanServiceReactivation;
            res.status(201).json(service);
        }


    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}


export const createDrycleanServiceMany = async (req, res) => {
    try {
        const serviceMany = await prisma.drycleanService.createMany({
            data: req.body
        });
        res.status(201).json(serviceMany);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}


export const updateDrycleanService = async (req, res) => {

    try {
        const service = await prisma.drycleanService.update({
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



export const deleteDrycleanService = async (req, res) => {

    try {
        const service = await prisma.drycleanService.update({
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

