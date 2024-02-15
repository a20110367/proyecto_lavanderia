import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

///Revisar comprotamiento y dependencias
export const getSupplyOrderDetails = async (req, res) => {
    try {
        const response = await prisma.supplyOrderDetail.findMany();
        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}

export const getSupplyOrderDetailsById = async (req, res) => {
    try {
        const response = await prisma.supplyOrderDetail.findMany({
            where: {
                id_supplyOrderDetail: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}

export const createSupplyOrderDetails = async (req, res) => {

    try {
        const supplyOrderDetail = await prisma.supplyOrderDetail.create({
            data: req.body

        });

        res.status(201).json(supplyOrderDetail);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const createManySupplyOrderDetails = async (req, res) => {

    try {
        const supplyOrderDetail = await prisma.supplyOrderDetail.createMany({
            data: req.body

        });

        res.status(201).json(supplyOrderDetail);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const updateSupplyOrderDetails = async (req, res) => {
    try {
        const supplyOrderDetail = await prisma.supplyOrderDetail.update({
            where: {
                id_supplyOrderDetail: Number(req.params.id)
            },

            data: req.body
        });
        res.status(200).json(supplyOrderDetail);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const deleteSupplyOrderDetails = async (req, res) => {
    try {
        const supplyOrderDetail = await prisma.supplyOrderDetail.delete({
            where: {
                id_supplyOrderDetail: Number(req.params.id)
            }
        });
        res.status(200).json(supplyOrderDetail);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}


