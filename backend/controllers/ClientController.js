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
    let { email, phone, name, firstLN, secondLN } = req.body;

    //if(email==="")email=null;

    try {

        let response;

        const phoneValidation = await prisma.client.findFirst({
            where: {
                phone: phone
            },

            select: {
                id_client: true
            }
        });

        const mailValidation = await prisma.client.findFirst({
            where: {
                AND: [
                    {
                        email: email
                    },

                    {
                        NOT: {
                            email: ""
                        }
                    },
                ],

            },
            select: {
                id_client: true
            }
        });

        if (phoneValidation && mailValidation) {
            response = {
                "m": "m",
                "p": "p"
            }

            res.status(409).json(response);
        } else if (phoneValidation) {
            response = {
                "p": "p"
            }
            res.status(409).json(response);
        } else if (mailValidation) {
            response = {
                "m": "m",
            }
            res.status(409).json(response);
        } else {

            const clientNew = await prisma.client.create({
                data: {
                    email: email,
                    phone: phone,
                    name: name,
                    firstLN: firstLN,
                    secondLN: secondLN
                }

            });

            res.status(201).json(clientNew);

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
    let { email, phone, name, firstLN, secondLN } = req.body;

    // if(email==="")email=null;

    try {
        let response;

        const phoneValidation = await prisma.client.findFirst({
            where: {
                phone: phone
            },

            select: {
                id_client: true
            }
        });

        const mailValidation = await prisma.client.findFirst({
            where: {

                AND: [
                    {
                        email: email
                    },

                    {
                        NOT: {
                            email: ""
                        }
                    },
                ],
            },
            select: {
                id_client: true
            }
        });

        if (phoneValidation && mailValidation && phoneValidation.id_client !== Number(req.params.id)) {
            response = {
                "m": "m",
                "p": "p"
            }

            res.status(409).json(response);
        } else if (phoneValidation && phoneValidation.id_client !== Number(req.params.id)) {
            response = {
                "p": "p"
            }
            res.status(409).json(response);
        } else if (mailValidation && mailValidation.id_client !== Number(req.params.id)) {
            response = {
                "m": "m",
            }
            res.status(409).json(response);
        } else {
            const client = await prisma.client.update({
                where: {
                    id_client: Number(req.params.id)
                },
                data: {
                    email: email,
                    phone: phone,
                    name: name,
                    firstLN: firstLN,
                    secondLN: secondLN
                }

            });
            res.status(200).json(client);
        }
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