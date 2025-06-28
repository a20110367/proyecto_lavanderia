import { CashCutStatus, PrismaClient } from "@prisma/client";
import { response } from "express";

const prisma = new PrismaClient();

//FUnciones generales

const lastSuppliesCashCutInfo = async () => {

    const lastCashCut = await prisma.supplyCashCut.findFirst({

        take: -1,

        select: {
            id_supplyCashCut: true,
            cashCutStatus: true,
        }

    });

    return (lastCashCut)
}

const suppliesCurrentCashCutInfo = async (suppliesCashCut_id) => {

    const currentCashCut = await prisma.supplyCashCut.findUnique({
        where: {
            id_supplyCashCut: suppliesCashCut_id
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

const suppliesTotalPayments = async (suppliesCashCut_id) => {
    const totalPayedIncome = await prisma.supplyPayment.aggregate({

        where: {
            fk_cashCut: suppliesCashCut_id
        },
        _sum: {
            payTotal: true,
        }
    });

    if (totalPayedIncome._sum.payTotal == null) totalPayedIncome._sum.payTotal = 0.00
    console.log("totalPayedIncome")
    console.log(totalPayedIncome)

    return (totalPayedIncome)
}


const suppliesCashCutTotalIncomeByPaymentMethod = async (suppliesCashCut_id, paymentMethod) => {

    const totalCashIncome = await prisma.supplyPayment.aggregate({

        where: {
            AND: [
                {
                    fk_cashCut: suppliesCashCut_id

                },
                {

                    payMethod: paymentMethod
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

const suppliesCashCutOrdersPayed = async (suppliesCashCut_id) => {

    const ordersPayed = await prisma.supplyPayment.findMany({

        where: {
            fk_cashCut: suppliesCashCut_id
        },
        select: {
            SupplyOrder: {
                select: {
                    id_supplyOrder: true
                },
            },
        },
    });

    return (ordersPayed)
}

const suppliesCashCutOrdersIncomeByCategory = async (payedOrders, supplyCategory) => {

    const incomeByCategory = await prisma.supplyOrderDetail.aggregate({

        where: {
            AND: [

                {
                    Supply: {
                        category: supplyCategory
                    },
                },
                {
                    SupplyOrder: {
                        id_supplyOrder: {
                            in: payedOrders,
                        },
                    }

                },
            ],
        },

        _sum: {
            subtotal: true,
        },
    });

    if (incomeByCategory._sum.subtotal == null) incomeByCategory._sum.subtotal = 0.00

    return (incomeByCategory)
}

export const calculateSupplyCashCut = async (suppliesCashCut_id) => {
    const currentCashCutInfo = await suppliesCurrentCashCutInfo(suppliesCashCut_id)

    const totalSupplyIncome = await suppliesTotalPayments(suppliesCashCut_id)
    const supplyCashIncome = await suppliesCashCutTotalIncomeByPaymentMethod(suppliesCashCut_id, 'cash')
    const supplyCreditIncome = await suppliesCashCutTotalIncomeByPaymentMethod(suppliesCashCut_id, 'credit')

    const supplyOrdersPayed = await suppliesCashCutOrdersPayed(suppliesCashCut_id)

    const orders = Object.values(supplyOrdersPayed).map(ord => ord.SupplyOrder.id_supplyOrder);
    console.log(orders)

    const totalJabon = await suppliesCashCutOrdersIncomeByCategory(orders, "jabon")
    const totalSuavitel = await suppliesCashCutOrdersIncomeByCategory(orders, "suavitel")
    const totalPinol = await suppliesCashCutOrdersIncomeByCategory(orders, "pinol")
    const totalDesengrasante = await suppliesCashCutOrdersIncomeByCategory(orders, "desengrasante")
    const totalCloro = await suppliesCashCutOrdersIncomeByCategory(orders, "cloro")
    const totalSanitizante = await suppliesCashCutOrdersIncomeByCategory(orders, "sanitizante")
    const totalBolsa = await suppliesCashCutOrdersIncomeByCategory(orders, "bolsa")
    const totalReforzado = await suppliesCashCutOrdersIncomeByCategory(orders, "reforzado")
    const totalGanchos = await suppliesCashCutOrdersIncomeByCategory(orders, "ganchos")
    const totalWC = await suppliesCashCutOrdersIncomeByCategory(orders, "wc")
    const totalOtros = await suppliesCashCutOrdersIncomeByCategory(orders, "otros")

    console.log(totalJabon._sum.subtotal, totalSuavitel._sum.subtotal, totalPinol._sum.subtotal, totalDesengrasante._sum.subtotal, totalCloro._sum.subtotal, totalSanitizante._sum.subtotal,
        totalBolsa._sum.subtotal, totalReforzado._sum.subtotal, totalGanchos._sum.subtotal, totalWC._sum.subtotal);
    //const categoriesPayed=Object.values(ordersPayed).map(ord => ord.order.id_order);

    const today = new Date().toJSON();
    const time = new Date().toJSON();

    console.log("Fin Supplies Corte")

    const suppliesCashCut =
    {
        "totalSuppliesCash": supplyCashIncome._sum.payTotal,
        "totalSuppliesCredit": supplyCreditIncome._sum.payTotal,
        "totalSuppliesIncome": totalSupplyIncome._sum.payTotal,
        "totalJabon": totalJabon._sum.subtotal,
        "totalSuavitel": totalSuavitel._sum.subtotal,
        "totalPinol": totalPinol._sum.subtotal,
        "totalDesengrasante": totalDesengrasante._sum.subtotal,
        "totalCloro": totalCloro._sum.subtotal,
        "totalSanitizante": totalSanitizante._sum.subtotal,
        "totalBolsa": totalBolsa._sum.subtotal,
        "totalReforzado": totalReforzado._sum.subtotal,
        "totalGanchos": totalGanchos._sum.subtotal,
        "totalWC": totalWC._sum.subtotal,
        "totalOtros": totalOtros._sum.subtotal,
        "ordersPayedSupply": orders.length,
        "cashCutD": today,
        "cashCutT": time,
        "workShift": currentCashCutInfo.workShift
    }

    return (suppliesCashCut);

}


//CRUD GENERAL
export const getSupplyCashCuts = async (req, res) => {

 let lastDate = (moment().subtract(180, 'days').startOf('day').toISOString())

    try {
        const response = await prisma.supplyCashCut.findMany({

            where: {
                created: {
                    gte: new Date(lastDate)
                },
            },

            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}

export const getSupplyCashCutsById = async (req, res) => {
    try {
        const response = await prisma.supplyCashCut.findUnique({
            where: {
                id_supplyCashCut: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}

export const createSupplyCashCut = async (req, res) => {

    try {

        const lastSupplyCashCut = await lastSuppliesCashCutInfo();
        let suppliesCashCut;
        console.log("ULTIMO CORTE DE PRODUCTOS")
        console.log(lastSupplyCashCut.id_supplyCashCut)
        if (lastSupplyCashCut === null) {
            suppliesCashCut = await prisma.supplyCashCut.create({
                data: req.body

            });

        }
        else {

            if (lastSupplyCashCut.cashCutStatus === "open") {

                suppliesCashCut = lastSupplyCashCut

            } else {
                suppliesCashCut = await prisma.supplyCashCut.create({
                    data: req.body

                });
            }
        }
        res.status(201).json(suppliesCashCut);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const updateSupplyCashCut = async (req, res) => {
    try {
        const cashCut = await prisma.supplyCashCut.update({
            where: {
                id_supplyCashCut: Number(req.params.id)
            },

            data: req.body
        });
        res.status(200).json(cashCut);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const deleteSupplyCashCut = async (req, res) => {
    try {
        const cashCut = await prisma.supplyCashCut.delete({
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

        const suppliesCashCut = await calculateSupplyCashCut(Number(req.params.id))
        const response = suppliesCashCut
        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}

export const closeSupplyCashCut = async (req, res) => {

    try {
        let response;

        const cashCutInitialData = await suppliesCurrentCashCutInfo(Number(req.params.id))

        console.log(cashCutInitialData.cashCutStatus);

        if (cashCutInitialData.cashCutStatus === "open") {

            const suppliesCashCut = calculateSupplyCashCut(Number(req.params.id))

            suppliesCashCut.cashCutStatus = "closed"

            const closeCash = await prisma.supplyCashCut.update({

                where: {

                    id_supplyCashCut: Number(req.params.id)
                },
                data: suppliesCashCut
            });

        } else {
            response = await prisma.supplyCashCut.findFirst({

                where: {
                    id_supplyCashCut: Number(req.params.id)
                },
            });
        }

        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}

export const getSupplyCashCutStatus = async (req, res) => {
    try {
        const lastCashCut = await prisma.supplyCashCut.findFirst({

            take: -1

        });

        let lastCashCutStatus = new Object();

        if (lastCashCut === null) {

            lastCashCutStatus.cashCutStatus = "closed"
            lastCashCutStatus.id_cashCu = 0
        }
        else {

            lastCashCutStatus.cashCutStatus = lastCashCut.cashCutStatus;
            lastCashCutStatus.id_supplyCashCut = lastCashCut.id_supplyCashCut;

        }


        console.log(lastCashCut);

        res.status(200).json(lastCashCutStatus);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}

export const getSupplyLastCashCut = async (req, res) => {
    try {

        const lastSupplyCashCut = await prisma.supplyCashCut.findFirst({

            take: -1

        });

        const response = {
            "id_cashCut ": lastSupplyCashCut.id_supplyCashCut,
            "cashCutStatus": lastSupplyCashCut.cashCutStatus
        };


        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}