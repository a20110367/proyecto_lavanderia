import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const getLaundryServices = async (req, res) => {
    try {
        const response = await prisma.laundryService.findMany({

            where: {
                deleted: false
            },
            select: {

                id_service: true,
                description: true,
                price: true,
                priceCredit: true,
                washWeight: true,
                washCycleTime: true,
                dryWeight: true,
                dryCycleTime: true,
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

export const getLaundryServicesById = async (req, res) => {
    try {
        const response = await prisma.laundryService.findUnique({


            where: {
                id_service: Number(req.params.id)
            },

            select: {

                id_service: true,
                description: true,
                price: true,
                priceCredit: true,
                washWeight: true,
                washCycleTime: true,
                dryWeight: true,
                dryCycleTime: true,
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


export const createLaundryService = async (req, res) => {

    try {

        let laundryService;
        const laundryServiceStatus = await prisma.laundryService.findFirst({
            where: {
                description: req.body.description
            }
        });

        if (laundryServiceStatus == null) {
            const laundryServiceNew = await prisma.laundryService.create({
                data: req.body
            });

            laundryService = laundryServiceNew;

            res.status(201).json(laundryService);
        }
        else {
            const laundryServiceReactivation = await prisma.laundryService.update({
                where: {
                    description: req.body.description
                },
                data: {
                    price: req.body.price,
                    priceCredit: req.body.priceCredit,
                    washWeight: req.body.washWeight,
                    washCycleTime: req.body.washCycleTime,
                    dryWeight: req.body.dryWeight,
                    dryCycleTime: req.body.dryCycleTime,
                    deleted: false
                }
            });
            laundryService = laundryServiceReactivation;
            res.status(201).json(laundryService);
        }

    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const createLaundryServiceMany = async (req, res) => {
    try {
        const laundryServiceMany = await prisma.laundryService.createMany({
            data: req.body
        });
        res.status(201).json(laundryServiceMany);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const updateLaundryService = async (req, res) => {

    try {
        const laundryService = await prisma.laundryService.update({
            where: {
                id_service: Number(req.params.id)
            },
            data: req.body
        });
        res.status(200).json(laundryService);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const deleteLaundryService = async (req, res) => {

    try {
        const laundryService = await prisma.laundryService.update({
            where: {
                id_service: Number(req.params.id)
            },

            data: {
                deleted: true,
            }

        });
        res.status(200).json(laundryService);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

