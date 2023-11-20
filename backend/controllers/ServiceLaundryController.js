import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const getLaundryServices = async (req, res) => {
    try {
        const response = await prisma.laundryService.findMany({
            select: {

                id_laundryService: true,
                description: true,
                price: true,
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
        const laundryService = await prisma.laundryService.create({
            data: req.body
        });
        res.status(201).json(laundryService);
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
                id_LaundryService: Number(req.params.id)
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
        const laundryService = await prisma.laundryService.delete({
            where: {
                id_LaundryService: Number(req.params.id)
            }

        });
        res.status(200).json(laundryService);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

