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

        const workShift = await prisma.cashCut.findUnique({

            where: {
                id_cashCut: Number(req.params.id)
            },
            select: {
                workShift: true,
            }

        });

        const initialCash = await prisma.cashCut.findUnique({

            where: {
                id_cashCut: Number(req.params.id)
            },
            select: {
                initialCash: true,
            }

        });

        if (initialCash.initialCash === null) initialCash.initialCash == 0;

        const total = await prisma.payment.aggregate({

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

        if (total._sum.payTotal === null) total._sum.payTotal = 0;

        const totalCashWithdrawal = await prisma.cashWithdrawal.aggregate({

            where: {
                fk_cashCut: Number(req.params.id)
            },
            _sum: {
                amount: true,
            }
        });

        if (totalCashWithdrawal._sum.amount === null) totalCashWithdrawal._sum.amount = 0;

        const cash = await prisma.payment.aggregate({
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

        if (cash._sum.payTotal === null) cash._sum.payTotal = 0;

        const credit = await prisma.payment.aggregate({
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

        if (credit._sum.payTotal === null) credit._sum.payTotal = 0;

        const ordersCancelled = await prisma.payment.findMany({

            where: {
                AND: [
                    {
                        fk_cashCut: Number(req.params.id)
                    },
                    {
                        cancelled: true,
                    },
                ]
            },

            select: {
                fk_idOrder: true,
                payTotal: true
            }

        });


        const totalCancelled = await prisma.payment.aggregate({

            where: {
                AND: [
                    {
                        fk_cashCut: Number(req.params.id)
                    },
                    {
                        cancelled: true,
                    },
                ]
            },

            _sum: {
                payTotal: true,
            }

        });

        if (totalCancelled._sum.payTotal === null) totalCancelled._sum.payTotal = 0;

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
        console.log(orders)

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

        if (totalEncargo._sum.totalPrice === null) totalEncargo._sum.totalPrice = 0;

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

        if (totalAutoservicio._sum.totalPrice === null) totalAutoservicio._sum.totalPrice = 0;

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

        if (totalPlanchado._sum.totalPrice === null) totalPlanchado._sum.totalPrice = 0;

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

        if (totalTintoreria._sum.totalPrice === null) totalTintoreria._sum.totalPrice = 0;

        const totalOtrosEncargo = await prisma.serviceOrder.aggregate({

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

        if (totalOtrosEncargo._sum.totalPrice === null) totalOtrosEncargo._sum.totalPrice = 0;

        // const lastPettyCash = await prisma.pettyCash.aggregate({
        //     _max: {
        //         id_movement: true,
        //     }
        // });

        // console.log(lastPettyCash);

        const pettyCashBalance = await prisma.pettyCash.findFirst({
            select: {
                balance: true,
            },

            take: -1,
        });

        if (pettyCashBalance === null) { pettyCashBalance.balance = 0 };

        console.log(pettyCashBalance.balance);

        if (totalCashWithdrawal._sum.amount === null)
            totalCashWithdrawal._sum.amount = parseFloat(0.00);

        const totalBalance =
            cash._sum.payTotal + credit._sum.payTotal
            - totalCashWithdrawal._sum.amount + initialCash.initialCash;
        if (totalBalance == null) totalBalance = 0;

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
            totalOtrosEncargo._sum.totalPrice);

        const today = new Date().toJSON();
        const time = new Date().toJSON();
        const totalIncome = parseFloat(total._sum.payTotal.toFixed(2));

        const response =
        {
            "totalCash": cash._sum.payTotal,
            "totalCredit": credit._sum.payTotal,
            "totalIncome": totalIncome,
            "totalCashWithdrawal": totalCashWithdrawal._sum.amount,
            "initialCash": initialCash.initialCash,
            "total": totalBalance,
            "totalEncargo": totalEncargo._sum.totalPrice,
            "totalAutoservicio": totalAutoservicio._sum.totalPrice,
            "totalPlanchado": totalPlanchado._sum.totalPrice,
            "totalTintoreria": totalTintoreria._sum.totalPrice,
            "totalOtrosEncargo": totalOtrosEncargo._sum.totalPrice,
            "ordersPayed": orders.length,
            "ordersCancelled": ordersCancelled.length,
            "totalCancelations": totalCancelled,
            "cashCutD": today,
            "cashCutT": time,
            "pettyCashBalance": pettyCashBalance.balance,
            "workShift": workShift.workShift,
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

        const workShift = await prisma.cashCut.findUnique({

            where: {
                id_cashCut: Number(req.params.id)
            },
            select: {
                workShift: true,
            }

        });

        const initialCash = await prisma.cashCut.findUnique({

            where: {
                id_cashCut: Number(req.params.id)
            },
            select: {
                initialCash: true,
            }

        });

        if (initialCash.initialCash === null) initialCash.initialCash == 0;

        console.log(cashCutStatus.CashCutStatus);

        if (cashCutStatus.cashCutStatus === "open") {

            const total = await prisma.payment.aggregate({

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

            if (total._sum.payTotal === null) total._sum.payTotal = 0;

            const totalCashWithdrawal = await prisma.cashWithdrawal.aggregate({

                where: {
                    fk_cashCut: Number(req.params.id)
                },
                _sum: {
                    amount: true,
                }
            });

            if (totalCashWithdrawal._sum.amount === null) totalCashWithdrawal._sum.amount = 0;

            const cash = await prisma.payment.aggregate({
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

            if (cash._sum.payTotal === null) cash._sum.payTotal = 0;

            const credit = await prisma.payment.aggregate({

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

            if (credit._sum.payTotal === null) credit._sum.payTotal = 0;

            const ordersCancelled = await prisma.payment.findMany({

                where: {
                    AND: [
                        {
                            fk_cashCut: Number(req.params.id)
                        },
                        {
                            cancelled: true,
                        },
                    ]
                },

                select: {
                    fk_idOrder: true,
                    payTotal: true
                }

            });

            const totalCancelled = await prisma.payment.aggregate({

                where: {
                    AND: [
                        {
                            fk_cashCut: Number(req.params.id)
                        },
                        {
                            cancelled: true,
                        },
                    ]
                },

                _sum: {
                    payTotal: true,
                }

            });

            if (totalCancelled._sum.payTotal == null) totalCancelled._sum.payTotal = 0;

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

            if (totalEncargo._sum.totalPrice === null) totalEncargo._sum.totalPrice = 0;

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

            if (totalAutoservicio._sum.totalPrice === null) totalAutoservicio._sum.totalPrice = 0;

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

            if (totalPlanchado._sum.totalPrice === null) totalPlanchado._sum.totalPrice = 0;

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

            if (totalTintoreria._sum.totalPrice === null) totalTintoreria._sum.totalPrice = 0;

            const totalOtrosEncargo = await prisma.serviceOrder.aggregate({


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

            if (totalOtrosEncargo._sum.totalPrice === null) totalOtrosEncargo._sum.totalPrice = 0;

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

            if (pettyCashBalance === null) { pettyCashBalance.balance = 0 };

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

            if (totalCashWithdrawal._sum.amount === null)
                totalCashWithdrawal._sum.amount = parseFloat(0.00);

            const totalBalance =
                cash._sum.payTotal + credit._sum.payTotal
                - totalCashWithdrawal._sum.amount + initialCash.initialCash;

            console.log(
                totalEncargo._sum.totalPrice,
                totalAutoservicio._sum.totalPrice,
                totalPlanchado._sum.totalPrice,
                totalTintoreria._sum.totalPrice,
                totalOtrosEncargo._sum.totalPrice);
            //const categoriesPayed=Object.values(ordersPayed).map(ord => ord.order.id_order);

            const today = new Date().toJSON();
            const time = new Date().toJSON();
            const totalIncome = parseFloat(total._sum.payTotal.toFixed(2));

            response = {
                "totalCash": cash._sum.payTotal,
                "totalCredit": credit._sum.payTotal,
                "totalIncome": totalIncome,
                "totalCashWithdrawal": totalCashWithdrawal._sum.amount,
                "initialCash": initialCash.initialCash,
                "total": totalBalance,
                "totalEncargo": totalEncargo._sum.totalPrice,
                "totalAutoservicio": totalAutoservicio._sum.totalPrice,
                "totalPlanchado": totalPlanchado._sum.totalPrice,
                "totalTintoreria": totalTintoreria._sum.totalPrice,
                "totalOtrosEncargo": totalOtrosEncargo._sum.totalPrice,
                "ordersPayed": orders.length,
                "ordersCancelled": ordersCancelled.length,
                "totalCancelations": totalCancelled._sum.payTotal,
                "cashCutStatus": "closed",
                "cashCutD": today,
                "cashCutT": time,
                "pettyCashBalance": pettyCashBalance.balance,
                "workShift": workShift.workShift,
                "ironPiecesDone": ironPiecesDoneCashCut.piecesCashcut

            }

            const closeCash = await prisma.cashCut.update({

                where: {

                    id_cashCut: Number(req.params.id)
                },
                data: {
                    "totalCash": cash._sum.payTotal,
                    "totalCredit": credit._sum.payTotal,
                    "totalIncome": totalIncome,
                    "totalCashWithdrawal": totalCashWithdrawal._sum.amount,
                    "initialCash": initialCash.initialCash,
                    "total": totalBalance,
                    "totalEncargo": totalEncargo._sum.totalPrice,
                    "totalAutoservicio": totalAutoservicio._sum.totalPrice,
                    "totalPlanchado": totalPlanchado._sum.totalPrice,
                    "totalTintoreria": totalTintoreria._sum.totalPrice,
                    "totalOtrosEncargo": totalOtrosEncargo._sum.totalPrice,
                    "ordersPayed": orders.length,
                    "ordersCancelled": ordersCancelled.length,
                    "totalCancelations": totalCancelled._sum.payTotal,
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