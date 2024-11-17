import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authUser = async (req, res) => {
    const { username, pass } = req.body
    try {
        const auth = await prisma.user.findFirst({
            select: {
                id_user: true,
                username: true,
                role: true,
            },
            where: {
                username: username,
                pass: pass,
            }

        });

        if (auth != null) {
            const lastServiceOrder = await prisma.serviceOrder.aggregate({
                _max: {
                    id_order: true,
                },
            });

            const lastOrder = lastServiceOrder._max;
            const response = { ...auth, id_lastOrder: lastOrder };

            res.status(200).json(response)
        } else {
            res.status(401).json({ msg: 'INVALID CREDENTIALS' })
        }
    } catch (e) {
        res.status(500).json({ msg: e.message })
    }
}

export const getUsers = async (req, res) => {
    try {
        const response = await prisma.user.findMany({
            where: {
                deleted: false
            }
        });
        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}

export const getUsersById = async (req, res) => {
    try {
        let response
        const user = await prisma.user.findUnique({
            where: {
                id_user: Number(req.params.id)
            }
        });
        response = user;
        if (user.deleted == true)
            response = null

        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}

export const createUser = async (req, res) => {
    const { username, name, firstLN, secondLN, email, phone, pass, role } = req.body;
    try {

        let response
        const phoneValidation = await prisma.user.findFirst({
            where: {
                phone: phone
            },

            select: {
                id_user: true
            }
        });

        const mailValidation = await prisma.user.findFirst({
            where: {
                email: email
            },
            select: {
                id_user: true
            }
        });

        const user = await prisma.user.create({
            data: req.body
           
        });

        if (phoneValidation == null && mailValidation == null) {
            response = {

                "m": "m",
                "p": "p"
            }

            res.status(409).json(response);
        }

        if (phoneValidation == null) {
            response = {

                "p": "p"
            }

            res.status(409).json(response);
        }

        if (mailValidation == null) {
            response = {

                "m": "m",
            }

            res.status(409).json(response);
        }

        if (phoneValidation != null && mailValidation != null) {

            const staffMember = await prisma.staffMember.create({
                data: {
                    name: name,
                    firstLN: firstLN,
                    secondLN: secondLN,
                    email: email,
                    phone: phone
                }

            });

            response = {

                "user": user,
                "staffMember": staffMember
            }

            res.status(201).json(response);
        }

    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const createUserMany = async (req, res) => {
    //const {username, name, firstLN, secondLN, email, phone, pass, role} = req.body;
    try {
        const user = await prisma.user.createMany({

            data: req.body

        });
        res.status(201).json(user);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}


export const updateUser = async (req, res) => {
    //const {userName, name, firstLN, secondLN, email, phone, pass, role} = req.body;
    try {
        const user = await prisma.user.update({
            where: {
                id_user: Number(req.params.id)
            },

            data: req.body
        });
        res.status(200).json(user);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const user = await prisma.user.delete({
            where: {
                id_user: Number(req.params.id)
            }
        });
        res.status(200).json(user);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}