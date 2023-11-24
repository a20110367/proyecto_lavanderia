import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const getPettyCash = async (req, res) => {
    try {
        const response = await prisma.pettyCash.findMany({
            select: {
                amount: true,
                balance: true,
                id_movement: true,
                movementDate: true,
                cause: true,
                user: {
                    select: {
                        id_user: true,
                        name: true,
                    },
                },
                pettyCashType: true
            },

        });
        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}

export const getPettyCashBalance = async (req, res) => {
    try {
        const lastPettyCash = await prisma.pettyCash.aggregate({
            _max: {
                id_movement: true,
            }
        });

        const response = await prisma.pettyCash.findFirst({
            where: {
                id_movement: lastPettyCash._max.id_movement,
            },
            select: {
                balance: true,
            }
        });

        lastPettyCash._max === null ? response.balance = 0 : response.balance + 0;

        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}

export const createDepositPettyCash = async (req, res) => {
    try {
        const { amount, balance, cause, movementDate, fk_user, pettyCashType } = req.body;
        const lastPettyCash = await prisma.pettyCash.aggregate({
            _max: {
                id_movement: true,
            }
        });

        lastPettyCash._max === null ? lastPettyCash._max = 0 : lastPettyCash + 0;

        const currentBalance = await prisma.pettyCash.findFirst({
            where: {
                id_movement: Number(lastPettyCash._max.id_movement),
            },
            select: {
                balance: true,
            }
        });

        currentBalance.balance == null ? currentBalance.balance = 0 : currentBalance + 0;

        const newBalance = currentBalance.balance + amount;

        const response = await prisma.pettyCash.create({
            data: {
                balance: newBalance,
                amount: amount,
                cause: cause,
                fk_user: fk_user,
                movementDate: movementDate,
                pettyCashType: pettyCashType,
            }
        });

        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}

export const createWithdrawalPettyCash = async (req, res) => {
    try {

        const { amount, balance, cause, movementDate, fk_user, pettyCashType } = req.body;
        const lastPettyCash = await prisma.pettyCash.aggregate({
            _max: {
                id_movement: true,
            }
        });
        lastPettyCash._max === null ? lastPettyCash._max = 0 : lastPettyCash + 0;

        const currentBalance = await prisma.pettyCash.findFirst({
            where: {
                id_movement: Number(lastPettyCash._max.id_movement),
            },
            select: {
                balance: true,
            }
        });

        currentBalance.balance == null ? currentBalance.balance = 0 : currentBalance + 0;

        const newBalance = currentBalance.balance - amount;

        const response = await prisma.pettyCash.create({
            data: {
                balance: newBalance,
                amount: amount,
                cause: cause,
                fk_user: fk_user,
                movementDate: movementDate,
                pettyCashType: pettyCashType,
            }
        });

        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}

export const updatePettyCash = async (req, res) => {
    try {
        const response = await prisma.pettyCash.update({
            where: {
                id_movement: Number(req.params.id)
            },
            data: req.body
        });
        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}

export const deletePettyCash = async (req, res) => {
    try {
        const response = await prisma.pettyCash.update({
            where: {
                id_movement: Number(req.params.id)
            }

        });
        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}



