import { PrismaClient } from "@prisma/client";
// import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

export const getClients = async (req, res) => {
    try {
        const response = await prisma.client.findMany();
        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}

export const getClientsById = async (req, res) => {
    try {
        const response = await prisma.client.findUnique({
            where: {
                id_client: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}

export const getClientsByEmail = async (req, res) => {
    try {
        const response = await prisma.client.findUnique({
            where: {
                email: req.params.email
            }
        });
        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}

export const getClientsByPhone = async (req, res) => {
    try {
        const response = await prisma.client.findFirst({
            where: {
                phone: req.params.phone
            }
        });
        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}

export const createClient = async (req, res) => {
    const { username, name, firstLN, secondLN, email, phone, pass, role } = req.body;

    try {

        let client;

        const phoneValidation = await prisma.user.findFirst({
            where: {
                phone: phone
            },

            select: {
                id_client: true
            }
        });

        const mailValidation = await prisma.user.findFirst({
            where: {
                email: email
            },
            select: {
                id_client: true
            }
        });

        if (phoneValidation == null && mailValidation == null) {
            client = {

                "m": "m",
                "p": "p"
            }

            res.status(409).json(response);
        }

        if (phoneValidation == null) {
            client = {

                "p": "p"
            }

            res.status(409).json(response);
        }

        if (mailValidation == null) {
            client = {

                "m": "m",
            }

            res.status(409).json(response);
        }

        if (phoneValidation != null && mailValidation != null) {

            const clientNew = await prisma.client.create({
                data: req.body

            });

            client = clientNew;

            res.status(201).json(client);

        }

    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const createClientMany = async (req, res) => {

    try {
        const clientMany = await prisma.client.createMany({
            data: req.body

        });
        res.status(201).json(clientMany);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const updateClient = async (req, res) => {
    const { username, name, firstLN, secondLN, email, phone, pass } = req.body;

    try {
        const client = await prisma.client.update({
            where: {
                id_client: Number(req.params.id)
            },
            data: req.body
        });
        res.status(200).json(client);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const deleteClient = async (req, res) => {
    try {
        const client = await prisma.client.delete({
            where: {
                id_client: Number(req.params.id)
            }
        });
        res.status(200).json(client);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}