import { CashCutStatus, PrismaClient } from "@prisma/client";
import { response } from "express";
import { calculateSupplyCashCut } from "./SupplyCashCutController.js";
import { calculateTotalWorkShiftBalace, calculateCashWorkShiftBalace } from "./WorkshiftBalanceController.js";
import moment from "moment";
moment.locale('es-mx');

const prisma = new PrismaClient();

//Funciones comunes del archivo

const lastCashCutInfo = async () => {

    const lastCashCut = await prisma.cashCut.findFirst({

        take: -1,

        select: {
            id_cashCut: true,
            cashCutStatus: true
        }

    });

    return (lastCashCut)
}

const currentCashCutInfo = async (cashCut_id) => {

    const currentCashCut = await prisma.cashCut.findUnique({
        where: {
            id_cashCut: cashCut_id
        },
        select: {
            workShift: true,
            initialCash: true,
            cashCutStatus: true
        }
    });

    if (currentCashCut.initialCash == null) currentCashCut.initialCash = 0.00

    return (currentCashCut)
}

const cashCutTotalPayments = async (cashCut_id) => {
    const totalPayedIncome = await prisma.payment.aggregate({

        where: {
            AND: [
                {
                    fk_cashCut: cashCut_id
                },
                {
                    cancelled: false,
                }
            ]

        },
        _sum: {
            payTotal: true,
        }
    });

    if (totalPayedIncome._sum.payTotal == null) totalPayedIncome._sum.payTotal = 0.00

    return (totalPayedIncome)
}

const cashCutTotalCashWithdrawals = async (cashCut_id) => {
    const totalCashWithdrawals = await prisma.cashWithdrawal.aggregate({

        where: {
            fk_cashCut: cashCut_id
        },
        _sum: {
            amount: true,
        }
    });

    if (totalCashWithdrawals._sum.amount == null) totalCashWithdrawals._sum.amount = 0.00

    return (totalCashWithdrawals)
}

const cashCutTotalIncomeByPaymentMethod = async (cashCut_id, paymentMethod) => {
    const totalCashIncome = await prisma.payment.aggregate({

        where: {
            AND: [
                {
                    fk_cashCut: cashCut_id

                },
                {

                    payMethod: paymentMethod
                }
                ,
                {
                    cancelled: false
                }

            ],
        },
        _sum: {
            payTotal: true
        }
    });

    if (totalCashIncome._sum.payTotal == null) totalCashIncome._sum.payTotal = 0.00

    return (totalCashIncome)
}


const cashCutOrdersCancelled = async (cashCut_id) => {

    const ordersCancelled = await prisma.refund.findMany({

        where: {
            fk_cashCut: cashCut_id
        },

        select: {
            serviceOrder: true,
            amount: true
        }
    });

    return (ordersCancelled)
}

const cashCutOrdersCancelledIncome = async (cashCut_id) => {

    const ordersCancelled = await prisma.refund.aggregate({

        where: {
            fk_cashCut: cashCut_id
        },

        _sum: {
            amount: true,
        }
    });

    if (ordersCancelled._sum.amount == null) ordersCancelled._sum.amount = 0.00

    return (ordersCancelled)
}

const cashCutOrdersPayed = async (cashCut_id) => {

    const ordersPayed = await prisma.payment.findMany({

        where: {
            AND: [
                {
                    fk_cashCut: cashCut_id
                },
                {
                    cancelled: false
                },
            ]
        },
        select: {
            serviceOrder: {
                select: {
                    id_order: true
                },
            },
        },
    });

    return (ordersPayed)
}

const cashCutOrdersIncomeByCategory = async (payedOrders, category) => {

    const incomeByCategory = await prisma.serviceOrder.aggregate({

        where: {
            AND: [

                {
                    category: {
                        categoryDescription: category
                    },
                },
                {
                    id_order: {
                        in: payedOrders,
                    },
                },
                {
                    NOT: {
                        orderStatus: "cancelled"
                    }
                }

            ],
        },

        _sum: {
            totalPrice: true,
        },
    });

    if (incomeByCategory._sum.totalPrice == null) incomeByCategory._sum.totalPrice = 0.00

    return (incomeByCategory)
}

const currentPettyCashBalance = async () => {

    const pettyCashBalance = await prisma.pettyCash.findFirst({
        select: {
            balance: true,
        },

        take: -1,
    });

    if (pettyCashBalance.balance == null) pettyCashBalance.balance = 0.00

    return (pettyCashBalance)
}

const serviceCashCutBalanceCalculation = async (cashIncome, creditIncome, cashWithdrawal, incomeOrdersCancelled, initialCash) => {

    return (cashIncome + creditIncome - cashWithdrawal - incomeOrdersCancelled + initialCash)
}

const cashCutIronPiecesDone = async () => {
    const ironPiecesDoneCashCut = await prisma.ironControl.findFirst({

        select: {
            piecesCashcut: true
        },

        take: -1
    });
    if (ironPiecesDoneCashCut.piecesCashcut == null) ironPiecesDoneCashCut.piecesCashcut = 0
    return (ironPiecesDoneCashCut)
}

const calculateServiceCashCut = async (cashCut_id) => {
    //Datos sobre el corte actual
    const cashCutInitialData = await currentCashCutInfo(cashCut_id)

    //Datos sobre los pagos validos recibidos en el corte
    const totalPayedIncome = await cashCutTotalPayments(cashCut_id)

    //Retiros hechos durante el corte
    const totalCashWithdrawal = await cashCutTotalCashWithdrawals(cashCut_id)

    //Pagos recibidos en el turno en efectivo
    const cashServiceIncome = await cashCutTotalIncomeByPaymentMethod(cashCut_id, 'cash')

    //Pagos recibidos en el turno tarjeta de credito 
    const creditServicetIncome = await cashCutTotalIncomeByPaymentMethod(cashCut_id, 'credit')

    //Ordenes canceladas durante el turno, revisar importancia
    const ordersCancelled = await cashCutOrdersCancelled(cashCut_id)

    //Todal de las ordenes canceladas durante el turno
    const totalIncomeOrdesCancelled = await cashCutOrdersCancelledIncome(cashCut_id)

    //Ordenes pagadas durante el turno
    const ordersPayed = await cashCutOrdersPayed(cashCut_id)

    //Se genera un array de ordenes con el id de las ordenes pagadas durante el turno
    const orders = Object.values(ordersPayed).map(ord => ord.serviceOrder.id_order);
    console.log(orders.length + " ordes")

    //Total de ordenes pagadas durante el turno de encargo de encargo
    const totalEncargo = await cashCutOrdersIncomeByCategory(orders, "encargo")

    //Total de ordenes pagadas durante el turno de autoservicio
    const totalAutoservicio = await cashCutOrdersIncomeByCategory(orders, "autoservicio")

    //Total de ordenes pagadas durante el turno de planchado
    const totalPlanchado = await cashCutOrdersIncomeByCategory(orders, "planchado")

    //Total de ordenes pagadas durante el turno de tintoreria
    const totalTintoreria = await cashCutOrdersIncomeByCategory(orders, "tintoreria")

    //Total de ordenes pagadas durante el turno de varios
    const totalEncargoVarios = await cashCutOrdersIncomeByCategory(orders, "varios")

    const pettyCashBalance = await currentPettyCashBalance()

    const totalServiceBalance = await serviceCashCutBalanceCalculation(
        cashServiceIncome._sum.payTotal,
        creditServicetIncome._sum.payTotal,
        totalCashWithdrawal._sum.amount,
        totalIncomeOrdesCancelled._sum.amount,
        cashCutInitialData.initialCash)

    //Revisar si esta funcion funciona

    const ironPiecesDoneCashCut = await cashCutIronPiecesDone();

    console.log(
        totalEncargo._sum.totalPrice,
        totalAutoservicio._sum.totalPrice,
        totalPlanchado._sum.totalPrice,
        totalTintoreria._sum.totalPrice,
        totalEncargoVarios._sum.totalPrice);

    const today = new Date().toJSON();
    const time = new Date().toJSON();

    console.log("totalIncome")


    console.log("Fin Service Corte")
    const serviceCashCut =
    {
        "totalServiceCash": cashServiceIncome._sum.payTotal,//se pasa a totales
        "totalServiceCredit": creditServicetIncome._sum.payTotal,//se pasa a totales
        "totalServiceIncome": totalPayedIncome._sum.payTotal,//se pasa a totales
        "totalCashWithdrawal": totalCashWithdrawal._sum.amount,//se pasa a totales
        "initialCash": cashCutInitialData.initialCash,//se pasa a totales
        "totalServiceBalance": totalServiceBalance,//se pasa a totales
        "totalEncargo": totalEncargo._sum.totalPrice,
        "totalAutoservicio": totalAutoservicio._sum.totalPrice,
        "totalPlanchado": totalPlanchado._sum.totalPrice,
        "totalTintoreria": totalTintoreria._sum.totalPrice,
        "totalOtrosEncargo": totalEncargoVarios._sum.totalPrice,
        "ordersPayed": orders.length,
        "ordersCancelled": ordersCancelled.length,//revisar
        "totalCancelations": totalIncomeOrdesCancelled._sum.amount,//revisar
        "cashCutD": today,
        "cashCutT": time,
        "pettyCashBalance": pettyCashBalance.balance,
        "workShift": cashCutInitialData.workShift,
        "ironPiecesDone": ironPiecesDoneCashCut.piecesCashcut
    }

    return (serviceCashCut)

}

//CRUD ESTANDAR
export const getCashCuts = async (req, res) => {
    let lastDate = (moment().subtract(180, 'days').startOf('day').toISOString())
    try {
        const response = await prisma.cashCut.findMany({

            where: {
                created: {
                    gte: new Date(lastDate)
                },
            },

            include: {
                user: {
                    select: {
                        name: true,
                        firstLN: true,
                    },
                },
            },


        });
        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}

export const getCashCutsById = async (req, res) => {
    try {
        const response = await prisma.cashCut.findUnique({
            where: {
                id_cashCut: Number(req.params.id)
            },

            include: {
                user: {
                    select: {
                        name: true,
                        firstLN: true,
                    },
                },
            },
        });
        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}

export const createCashCut = async (req, res) => {

    try {

        const lastCashCut = await lastCashCutInfo();

        let cashCut;
        if (lastCashCut.cashCutStatus === "open") {

            console.log(lastCashCut.id_cashCut);
            cashCut = await prisma.cashCut.findFirst({
                where: {
                    id_cashCut: lastCashCut.id_cashCut
                },
                select: {
                    initialCash: true,
                    id_cashCut: true,
                },
            });

        } else {
            cashCut = await prisma.cashCut.create({
                data: req.body

            });
        }

        res.status(201).json(cashCut);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const updateCashCut = async (req, res) => {
    try {
        const cashCut = await prisma.cashCut.update({
            where: {
                id_cashCut: Number(req.params.id)
            },

            data: req.body
        });
        res.status(200).json(cashCut);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const deleteCashCut = async (req, res) => {
    try {
        const cashCut = await prisma.cashCut.delete({
            where: {
                id_cashCut: Number(req.params.id)
            }
        });
        res.status(200).json(cashCut);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const calculateCashCut = async (req, res) => {

    try {
        const serviceCashCut = await calculateServiceCashCut(Number(req.params.id))
        const response = serviceCashCut
        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}

export const calculateParcialCashCut = async (req, res) => {

    try {
        const serviceCashCut = await calculateServiceCashCut(Number(req.params.id))
        const suppliesCashCut = await calculateSupplyCashCut(Number(req.params.id))
        const workshiftBalance = Object();

        workshiftBalance.cashIncome = suppliesCashCut.totalSuppliesCash + serviceCashCut.totalServiceCash;
        workshiftBalance.creditIncome = suppliesCashCut.totalSuppliesCredit + serviceCashCut.totalServiceCredit;
        workshiftBalance.withdrawal = serviceCashCut.totalCashWithdrawal;
        workshiftBalance.cancellations = serviceCashCut.totalCancelations;
        workshiftBalance.initialCash = serviceCashCut.initialCash;

        workshiftBalance.totalCashBalace = await calculateCashWorkShiftBalace(
            serviceCashCut.totalServiceCash,
            suppliesCashCut.totalSuppliesCash,
            serviceCashCut.totalCashWithdrawal,
            serviceCashCut.totalCancelations,
            serviceCashCut.initialCash
        );

        workshiftBalance.totalIncome = await calculateTotalWorkShiftBalace(
            serviceCashCut.totalServiceCash,
            suppliesCashCut.totalSuppliesCash,
            serviceCashCut.totalServiceCredit,
            suppliesCashCut.totalSuppliesCredit,
            serviceCashCut.totalCashWithdrawal,
            serviceCashCut.totalCancelations,
            serviceCashCut.initialCash
        );

        const response = {
            "serviceCashCut": serviceCashCut,
            "suppliesCashCut": suppliesCashCut,
            "workshiftBalance": workshiftBalance
        }
        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}

export const closeCashCut = async (req, res) => {

    try {
        let serviceCashCut, suppliesCashCut;
        const workshiftBalance = Object();

        const cashCutInitialData = await currentCashCutInfo(Number(req.params.id))


        if (cashCutInitialData.initialCash === null) cashCutInitialData.initialCash == parseFloat(0.00);

        console.log(cashCutInitialData.CashCutStatus);

        if (cashCutInitialData.cashCutStatus === "open") {

            serviceCashCut = await calculateServiceCashCut(Number(req.params.id))
            serviceCashCut.cashCutStatus = "closed";

            suppliesCashCut = await calculateSupplyCashCut(Number(req.params.id))
            suppliesCashCut.cashCutStatus = "closed";

            workshiftBalance.cashIncome = suppliesCashCut.totalCash + serviceCashCut.totalCash;
            workshiftBalance.creditIncome = suppliesCashCut.totalCredit + serviceCashCut.totalCredit;
            workshiftBalance.withdrawal = serviceCashCut.totalCashWithdrawal;
            workshiftBalance.cancellations = serviceCashCut.totalCancelations;
            workshiftBalance.initialCash = serviceCashCut.initialCash;
            workshiftBalance.id_cashCut = (Number(req.params.id));
            workshiftBalance.id_supplyCashCut = (Number(req.params.id));

            workshiftBalance.totalCashBalace = await calculateCashWorkShiftBalace(
                serviceCashCut.totalCash,
                suppliesCashCut.totalCashSupply,
                serviceCashCut.totalCashWithdrawal,
                serviceCashCut.totalCancelations,
                serviceCashCut.initialCash
            );

            workshiftBalance.totalIncome = await calculateTotalWorkShiftBalace(
                serviceCashCut.totalCash,
                suppliesCashCut.totalCashSupply,
                serviceCashCut.totalCredit,
                suppliesCashCut.totalCreditSupply,
                serviceCashCut.totalCashWithdrawal,
                serviceCashCut.totalCancelations,
                serviceCashCut.initialCash
            );


            const closeServiceCashCut = prisma.cashCut.update({
                where: {

                    id_cashCut: Number(req.params.id)
                },

                data: serviceCashCut
            });

            const closeSuppliesCashCut = prisma.supplyCashCut.update({
                where: {

                    id_cashCut: Number(req.params.id)
                },

                data: serviceCashCut
            });

            const closeWorkshiftBalance = prisma.workshiftBalance.create({

                data: serviceCashCut
            });

            await prisma.$transaction([closeServiceCashCut, closeSuppliesCashCut, closeWorkshiftBalance])


            // const closeCash = await prisma.cashCut.update({

            //     where: {

            //         id_cashCut: Number(req.params.id)
            //     },

            //     data: serviceCashCut

            // });



        } else {
            serviceCashCut = await prisma.cashCut.findFirst({

                where: {

                    id_cashCut: Number(req.params.id)
                },
            });

            suppliesCashCut = await prisma.supplyCashCut.findFirst({

                where: {

                    id_cashCut: Number(req.params.id)
                },
            });

            workshiftBalance = await prisma.workshiftBalance.findFirst({

                where: {

                    id_cashCut: Number(req.params.id)
                },
            });

        }

        const response = {
            "serviceCashCut": serviceCashCut,
            "suppliesCashCut": suppliesCashCut,
            "workshiftBalance": workshiftBalance
        }

        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}

export const getCashCutStatus = async (req, res) => {
    try {

        const lastCashCut = await lastCashCutInfo();
        console.log("lastCashCut")
        console.log(lastCashCut)

        let lastCashCutStatus;

        if (lastCashCut.id_cashCut === null) {

            lastCashCutStatus = {
                cashCutStatus: "closed",
                id_cashCut: 0,
            }

        }
        else {

            lastCashCutStatus = lastCashCut

        }
        console.log(lastCashCut);

        res.status(200).json(lastCashCutStatus);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}

export const getLastCashCut = async (req, res) => {
    try {

        const lastCashCut = await lastCashCutInfo();

        const response = {
            "id_cashCut ": lastCashCut.id_cashCut,
            "cashCutStatus": lastCashCut.cashCutStatus
        };


        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}