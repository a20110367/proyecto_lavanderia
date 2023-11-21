import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const getCashCuts = async (req, res) => {
    try {
        const response = await prisma.cashCut.findMany({
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

export const getCashCutsById = async (req, res) => {
    try {
        const response = await prisma.cashCut.findUnique({
            where: {
                id_cashCut: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}

export const createCashCut = async (req, res) => {

    try {
        const cashCut = await prisma.cashCut.create({
            data: req.body

        });
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
        const total = await prisma.payment.aggregate({

            where: {
                fk_cashCut: Number(req.params.id)
            },
            _sum: {
                payTotal: true,
            }
        });

        const totalCashWithdrawal = await prisma.cashWithdrawal.aggregate({

            where: {
                fk_cashCut: Number(req.params.id)
            },
            _sum: {
                amount: true,
            }
        });


        const cash = await prisma.payment.aggregate({
            where: {
                AND: [
                    {
                        fk_cashCut: Number(req.params.id)

                    },
                    {

                        payMethod: 'cash'
                    }

                ],
            },

            _sum: {
                payTotal: true
            }
        });

        const credit = await prisma.payment.aggregate({

            where: {
                AND: [
                    {
                        fk_cashCut: Number(req.params.id),

                    },
                    {

                        payMethod: 'credit',
                    },

                ],
            },
            _sum: {
                payTotal: true
            }
        });

        const ordersPayed = await prisma.payment.findMany({

            where: {
                fk_cashCut: Number(req.params.id)
            }, select: {
                serviceOrder: {
                    select: {
                        id_order: true
                    },
                },
            },
        });


        //const ordersIds = ordersPayed.values();
        //const ordersIdsMap = new Map(Object.entries(JSON.parse(ordersPayed)));
        //console.log(ordersIdsMap);
        const orders = Object.values(ordersPayed).map(ord => ord.serviceOrder.id_order);
        console.log(orders)

        //    const servicePayed = await prisma.serviceOrderDetail.findMany({

        //         where:{
        //             fk_ServiceOrder:{
        //                 in:orders,
        //             },
        //         },

        //         select:{
        //             service:{
        //                 select:{
        //                     description:true,
        //                     price:true,
        //                     category_id:true,
        //                 },
        //             },
        //         },
        //     }); 

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
                    }

                ],
            },

            _sum: {
                totalPrice: true,
            },

        });

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
                    }

                ],

            },

            _sum: {
                totalPrice: true,
            },

        });

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
                    }

                ],
            },

            _sum: {
                totalPrice: true,
            },

        });

        const lastPettyCash = await prisma.pettyCash.aggregate({
            _max: {
                id_movement: true,
            }
        });

        console.log(lastPettyCash);

        const pettyCashBalance = await prisma.pettyCash.findFirst({
            where: {
                id_movement: lastPettyCash._max.id_movement,
            },
            select: {
                balance: true,
            }
        });

        console.log(pettyCashBalance.balance);



        const otherCategorys = (parseFloat(total._sum.payTotal.toFixed(2)) - totalAutoservicio._sum.totalPrice - totalPlanchado._sum.totalPrice - totalEncargo._sum.totalPrice);

        if (totalCashWithdrawal._sum.amount === null)
            totalCashWithdrawal._sum.amount = parseFloat(0.00);
        const totalC = cash._sum.payTotal + credit._sum.payTotal - totalCashWithdrawal._sum.amount;

        console.log(totalEncargo._sum.totalPrice, totalAutoservicio._sum.totalPrice, totalPlanchado._sum.totalPrice);
        //const categoriesPayed=Object.values(ordersPayed).map(ord => ord.order.id_order);

        const today = new Date().toJSON();
        const time = new Date().toJSON();
        const totalIncome = parseFloat(total._sum.payTotal.toFixed(2));

        const response =
        {
            "totalCash": cash._sum.payTotal,
            "totalCredit": credit._sum.payTotal,
            "totalIncome": totalIncome,
            "totalCashWithdrawal": totalCashWithdrawal._sum.amount,
            "total": totalC,
            "totalEncargo": totalEncargo._sum.totalPrice,
            "totalAutoservicio": totalAutoservicio._sum.totalPrice,
            "totalPlanchado": totalPlanchado._sum.totalPrice,
            "totalOtros": otherCategorys,
            "ordersPayed": orders.length,
            "cashCutD": today,
            "pettyCashBalance": pettyCashBalance.balance
            //"selfService":selfService
            //"ordersIds":ordersIds
        }

        // console.log(total);
        // console.log(cash);
        // console.log(credit);
        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}

export const closeCashCut = async (req, res) => {

    try {
        const total = await prisma.payment.aggregate({

            where: {
                fk_cashCut: Number(req.params.id)
            },
            _sum: {
                payTotal: true,
            }
        });

        const totalCashWithdrawal = await prisma.cashWithdrawal.aggregate({

            where: {
                fk_cashCut: Number(req.params.id)
            },
            _sum: {
                amount: true,
            }
        });


        const cash = await prisma.payment.aggregate({
            where: {
                AND: [
                    {
                        fk_cashCut: Number(req.params.id)

                    },
                    {

                        payMethod: 'cash'
                    }

                ],
            },

            _sum: {
                payTotal: true
            }
        });

        const credit = await prisma.payment.aggregate({

            where: {
                AND: [
                    {
                        fk_cashCut: Number(req.params.id),

                    },
                    {

                        payMethod: 'credit',
                    },

                ],
            },
            _sum: {
                payTotal: true
            }
        });

        const ordersPayed = await prisma.payment.findMany({

            where: {
                fk_cashCut: Number(req.params.id)
            }, select: {
                serviceOrder: {
                    select: {
                        id_order: true
                    },
                },
            },
        });


        //const ordersIds = ordersPayed.values();
        //const ordersIdsMap = new Map(Object.entries(JSON.parse(ordersPayed)));
        //console.log(ordersIdsMap);
        const orders = Object.values(ordersPayed).map(ord => ord.serviceOrder.id_order);

        //    const servicePayed = await prisma.serviceOrderDetail.findMany({

        //         where:{
        //             fk_ServiceOrder:{
        //                 in:orders,
        //             },
        //         },

        //         select:{
        //             service:{
        //                 select:{
        //                     description:true,
        //                     price:true,
        //                     category_id:true,
        //                 },
        //             },
        //         },
        //     }); 

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
                    }

                ],
            },

            _sum: {
                totalPrice: true,
            },

        });

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
                    }

                ],

            },

            _sum: {
                totalPrice: true,
            },

        });

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
                    }

                ],
            },

            _sum: {
                totalPrice: true,
            },

        });

        const lastPettyCash = await prisma.pettyCash.aggregate({
            _max: {
                id_movement: true,
            }
        });

        const pettyCashBalance = await prisma.pettyCash.findFirst({
            where: {
                id_movement: lastPettyCash._max.id_movement,
            },
            select: {
                balance: true,
            }
        });

        const otherCategorys = (parseFloat(total._sum.payTotal.toFixed(2)) - totalAutoservicio._sum.totalPrice - totalPlanchado._sum.totalPrice - totalEncargo._sum.totalPrice);

        if (totalCashWithdrawal._sum.amount === null)
            totalCashWithdrawal._sum.amount = parseFloat(0.00);
        const totalC = cash._sum.payTotal + credit._sum.payTotal - totalCashWithdrawal._sum.amount;

        console.log(totalEncargo._sum.totalPrice, totalAutoservicio._sum.totalPrice, totalPlanchado._sum.totalPrice);
        //const categoriesPayed=Object.values(ordersPayed).map(ord => ord.order.id_order);

        const today = new Date().toJSON();
        const time = new Date().toJSON();
        const totalIncome = parseFloat(total._sum.payTotal.toFixed(2));

        const response = {
            "totalCash": cash._sum.payTotal,
            "totalCredit": credit._sum.payTotal,
            "totalIncome": totalIncome,
            "totalCashWithdrawal": totalCashWithdrawal._sum.amount,
            "total": totalC,
            "totalEncargo": totalEncargo._sum.totalPrice,
            "totalAutoservicio": totalAutoservicio._sum.totalPrice,
            "totalPlanchado": totalPlanchado._sum.totalPrice,
            "totalOtros": otherCategorys,
            "ordersPayed": orders.length,
            "cashCutStatus": "closed",
            "cashCutD": today,
            "cashCutT": time,
            "pettyCashBalance": pettyCashBalance.balance
            //"selfService":selfService
            //"ordersIds":ordersIds
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
                "total": totalC,
                "totalEncargo": totalEncargo._sum.totalPrice,
                "totalAutoservicio": totalAutoservicio._sum.totalPrice,
                "totalPlanchado": totalPlanchado._sum.totalPrice,
                "totalOtros": otherCategorys,
                "ordersPayed": orders.length,
                "cashCutStatus": "closed",
                "cashCutD": today,
                "cashCutT": time,
                "pettyCashBalance": pettyCashBalance.balance

            }
        });



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

        const response = {
            "id_cashCut ": lastCashCutId._max.id_cashCut
        };


        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}