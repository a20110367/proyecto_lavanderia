import { PrismaClient } from "@prisma/client";
import { response } from "express";
import moment from 'moment'
moment.locale('es-mx');

const prisma = new PrismaClient();

export const calculateCashWorkShiftBalance = async (serviceCashIncome, suppliesCashIncome, cashWithdrawal, incomeOrdersCancelled) => {

    let cashBalance = (serviceCashIncome + suppliesCashIncome - cashWithdrawal - incomeOrdersCancelled )
    if(cashBalance==null)cashBalance=0.00
    return (cashBalance)
}

export const calculateTotalWorkShiftBalance = async (serviceCashIncome, suppliesCashIncome, serviceCreditIncome, suppliesCreditIncome, cashWithdrawal, incomeOrdersCancelled) => {

    let workShiftBalance = (serviceCashIncome + suppliesCashIncome + serviceCreditIncome + suppliesCreditIncome - cashWithdrawal - incomeOrdersCancelled)
    if(workShiftBalance==null)workShiftBalance=0.00
    return (workShiftBalance)
}



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
                totalServiceCash: true,
                totalServiceCredit: true,
            },
            take: -1
        });

        const lastSupplyCashcutInfo = await prisma.supplyCashCut.findFirst({
            select: {
                id_supplyCashCut: true,
                totalSuppliesCash: true,
                totalSuppliesCredit: true,
            },
            take: -1
        });

        //Asignacion de valores 
        workshiftBalance.cashIncome = lastSupplyCashcutInfo.totalSuppliesCash + lastServiceCashcutInfo.totalServiceCash;
        workshiftBalance.creditIncome = lastSupplyCashcutInfo.totalSuppliesCredit + lastServiceCashcutInfo.totalServiceCredit;
        workshiftBalance.withdrawal = lastServiceCashcutInfo.totalCashWithdrawal;
        workshiftBalance.cancellations = lastServiceCashcutInfo.totalCancelations;
        workshiftBalance.initialCash = lastServiceCashcutInfo.initialCash;
        workshiftBalance.id_cashCut = lastServiceCashcutInfo.id_cashCut;
        workshiftBalance.id_supplyCashCut = lastSupplyCashcutInfo.id_supplyCashCut;


        workshiftBalance.totalCashBalace = await calculateCashWorkShiftBalance(

            lastServiceCashcutInfo.totalServiceCash,
            lastSupplyCashcutInfo.totalSuppliesCash,
            lastServiceCashcutInfo.totalCashWithdrawal,
            lastServiceCashcutInfo.totalCancelations
        )

        workshiftBalance.totalIncome = await calculateTotalWorkShiftBalance(
            lastServiceCashcutInfo.totalServiceCash,
            lastSupplyCashcutInfo.totalSuppliesCash,
            lastServiceCashcutInfo.totalServiceCredit,
            lastSupplyCashcutInfo.totalSuppliesCredit,
            lastServiceCashcutInfo.totalCashWithdrawal,
            lastServiceCashcutInfo.totalCancelations
        )


        const response = await prisma.workshiftBalance.create({

            data: workshiftBalance
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