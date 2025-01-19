import { PrismaClient } from "@prisma/client";
import { response } from "express";
import moment from 'moment'
moment.locale('es-mx');

const prisma = new PrismaClient();


export const getWorkshiftBalances = async (req, res) => {
    try {
        const response = await prisma.workshiftBalance.findMany();

        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}

export const getActiveWorkshiftBalances = async (req, res) => {
    try {

        let lastDate = (moment().subtract(180, 'days').startOf('day').toISOString())

        const response = await prisma.workshiftBalance.findMany({

            where: {
                created: {
                    gte: new Date(lastDate)
                },
            }
        }
        );
        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}

export const getWorkshiftBalanceById = async (req, res) => {
    try {
        const response = await prisma.workshiftBalance.findUnique({

            where: {
                id_workshifBalance: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}

export const getLastWorkshiftBalance = async (req, res) => {
    try {
        const response = await prisma.workshiftBalance.findFirst({

            take: -1

        });
        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}

export const createWorkshiftBalance = async (req, res) => {

    try {

        let workshiftBalance = new Object();

        const lastServiceCashcutInfo = await prisma.cashCut.findFirst({
            select: {
                id_cashCut: true,
                totalCashWithdrawal: true,
                totalCancelations: true,
                initialCash: true,
                totalCash: true,
                totalCredit: true,
            },
            take: -1
        });

        const lastSupplyCashcutInfo = await prisma.supplyCashCut.findFirst({
            select: {
                id_supplyCashCut: true,
                totalCash: true,
                totalCredit: true,
            },
            take: -1
        });

        workshiftBalance.cashIncome = lastSupplyCashcutInfo.totalCash + lastServiceCashcutInfo.totalCash;
        workshiftBalance.creditIncome = lastSupplyCashcutInfo.totalCredit + lastServiceCashcutInfo.totalCredit;
        workshiftBalance.withdrawal = lastServiceCashcutInfo.totalCashWithdrawal;
        workshiftBalance.cancellations = lastServiceCashcutInfo.totalCancelations;
        workshiftBalance.initialCash = lastServiceCashcutInfo.initialCash;
        workshiftBalance.totalCashBalace =
            lastSupplyCashcutInfo.totalCash + lastServiceCashcutInfo.totalCash
            + lastServiceCashcutInfo.initialCash - lastServiceCashcutInfo.totalCashWithdrawal
            - lastServiceCashcutInfo.totalCancelations;
        workshiftBalance.totalIncome =
            lastSupplyCashcutInfo.totalCash + lastServiceCashcutInfo.totalCash
            + lastSupplyCashcutInfo.totalCredit + lastServiceCashcutInfo.totalCredit
            - lastServiceCashcutInfo.totalCashWithdrawal - lastServiceCashcutInfo.totalCancelations;

        const response = await prisma.workshiftBalance.create({

            data: {
                id_cashCut: lastServiceCashcutInfo.id_cashCut,
                id_supplyCashCut: lastSupplyCashcutInfo.id_supplyCashCut,
                cashIncome: workshiftBalance.cashIncome,
                creditIncome: workshiftBalance.creditIncome,
                withdrawal: workshiftBalance.withdrawal,
                cancellations: workshiftBalance.cancellations,
                initialCash: workshiftBalance.initialCash,
                totalCashBalace: workshiftBalance.totalCashBalace,
                totalIncome: workshiftBalance.totalIncome
            }
        });

        res.status(200).json(response);

    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const updateWorkshiftBalance = async (req, res) => {
    try {
        const WorkshiftBalance = await prisma.workshiftBalance.update({
            where: {
                id_workshifBalance: Number(req.params.id)
            },

            data: req.body
        });
        res.status(200).json(WorkshiftBalance);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const deleteWorkshiftBalance = async (req, res) => {
    try {
        const WorkshiftBalance = await prisma.workshiftBalance.delete({
            where: {
                id_workshifBalance: Number(req.params.id)
            },
        });
        res.status(200).json(WorkshiftBalance);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}