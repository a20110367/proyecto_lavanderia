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
        const response = await prisma.supply.findMany({
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
        const supply = await prisma.supply.create({
            data: req.body

        });

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
        const supply = await prisma.supply.delete({
            where: {
                id_supply: Number(req.params.id)
            }
        });
        res.status(200).json(supply);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}


