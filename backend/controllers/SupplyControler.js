import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

///Revisar comprotamiento y dependencias
export const getSupplies = async (req, res) => {
    try {
        const response = await prisma.supply.findMany();
        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}

export const getSuppliesById = async (req, res) => {
    try {
        const response = await prisma.supply.findUnique({
            where: {
                id_supply: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}

export const createSupplies = async (req, res) => {

    try {

        let supply;

        const supplyValidation = await prisma.supply.findFirst({

            where: {
                description: req.body.description
            }

        });

        if (supplyValidation == null) {

            const supplyNew = await prisma.supply.create({
                data: req.body

            });

            supply = supplyNew;

        } else {

            const supplyReactivation = await prisma.supply.update({

                where: {
                    id_supply: supplyValidation.id_supply
                },

                data: {
                    deleted: false,
                    price: req.body.price,
                    unit: req.body.unit,
                    value: req.body.value
                }

            });

            supply = supplyReactivation;

        }
        res.status(201).json(supply);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const createManySupplies = async (req, res) => {

    try {
        const supply = await prisma.supply.createMany({
            data: req.body

        });

        res.status(201).json(supply);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const updateSupplies = async (req, res) => {
    try {
        const supply = await prisma.supply.update({
            where: {
                id_supply: Number(req.params.id)
            },

            data: req.body
        });
        res.status(200).json(supply);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const deleteSupplies = async (req, res) => {
    try {
        const supply = await prisma.supply.update({
            where: {
                id_supply: Number(req.params.id)
            },

            data: {
                deleted: true
            }

        });
        res.status(200).json(supply);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}


