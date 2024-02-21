import { CashCutStatus, PrismaClient } from "@prisma/client";
import { response } from "express";

const prisma = new PrismaClient();


export const getSupplyCashCuts = async (req, res) => {
    try {
        const response = await prisma.supplyCashCut.findMany({
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

export const createCashCut = async (req, res) => {

    try {

        const lastSupplyCashCut = await prisma.supplyCashCut.aggregate({

            _max: {
                id_supplyCashCut: true,
            }

        });
        var cashCut;
        if (lastSupplyCashCut._max.id_supplyCashCut == null) {
            cashCut = await prisma.supplyCashCut.create({
                data: req.body

            });

        }
        else {

            const cashCutStatus = await prisma.supplyCashCut.findFirst({
                where: {
                    id_supplyCashCut: lastSupplyCashCut._max.id_cashCut,
                },

                select: {
                    cashCutStatus: true,
                },

            });

            if (cashCutStatus.cashCutStatus === "open") {

                console.log(lastSupplyCashCut._max.id_cashCut);
                cashCut = await prisma.supplyCashCut.findFirst({
                    where: {
                        id_supplyCashCut: lastSupplyCashCut._max.id_cashCut
                    },
                    select: {
                        initialCash: true,
                        id_cashCut: true,
                    },
                });

            } else {
                cashCut = await prisma.supplyCashCut.create({
                    data: req.body

                });
            }

        }



        res.status(201).json(cashCut);
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

export const calculateSupplyCashCut = async (req, res) => {

    try {
        const total = await prisma.supplyPayment.aggregate({

            where: {
                fk_cashCut: Number(req.params.id)
            },
            _sum: {
                payTotal: true,
            }
        });

        const workShift = await prisma.supplyCashCut.findFirst({

            where: {
                id_supplyCashCut: Number(req.params.id)
            },
            select: {
                workShift: true,
            }

        });

        total._sum.payTotal === null ? total._sum.payTotal = 0 : total._sum.payTotal + 0;

        const cash = await prisma.supplyPayment.aggregate({
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
        cash._sum.payTotal === null ? cash._sum.payTotal = 0 : cash._sum.payTotal + 0;

        const credit = await prisma.supplyPayment.aggregate({
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


        credit._sum.payTotal === null ? credit._sum.payTotal = 0 : credit._sum.payTotal + 0;

        const ordersPayed = await prisma.supplyPayment.findMany({

            where: {
                fk_cashCut: Number(req.params.id)
            }, select: {
                SupplyOrder: {
                    select: {
                        id_supplyOrder: true
                    },
                },
            },
        });

        const orders = Object.values(ordersPayed).map(ord => ord.SupplyOrder.id_supplyOrder);
        console.log(orders)

        const totalJabon = await prisma.supplyOrderDetail.aggregate({

            where: {
                AND: [

                    {
                        Supply: {
                            category: "jabon"
                        }
                    },
                    {
                        SupplyOrder: {
                            id_supplyOrder: {
                                in: orders,
                            },
                        },
                    }

                ],
            },

            _sum: {
                subtotal: true,
            },

        });

        totalJabon._sum.subtotal === null ? totalJabon._sum.subtotal = 0 : totalJabon._sum.subtotal + 0;


        const totalSuavitel = await prisma.supplyOrderDetail.aggregate({

            where: {
                AND: [

                    {
                        Supply: {
                            category: "suavitel"
                        }
                    },
                    {
                        SupplyOrder: {
                            id_supplyOrder: {
                                in: orders,
                            },
                        },
                    }

                ],
            },

            _sum: {
                subtotal: true,
            },

        });

        totalSuavitel._sum.subtotal === null ? totalSuavitel._sum.subtotal = 0 : totalSuavitel._sum.subtotal + 0;

        const totalPinol = await prisma.supplyOrderDetail.aggregate({

            where: {
                AND: [

                    {
                        Supply: {
                            category: "pinol"
                        }
                    },
                    {
                        SupplyOrder: {
                            id_supplyOrder: {
                                in: orders,
                            },
                        },
                    }

                ],
            },

            _sum: {
                subtotal: true,
            },

        });

        totalPinol._sum.subtotal === null ? totalPinol._sum.subtotal = 0 : totalPinol._sum.subtotal + 0;

        const totalDesengrasante = await prisma.supplyOrderDetail.aggregate({

            where: {
                AND: [

                    {
                        Supply: {
                            category: "desengrasante"
                        }
                    },
                    {
                        SupplyOrder: {
                            id_supplyOrder: {
                                in: orders,
                            },
                        },
                    }

                ],
            },

            _sum: {
                subtotal: true,
            },

        });

        totalDesengrasante._sum.subtotal === null ? totalDesengrasante._sum.subtotal = 0 : totalDesengrasante._sum.subtotal + 0;

        const totalCloro = await prisma.supplyOrderDetail.aggregate({

            where: {
                AND: [

                    {
                        Supply: {
                            category: "cloro"
                        }
                    },
                    {
                        SupplyOrder: {
                            id_supplyOrder: {
                                in: orders,
                            },
                        },
                    }

                ],
            },

            _sum: {
                subtotal: true,
            },

        });

        totalCloro._sum.subtotal === null ? totalCloro._sum.subtotal = 0 : totalCloro._sum.subtotal + 0;

        const totalSanitizante = await prisma.supplyOrderDetail.aggregate({

            where: {
                AND: [

                    {
                        Supply: {
                            category: "sanitizante"
                        }
                    },
                    {
                        SupplyOrder: {
                            id_supplyOrder: {
                                in: orders,
                            },
                        },
                    }

                ],
            },

            _sum: {
                subtotal: true,
            },

        });

        totalSanitizante._sum.subtotal === null ? totalSanitizante._sum.subtotal = 0 : totalSanitizante._sum.subtotal + 0;

        const totalBolsa = await prisma.supplyOrderDetail.aggregate({

            where: {
                AND: [

                    {
                        Supply: {
                            category: "bolsa"
                        }
                    },
                    {
                        SupplyOrder: {
                            id_supplyOrder: {
                                in: orders,
                            },
                        },
                    }

                ],
            },

            _sum: {
                subtotal: true,
            },

        });

        totalBolsa._sum.subtotal === null ? totalBolsa._sum.subtotal = 0 : totalBolsa._sum.subtotal + 0;

        const totalReforzado = await prisma.supplyOrderDetail.aggregate({

            where: {
                AND: [

                    {
                        Supply: {
                            category: "reforzado"
                        }
                    },
                    {
                        SupplyOrder: {
                            id_supplyOrder: {
                                in: orders,
                            },
                        },
                    }

                ],
            },

            _sum: {
                subtotal: true,
            },

        });

        totalReforzado._sum.subtotal === null ? totalReforzado._sum.subtotal = 0 : totalReforzado._sum.subtotal + 0;

        const totalGanchos = await prisma.supplyOrderDetail.aggregate({

            where: {
                AND: [

                    {
                        Supply: {
                            category: "ganchos"
                        }
                    },
                    {
                        SupplyOrder: {
                            id_supplyOrder: {
                                in: orders,
                            },
                        },
                    }

                ],
            },

            _sum: {
                subtotal: true,
            },

        });

        totalGanchos._sum.subtotal === null ? totalGanchos._sum.subtotal = 0 : totalGanchos._sum.subtotal + 0;

        const totalWC = await prisma.supplyOrderDetail.aggregate({

            where: {
                AND: [

                    {
                        Supply: {
                            category: "wc"
                        }
                    },
                    {
                        SupplyOrder: {
                            id_supplyOrder: {
                                in: orders,
                            },
                        },
                    }

                ],
            },

            _sum: {
                subtotal: true,
            },

        });

        totalWC._sum.subtotal === null ? totalWC._sum.subtotal = 0 : totalWC._sum.subtotal + 0;



        const totalOtros = (parseFloat(total._sum.payTotal.toFixed(2)) - totalJabon._sum.subtotal - totalSuavitel._sum.subtotal - totalPinol._sum.subtotal - totalDesengrasante._sum.subtotal -
            totalCloro._sum.subtotal - totalSanitizante._sum.subtotal - totalBolsa._sum.subtotal - totalReforzado._sum.subtotal - totalGanchos._sum.subtotal - totalWC._sum.subtotal);



        console.log(totalJabon._sum.subtotal, totalSuavitel._sum.subtotal, totalPinol._sum.subtotal, totalDesengrasante._sum.subtotal, totalCloro._sum.subtotal, totalSanitizante._sum.subtotal,
            totalBolsa._sum.subtotal, totalReforzado._sum.subtotal, totalGanchos._sum.subtotal, totalWC._sum.subtotal);
        //const categoriesPayed=Object.values(ordersPayed).map(ord => ord.order.id_order);

        const today = new Date().toJSON();
        const time = new Date().toJSON();
        const totalIncome = parseFloat(total._sum.payTotal.toFixed(2));

        const response =
        {
            "totalCashSupply": cash._sum.payTotal,
            "totalCreditSupply": credit._sum.payTotal,
            "totalIncomeSupply": totalIncome,
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
            "totalOtros": totalOtros,
            "ordersPayedSupply": orders.length,
            "cashCutD": today,
            "workShift": workShift.workShift
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
        var response;

        const cashCutStatus = await prisma.supplyCashCut.findFirst({
            where: {
                id_supplyCashCut: Number(req.params.id)
            },

            select: {
                cashCutStatus: true,
            },

        });

        const workShift = await prisma.supplyCashCut.findFirst({

            where: {
                id_supplyCashCut: Number(req.params.id)
            },
            select: {
                workShift: true,
            }

        });

        console.log(cashCutStatus.cashCutStatus);

        if (cashCutStatus.cashCutStatus === "open") {

            const total = await prisma.supplyPayment.aggregate({

                where: {
                    fk_cashCut: Number(req.params.id)
                },
                _sum: {
                    payTotal: true,
                }
            });

            // const workShift = await prisma.supplyCashCut.findFirst({

            //     where: {
            //         id_supplyCashCut: Number(req.params.id)
            //     },
            //     select: {
            //         workShift: true,
            //     }

            // });

            total._sum.payTotal === null ? total._sum.payTotal = 0 : total._sum.payTotal + 0;

            const cash = await prisma.supplyPayment.aggregate({
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
            cash._sum.payTotal === null ? cash._sum.payTotal = 0 : cash._sum.payTotal + 0;

            const credit = await prisma.supplyPayment.aggregate({
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


            credit._sum.payTotal === null ? credit._sum.payTotal = 0 : credit._sum.payTotal + 0;

            const ordersPayed = await prisma.supplyPayment.findMany({

                where: {
                    fk_cashCut: Number(req.params.id)
                }, select: {
                    SupplyOrder: {
                        select: {
                            id_supplyOrder: true
                        },
                    },
                },
            });

            const orders = Object.values(ordersPayed).map(ord => ord.SupplyOrder.id_supplyOrder);
            console.log(orders)

            const totalJabon = await prisma.supplyOrderDetail.aggregate({

                where: {
                    AND: [

                        {
                            Supply: {
                                category: "jabon"
                            }
                        },
                        {
                            SupplyOrder: {
                                id_supplyOrder: {
                                    in: orders,
                                },
                            },
                        }

                    ],
                },

                _sum: {
                    subtotal: true,
                },

            });

            totalJabon._sum.subtotal === null ? totalJabon._sum.subtotal = 0 : totalJabon._sum.subtotal + 0;


            const totalSuavitel = await prisma.supplyOrderDetail.aggregate({

                where: {
                    AND: [

                        {
                            Supply: {
                                category: "suavitel"
                            }
                        },
                        {
                            SupplyOrder: {
                                id_supplyOrder: {
                                    in: orders,
                                },
                            },
                        }

                    ],
                },

                _sum: {
                    subtotal: true,
                },

            });

            totalSuavitel._sum.subtotal === null ? totalSuavitel._sum.subtotal = 0 : totalSuavitel._sum.subtotal + 0;

            const totalPinol = await prisma.supplyOrderDetail.aggregate({

                where: {
                    AND: [

                        {
                            Supply: {
                                category: "pinol"
                            }
                        },
                        {
                            SupplyOrder: {
                                id_supplyOrder: {
                                    in: orders,
                                },
                            },
                        }

                    ],
                },

                _sum: {
                    subtotal: true,
                },

            });

            totalPinol._sum.subtotal === null ? totalPinol._sum.subtotal = 0 : totalPinol._sum.subtotal + 0;

            const totalDesengrasante = await prisma.supplyOrderDetail.aggregate({

                where: {
                    AND: [

                        {
                            Supply: {
                                category: "desengrasante"
                            }
                        },
                        {
                            SupplyOrder: {
                                id_supplyOrder: {
                                    in: orders,
                                },
                            },
                        }

                    ],
                },

                _sum: {
                    subtotal: true,
                },

            });

            totalDesengrasante._sum.subtotal === null ? totalDesengrasante._sum.subtotal = 0 : totalDesengrasante._sum.subtotal + 0;

            const totalCloro = await prisma.supplyOrderDetail.aggregate({

                where: {
                    AND: [

                        {
                            Supply: {
                                category: "cloro"
                            }
                        },
                        {
                            SupplyOrder: {
                                id_supplyOrder: {
                                    in: orders,
                                },
                            },
                        }

                    ],
                },

                _sum: {
                    subtotal: true,
                },

            });

            totalCloro._sum.subtotal === null ? totalCloro._sum.subtotal = 0 : totalCloro._sum.subtotal + 0;

            const totalSanitizante = await prisma.supplyOrderDetail.aggregate({

                where: {
                    AND: [

                        {
                            Supply: {
                                category: "sanitizante"
                            }
                        },
                        {
                            SupplyOrder: {
                                id_supplyOrder: {
                                    in: orders,
                                },
                            },
                        }

                    ],
                },

                _sum: {
                    subtotal: true,
                },

            });

            totalSanitizante._sum.subtotal === null ? totalSanitizante._sum.subtotal = 0 : totalSanitizante._sum.subtotal + 0;

            const totalBolsa = await prisma.supplyOrderDetail.aggregate({

                where: {
                    AND: [

                        {
                            Supply: {
                                category: "bolsa"
                            }
                        },
                        {
                            SupplyOrder: {
                                id_supplyOrder: {
                                    in: orders,
                                },
                            },
                        }

                    ],
                },

                _sum: {
                    subtotal: true,
                },

            });

            totalBolsa._sum.subtotal === null ? totalBolsa._sum.subtotal = 0 : totalBolsa._sum.subtotal + 0;

            const totalReforzado = await prisma.supplyOrderDetail.aggregate({

                where: {
                    AND: [

                        {
                            Supply: {
                                category: "reforzado"
                            }
                        },
                        {
                            SupplyOrder: {
                                id_supplyOrder: {
                                    in: orders,
                                },
                            },
                        }

                    ],
                },

                _sum: {
                    subtotal: true,
                },

            });

            totalReforzado._sum.subtotal === null ? totalReforzado._sum.subtotal = 0 : totalReforzado._sum.subtotal + 0;

            const totalGanchos = await prisma.supplyOrderDetail.aggregate({

                where: {
                    AND: [

                        {
                            Supply: {
                                category: "ganchos"
                            }
                        },
                        {
                            SupplyOrder: {
                                id_supplyOrder: {
                                    in: orders,
                                },
                            },
                        }

                    ],
                },

                _sum: {
                    subtotal: true,
                },

            });

            totalGanchos._sum.subtotal === null ? totalGanchos._sum.subtotal = 0 : totalGanchos._sum.subtotal + 0;

            const totalWC = await prisma.supplyOrderDetail.aggregate({

                where: {
                    AND: [

                        {
                            Supply: {
                                category: "wc"
                            }
                        },
                        {
                            SupplyOrder: {
                                id_supplyOrder: {
                                    in: orders,
                                },
                            },
                        }

                    ],
                },

                _sum: {
                    subtotal: true,
                },

            });

            totalWC._sum.subtotal === null ? totalWC._sum.subtotal = 0 : totalWC._sum.subtotal + 0;



            const totalOtros = (parseFloat(total._sum.payTotal.toFixed(2)) - totalJabon._sum.subtotal - totalSuavitel._sum.subtotal - totalPinol._sum.subtotal - totalDesengrasante._sum.subtotal -
                totalCloro._sum.subtotal - totalSanitizante._sum.subtotal - totalBolsa._sum.subtotal - totalReforzado._sum.subtotal - totalGanchos._sum.subtotal - totalWC._sum.subtotal);



            console.log(totalJabon._sum.subtotal, totalSuavitel._sum.subtotal, totalPinol._sum.subtotal, totalDesengrasante._sum.subtotal, totalCloro._sum.subtotal, totalSanitizante._sum.subtotal,
                totalBolsa._sum.subtotal, totalReforzado._sum.subtotal, totalGanchos._sum.subtotal, totalWC._sum.subtotal);
            //const categoriesPayed=Object.values(ordersPayed).map(ord => ord.order.id_order);

            const today = new Date().toJSON();
            const time = new Date().toJSON();
            const totalIncome = parseFloat(total._sum.payTotal.toFixed(2));

            response =
            {
                "totalCash": cash._sum.payTotal,
                "totalCredit": credit._sum.payTotal,
                "totalIncome": totalIncome,
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
                "totalOtros": totalOtros,
                "ordersPayed": orders.length,
                "cashCutD": today,
                "workShift": workShift.workShift

            }

            // console.log(total);
            // console.log(cash);
            // console.log(credit);
            const closeCash = await prisma.supplyCashCut.update({

                where: {

                    id_supplyCashCut: Number(req.params.id)
                },
                data: {
                    "totalCash": cash._sum.payTotal,
                    "totalCredit": credit._sum.payTotal,
                    "totalIncome": totalIncome,
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
                    "totalOtros": totalOtros,
                    "ordersPayed": orders.length,
                    "cashCutD": today,
                    "workShift": workShift.workShift,
                    "cashCutStatus": "closed",
                    "cashCutD": today,
                    "cashCutT": time
                }
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

export const getCashCutStatus = async (req, res) => {
    try {
        const lastCashCut = await prisma.supplyCashCut.aggregate({

            _max: {
                id_supplyCashCut: true,
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

            lastCashCutStatus = await prisma.supplyCashCut.findUnique({

                where: {
                    id_supplyCashCut: lastCashCut._max.id_supplyCashCut,
                },

                select: {
                    cashCutStatus: true,
                    id_supplyCashCut: true,
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
        const lastCashCutId = await prisma.supplyCashCut.aggregate({

            _max: {
                id_supplyCashCut: true,
            }
        });

        const cashCutStatus = await prisma.supplyCashCut.findFirst({

            where: {
                id_supplyCashCut: lastCashCutId._max.id_cashCut
            },

            select: {
                cashCutStatus: true,
            },

        });

        const response = {
            "id_cashCut ": lastCashCutId._max.id_supplyCashCut,
            "cashCutStatus": cashCutStatus.cashCutStatus
        };


        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}