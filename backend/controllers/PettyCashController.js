import { PrismaClient } from "@prisma/client";
import moment from "moment";
moment.locale('es-mx');

const prisma = new PrismaClient();


export const getPettyCash = async (req, res) => {

    let lastDate = (moment().subtract(180, 'days').startOf('day').toISOString())

    try {
        const response = await prisma.pettyCash.findMany({

            where: {
                created: {
                    gte: new Date(lastDate)
                },
            },

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
        const { amount, cause, movementDate, fk_user, pettyCashType } = req.body;
        const lastPettyCash = await prisma.pettyCash.aggregate({
            _max: {
                id_movement: true,
            }
        });

        let currentBalance = 0;
        if (lastPettyCash._max.id_movement !== null) {
            const lastRecord = await prisma.pettyCash.findFirst({
                where: {
                    id_movement: lastPettyCash._max.id_movement,
                },
                select: {
                    balance: true,
                }
            });
            if (lastRecord) {
                currentBalance = lastRecord.balance;
            }
        }

        const newBalance = currentBalance + amount;

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
        const { amount, cause, movementDate, fk_user, pettyCashType } = req.body;
        const lastPettyCash = await prisma.pettyCash.aggregate({
            _max: {
                id_movement: true,
            }
        });

        let currentBalance = 0;
        if (lastPettyCash._max.id_movement !== null) {
            const lastRecord = await prisma.pettyCash.findFirst({
                where: {
                    id_movement: lastPettyCash._max.id_movement,
                },
                select: {
                    balance: true,
                }
            });
            if (lastRecord) {
                currentBalance = lastRecord.balance;
            }
        }

        const newBalance = currentBalance - amount;

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



