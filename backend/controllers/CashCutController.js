import { CashCutStatus, PrismaClient } from "@prisma/client";
import { response } from "express";
import moment from "moment";
moment.locale('es-mx');

const prisma = new PrismaClient();


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

        const lastCashCut = await prisma.cashCut.findFirst({

            take: -1
        });

        const cashCutStatus = await prisma.cashCut.findFirst({
            where: {
                id_cashCut: lastCashCut.id_cashCut,
            },

            select: {
                cashCutStatus: true,
            },

        });
        let cashCut;
        if (cashCutStatus.cashCutStatus === "open") {

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
        //Datos sobre el corte actual
        const cashCutInitialData = await prisma.cashCut.findUnique({

            where: {
                id_cashCut: Number(req.params.id)
            },
            select: {
                workShift: true,
                initialCash: true
            }

        });

        // const initialCash = await prisma.cashCut.findUnique({

        //     where: {
        //         id_cashCut: Number(req.params.id)
        //     },
        //     select: {
        //         initialCash: true,
        //     }

        // });

        if (cashCutInitialData.initialCash === null) cashCutInitialData.initialCash == parseFloat(0.00);

        //Datos sobre los pagos validos recibidos en el corte
        const totalPayedIncome = await prisma.payment.aggregate({

            where: {
                AND: [
                    {
                        fk_cashCut: Number(req.params.id)
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

        if (totalPayedIncome._sum.payTotal === null) totalPayedIncome._sum.payTotal = parseFloat(0.00);

        //Retiros hechos durante el corte
        const totalCashWithdrawal = await prisma.cashWithdrawal.aggregate({

            where: {
                fk_cashCut: Number(req.params.id)
            },
            _sum: {
                amount: true,
            }
        });

        if (totalCashWithdrawal._sum.amount === null) totalCashWithdrawal._sum.amount = parseFloat(0.00);

        //Pagos recibidos en el turno en efectivo
        const cashIncome = await prisma.payment.aggregate({
            where: {
                AND: [
                    {
                        fk_cashCut: Number(req.params.id)

                    },
                    {

                        payMethod: 'cash'
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

        if (cashIncome._sum.payTotal === null) cash._sum.payTotal = parseFloat(0.00);

        //Pagos recibidos en el turno tarjeta de credito       
        const creditIncome = await prisma.payment.aggregate({
            where: {
                AND: [
                    {
                        fk_cashCut: Number(req.params.id),

                    },
                    {

                        payMethod: 'credit',
                    },
                    {
                        cancelled: false
                    },

                ],
            },
            _sum: {
                payTotal: true
            }
        });

        if (creditIncome._sum.payTotal === null) creditIncome._sum.payTotal = parseFloat(0.00);

        //Ordenes canceladas durante el turno, revisar importancia
        const ordersCancelled = await prisma.refund.findMany({

            where: {
                fk_cashCut: Number(req.params.id)
            },

            select: {
                serviceOrder: true,
                amount: true
            }

        });


        //Todal de las ordenes canceladas durante el turno
        const totalIncomeOrdesCancelled = await prisma.refund.aggregate({

            where: {
                fk_cashCut: Number(req.params.id)
            },

            _sum: {
                amount: true,
            }

        });

        if (totalIncomeOrdesCancelled._sum.amount === null) totalIncomeOrdesCancelled._sum.amount = parseFloat(0.00);

        //Ordenes pagadas durante el turno
        const ordersPayed = await prisma.payment.findMany({

            where: {
                AND: [
                    {
                        fk_cashCut: Number(req.params.id)
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

        //Se genera un array de ordenes con el id de las ordenes pagadas durante el turno
        const orders = Object.values(ordersPayed).map(ord => ord.serviceOrder.id_order);
        console.log(orders)

        //Total de ordenes pagadas durante el turno de encargo
        const totalEncargo = await prisma.serviceOrder.aggregate({

            where: {
                AND: [

                    {
                        category: {
                            categoryDescription: "encargo"
                        },
                    },
                    {
                        id_order: {
                            in: orders,
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

        if (totalEncargo._sum.totalPrice === null) totalEncargo._sum.totalPrice = parseFloat(0.00);

        //Total de ordenes pagadas durante el turno de autoservicio

        const totalAutoservicio = await prisma.serviceOrder.aggregate({

            where: {
                AND: [

                    {
                        category: {
                            categoryDescription: "autoservicio"
                        },
                    },
                    {
                        id_order: {
                            in: orders,
                        },
                    },
                    {
                        NOT: {
                            orderStatus: "cancelled"
                        }
                    },
                ],
            },

            _sum: {
                totalPrice: true,
            },

        });

        if (totalAutoservicio._sum.totalPrice === null) totalAutoservicio._sum.totalPrice = parseFloat(0.00);

        //Total de ordenes pagadas durante el turno de planchado

        const totalPlanchado = await prisma.serviceOrder.aggregate({

            where: {
                AND: [

                    {
                        category: {
                            categoryDescription: "planchado"
                        },
                    },
                    {
                        id_order: {
                            in: orders,
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

        if (totalPlanchado._sum.totalPrice === null) totalPlanchado._sum.totalPrice = parseFloat(0.00);

        //Total de ordenes pagadas durante el turno de tintoreria

        const totalTintoreria = await prisma.serviceOrder.aggregate({


            where: {
                AND: [

                    {
                        category: {
                            categoryDescription: "tintoreria"
                        },
                    },
                    {
                        id_order: {
                            in: orders,
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

        if (totalTintoreria._sum.totalPrice === null) totalTintoreria._sum.totalPrice = parseFloat(0.00);

        //Total de ordenes pagadas durante el turno de varios

        const totalEncargoVarios = await prisma.serviceOrder.aggregate({

            where: {
                AND: [

                    {
                        category: {
                            categoryDescription: "varios"
                        },
                    },
                    {
                        id_order: {
                            in: orders,
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

        if (totalEncargoVarios._sum.totalPrice === null) totalEncargoVarios._sum.totalPrice = parseFloat(0.00);

        const pettyCashBalance = await prisma.pettyCash.findFirst({
            select: {
                balance: true,
            },

            take: -1,
        });

        if (pettyCashBalance === null) { pettyCashBalance.balance = parseFloat(0.00) };

        console.log(pettyCashBalance.balance);

        // if (totalCashWithdrawal._sum.amount === null)
        //     totalCashWithdrawal._sum.amount = parseFloat(0.00);

        const totalBalance =
            cashIncome._sum.payTotal + creditIncome._sum.payTotal
            - totalCashWithdrawal._sum.amount - totalIncomeOrdesCancelled._sum.amount
            + cashCutInitialData.initialCash;
            console.log("totalBalance")
            console.log(totalBalance)
        if (totalBalance == null) totalBalance = parseFloat(0.00);

        //Revisar si esta funcion funciona
        const ironPiecesDoneCashCut = await prisma.ironControl.findFirst({

            select: {
                piecesCashcut: true
            },

            take: -1
        })

        if (ironPiecesDoneCashCut == null) ironPiecesDoneCashCut.piecesCashcut = 0;

        console.log(
            totalEncargo._sum.totalPrice,
            totalAutoservicio._sum.totalPrice,
            totalPlanchado._sum.totalPrice,
            totalTintoreria._sum.totalPrice,
            totalEncargoVarios._sum.totalPrice);

        const today = new Date().toJSON();
        const time = new Date().toJSON();
        const totalIncome = parseFloat(totalPayedIncome._sum.payTotal.toFixed(2));

        console.log("totalIncome")
        console.log(totalIncome)
        const response =
        {
            "totalCash": cashIncome._sum.payTotal,//se pasa a totales
            "totalCredit": creditIncome._sum.payTotal,//se pasa a totales
            "totalIncome": totalIncome,//se pasa a totales
            "totalCashWithdrawal": totalCashWithdrawal._sum.amount,//se pasa a totales
            "initialCash": cashCutInitialData.initialCash,//se pasa a totales
            "total": totalBalance,//se pasa a totales
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

        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}

export const closeCashCut = async (req, res) => {

    try {
        let response;

        const cashCutStatus = await prisma.cashCut.findUnique({
            where: {
                id_cashCut: Number(req.params.id)
            },

            select: {
                cashCutStatus: true,
            },

        });

        const cashCutInitialData = await prisma.cashCut.findUnique({

            where: {
                id_cashCut: Number(req.params.id)
            },
            select: {
                workShift: true,
                initialCash: true
            }

        });

        // const initialCash = await prisma.cashCut.findUnique({

        //     where: {
        //         id_cashCut: Number(req.params.id)
        //     },
        //     select: {
        //         initialCash: true,
        //     }

        // });

        if (cashCutInitialData.initialCash === null) cashCutInitialData.initialCash == parseFloat(0.00);

        console.log(cashCutStatus.CashCutStatus);

        if (cashCutStatus.cashCutStatus === "open") {

            const totalPayedIncome = await prisma.payment.aggregate({

                where: {
                    AND: [
                        {
                            fk_cashCut: Number(req.params.id)
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

            if (totalPayedIncome._sum.payTotal === null) totalPayedIncome._sum.payTotal = parseFloat(0.00);

            const totalCashWithdrawal = await prisma.cashWithdrawal.aggregate({

                where: {
                    fk_cashCut: Number(req.params.id)
                },
                _sum: {
                    amount: true,
                }
            });

            if (totalCashWithdrawal._sum.amount === null) totalCashWithdrawal._sum.amount = parseFloat(0.00);

            const cashIncome = await prisma.payment.aggregate({
                where: {
                    AND: [
                        {
                            fk_cashCut: Number(req.params.id)

                        },
                        {

                            payMethod: 'cash'
                        },
                        {
                            cancelled: false
                        }

                    ],
                },

                _sum: {
                    payTotal: true
                }
            });

            if (cashIncome._sum.payTotal === null) cashIncome._sum.payTotal = parseFloat(0.00);

            const creditIncome = await prisma.payment.aggregate({

                where: {
                    AND: [
                        {
                            fk_cashCut: Number(req.params.id),

                        },
                        {

                            payMethod: 'credit',
                        },
                        {
                            cancelled: false
                        },

                    ],
                },
                _sum: {
                    payTotal: true
                }
            });

            if (creditIncome._sum.payTotal === null) creditIncome._sum.payTotal = parseFloat(0.00);

            const ordersCancelled = await prisma.refund.findMany({

                where: {
                    fk_cashCut: Number(req.params.id)
                },

                select: {
                    serviceOrder: true,
                    amount: true
                }

            });

            console.log("ordersCancelled") 
            console.log(ordersCancelled)

            const totalIncomeOrdesCancelled = await prisma.refund.aggregate({

                where: {
                    fk_cashCut: Number(req.params.id)
                },

                _sum: {
                    amount: true,
                }

            });
            console.log("totalIncomeOrdesCancelled") 
            console.log(totalIncomeOrdesCancelled._sum.amount == null)
            

            if (totalIncomeOrdesCancelled._sum.amount == null) totalIncomeOrdesCancelled._sum.amount = parseFloat(0.00);

            const ordersPayed = await prisma.payment.findMany({

                where: {
                    AND: [
                        {
                            fk_cashCut: Number(req.params.id)
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

            const orders = Object.values(ordersPayed).map(ord => ord.serviceOrder.id_order);


            const totalEncargo = await prisma.serviceOrder.aggregate({

                where: {
                    AND: [

                        {
                            category: {
                                categoryDescription: "encargo"
                            },
                        },
                        {
                            id_order: {
                                in: orders,
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

            if (totalEncargo._sum.totalPrice === null) totalEncargo._sum.totalPrice = parseFloat(0.00);

            const totalAutoservicio = await prisma.serviceOrder.aggregate({

                where: {
                    AND: [

                        {
                            category: {
                                categoryDescription: "autoservicio"
                            },
                        },
                        {
                            id_order: {
                                in: orders,
                            },
                        },
                        {
                            NOT: {
                                orderStatus: "cancelled"
                            }
                        },

                    ],

                },

                _sum: {
                    totalPrice: true,
                },

            });

            if (totalAutoservicio._sum.totalPrice === null) totalAutoservicio._sum.totalPrice = parseFloat(0.00);

            const totalPlanchado = await prisma.serviceOrder.aggregate({

                where: {
                    AND: [

                        {
                            category: {
                                categoryDescription: "planchado"
                            },
                        },
                        {
                            id_order: {
                                in: orders,
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

            if (totalPlanchado._sum.totalPrice === null) totalPlanchado._sum.totalPrice = parseFloat(0.00);

            const totalTintoreria = await prisma.serviceOrder.aggregate({


                where: {
                    AND: [

                        {
                            category: {
                                categoryDescription: "tintoreria"
                            },
                        },
                        {
                            id_order: {
                                in: orders,
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

            if (totalTintoreria._sum.totalPrice === null) totalTintoreria._sum.totalPrice = parseFloat(0.00);

            const totalEncargoVarios = await prisma.serviceOrder.aggregate({


                where: {
                    AND: [

                        {
                            category: {
                                categoryDescription: "varios"
                            },
                        },
                        {
                            id_order: {
                                in: orders,
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

            if (totalEncargoVarios._sum.totalPrice === null) totalEncargoVarios._sum.totalPrice = parseFloat(0.00);

            // const lastPettyCash = await prisma.pettyCash.aggregate({
            //     _max: {
            //         id_movement: true,
            //     }
            // });

            const pettyCashBalance = await prisma.pettyCash.findFirst({

                select: {
                    balance: true,
                },

                take: -1,
            });

            if (pettyCashBalance === null) { pettyCashBalance.balance = (0.00) };

            const ironPiecesDoneCashCut = await prisma.ironControl.findFirst({

                select: {
                    piecesCashcut: true,
                    id_ironControl: true,
                },

                take: -1
            })

            if (ironPiecesDoneCashCut.piecesCashcut == null) ironPiecesDoneCashCut.piecesCashcut = 0;

            const resetIronPiecesCashCut = await prisma.ironControl.update({
                where: {
                    id_ironControl: ironPiecesDoneCashCut.id_ironControl
                },

                data: {
                    piecesCashcut: 0,
                }
            });

            //const otherCategorys = (parseFloat(total._sum.payTotal.toFixed(2)) - totalAutoservicio._sum.totalPrice - totalPlanchado._sum.totalPrice - totalEncargo._sum.totalPrice - totalTintoreria._sum.totalPrice - totalOtrosEncargo._sum.totalPrice);

            const totalBalance =
                cashIncome._sum.payTotal + creditIncome._sum.payTotal
                - totalCashWithdrawal._sum.amount - totalIncomeOrdesCancelled._sum.amount
                + cashCutInitialData.initialCash;

            console.log(
                totalEncargo._sum.totalPrice,
                totalAutoservicio._sum.totalPrice,
                totalPlanchado._sum.totalPrice,
                totalTintoreria._sum.totalPrice,
                totalEncargoVarios._sum.totalPrice);
            //const categoriesPayed=Object.values(ordersPayed).map(ord => ord.order.id_order);

            const today = new Date().toJSON();
            const time = new Date().toJSON();
            const totalIncome = parseFloat(totalPayedIncome._sum.payTotal.toFixed(2));

            response = {
                "totalCash": cashIncome._sum.payTotal,
                "totalCredit": creditIncome._sum.payTotal,
                "totalIncome": totalIncome,
                "totalCashWithdrawal": totalCashWithdrawal._sum.amount,
                "initialCash": cashCutInitialData.initialCash,
                "total": totalBalance,
                "totalEncargo": totalEncargo._sum.totalPrice,
                "totalAutoservicio": totalAutoservicio._sum.totalPrice,
                "totalPlanchado": totalPlanchado._sum.totalPrice,
                "totalTintoreria": totalTintoreria._sum.totalPrice,
                "totalOtrosEncargo": totalEncargoVarios._sum.totalPrice,
                "ordersPayed": orders.length,
                "ordersCancelled": ordersCancelled.length,
                "totalCancelations": totalIncomeOrdesCancelled._sum.payTotal,
                "cashCutStatus": "closed",
                "cashCutD": today,
                "cashCutT": time,
                "pettyCashBalance": pettyCashBalance.balance,
                "workShift": cashCutInitialData.workShift,
                "ironPiecesDone": ironPiecesDoneCashCut.piecesCashcut

            }

            const closeCash = await prisma.cashCut.update({

                where: {

                    id_cashCut: Number(req.params.id)
                },
                data: {
                    "totalCash": cashIncome._sum.payTotal,
                    "totalCredit": creditIncome._sum.payTotal,
                    "totalIncome": totalIncome,
                    "totalCashWithdrawal": totalCashWithdrawal._sum.amount,
                    "initialCash": cashCutInitialData.initialCash,
                    "total": totalBalance,
                    "totalEncargo": totalEncargo._sum.totalPrice,
                    "totalAutoservicio": totalAutoservicio._sum.totalPrice,
                    "totalPlanchado": totalPlanchado._sum.totalPrice,
                    "totalTintoreria": totalTintoreria._sum.totalPrice,
                    "totalOtrosEncargo": totalEncargoVarios._sum.totalPrice,
                    "ordersPayed": orders.length,
                    "ordersCancelled": ordersCancelled.length,
                    "totalCancelations": totalIncomeOrdesCancelled._sum.amount,
                    "cashCutStatus": "closed",
                    "cashCutD": today,
                    "cashCutT": time,
                    "pettyCashBalance": pettyCashBalance.balance,
                    "ironPiecesDone": ironPiecesDoneCashCut.piecesCashcut

                }
            });

        } else {
            response = await prisma.cashCut.findFirst({

                where: {

                    id_cashCut: Number(req.params.id)
                },
            });
        }

        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}

export const getCashCutStatus = async (req, res) => {
    try {
        const lastCashCut = await prisma.cashCut.aggregate({

            _max: {
                id_cashCut: true,
            }

        });


        let lastCashCutStatus;

        if (lastCashCut._max.id_cashCut === null) {

            lastCashCutStatus = {
                cashCutStatus: "closed",
                id_cashCut: 0,
            }

        }
        else {

            lastCashCutStatus = await prisma.cashCut.findUnique({

                where: {
                    id_cashCut: lastCashCut._max.id_cashCut,
                },

                select: {
                    cashCutStatus: true,
                    id_cashCut: true,
                }

            })

        }
        console.log(lastCashCut);

        res.status(200).json(lastCashCutStatus);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}

export const getLastCashCut = async (req, res) => {
    try {
        const lastCashCutId = await prisma.cashCut.aggregate({

            _max: {
                id_cashCut: true,
            }
        });

        const cashCutStatus = await prisma.cashCut.findFirst({

            where: {
                id_cashCut: lastCashCutId._max.id_cashCut
            },

            select: {
                cashCutStatus: true,
            },

        });

        const response = {
            "id_cashCut ": lastCashCutId._max.id_cashCut,
            "cashCutStatus": cashCutStatus.cashCutStatus
        };


        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}