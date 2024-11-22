import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const getPayments = async (req, res) => {
    try {
        const response = await prisma.payment.findMany();
        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}

export const getPaymentsById = async (req, res) => {
    try {
        const response = await prisma.payment.findUnique({
            where: {
                id_payment: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    } catch (e) {
        res.status(404).json({ msg: e.message });
    }
}

export const createPayment = async (req, res) => {

    try {
        const payment = prisma.payment.create({
            data: req.body

        });


        const orderPayment = prisma.serviceOrder.update({
            where: {
                id_order: Number(req.body.fk_idOrder),
            },
            data: {
                payStatus: 'paid',
            },

        });

        const result = await prisma.$transaction([payment, orderPayment]);

        res.status(201).json(result);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const createPaymentDelivery = async (req, res) => {

    try {

        console.log("BODY_Payment");
        console.log(req.body.payment)

        const payment = await prisma.payment.create({
            data: req.body.payment

        });

        const delivery = await prisma.deliveryDetail.create({
            
            data: {
                fk_userCashier: req.body.deliveryDetail.fk_userCashier,
                deliveryDate: req.body.deliveryDetail.deliveryDate,
                deliveryTime: req.body.deliveryDetail.deliveryTime,
                fk_idOrder: req.body.deliveryDetail.fk_idOrder,
                fk_idPayment: payment.id_payment
            }

        });

        const orderPayment = await prisma.serviceOrder.update({
            where: {
                id_order: Number(req.body.payment.fk_idOrder),
            },
            data: {
                payStatus: "paid",
                orderStatus: "delivered",
                totalPrice: req.body.payment.payTotal
            }

        });

        console.log("BODY");
        console.log(req.body);
        console.log("Payment");
        console.log(payment);
        console.log("Delivery");
        console.log(delivery);
        console.log("OrderPayment");
        console.log(orderPayment);

        console.log(req.body.payment.payMethod)

        if (req.body.payment.payMethod.toString() == 'credit' ) {

            console.log(req.body.payment.payMethod)

            let dataUpdate;

            const orderCategory = await prisma.serviceOrder.findFirst({

                where: {
                    id_order: Number(req.body.payment.fk_idOrder)
                },

                select: {
                    fk_categoryId: true,

                }

            });

            const orderDetail = await prisma.serviceOrderDetail.findMany({

                where: {
                    fk_serviceOrder: Number(req.body.payment.fk_idOrder)
                },

                select: {
                    id_serviceOrderDetail: true,
                    units: true,
                    LaundryService: {
                        select: {
                            id_service: true,
                            description: true,
                            price: true,
                            priceCredit: true,
                        }
                    },
                    SelfService: {
                        select: {
                            id_service: true,
                            description: true,
                            price: true,
                            priceCredit: true,
                        }
                    },
                    IronService: {
                        select: {
                            id_service: true,
                            description: true,
                            price: true,
                            priceCredit: true,
                        }
                    },
                    DrycleanService: {
                        select: {
                            id_service: true,
                            description: true,
                            price: true,
                            priceCredit: true,
                        }
                    },
                    OtherService: {
                        select: {
                            id_service: true,
                            description: true,
                            price: true,
                            priceCredit: true,
                        }
                    }
                }

            });

            console.log(orderDetail)

            if (Number(orderCategory.fk_categoryId) == 1) {
                dataUpdate = orderDetail.map(item => ({
                    id: item.id_serviceOrderDetail,
                    subtotal: Number(item.units * item.SelfService.priceCredit)
                }))
                console.log("xxxxxxxxxxxxxxx")
                console.log(dataUpdate)
                console.log("xxxxxxxxxxxxxxx")
            }


            if (Number(orderCategory.fk_categoryId) == 2) {
                dataUpdate = orderDetail.map(item => ({
                    id: item.id_serviceOrderDetail,
                    subtotal: Number(item.units * item.LaundryService.priceCredit)
                }))
                console.log("xxxxxxxxxxxxxxx")
                console.log(dataUpdate)
                console.log("xxxxxxxxxxxxxxx")
            }

            if (Number(orderCategory.fk_categoryId) == 3) {
                dataUpdate = orderDetail.map(item => ({
                    id: item.id_serviceOrderDetail,
                    subtotal: Number(item.units * item.IronService.priceCredit)
                }))
                console.log("xxxxxxxxxxxxxxx")
                console.log(dataUpdate)
                console.log("xxxxxxxxxxxxxxx")
            }

            if (Number(orderCategory.fk_categoryId) == 4) {
                dataUpdate = orderDetail.map(item => ({
                    id: item.id_serviceOrderDetail,
                    subtotal: Number(item.units * item.DrycleanService.priceCredit)
                }))
                console.log("xxxxxxxxxxxxxxx")
                console.log(dataUpdate)
                console.log("xxxxxxxxxxxxxxx")
            }

            if (Number(orderCategory.fk_categoryId) == 5) {
                dataUpdate = orderDetail.map(item => ({
                    id: item.id_serviceOrderDetail,
                    subtotal: Number(item.units * item.OtherService.priceCredit)
                }))
                console.log("xxxxxxxxxxxxxxx")
                console.log(dataUpdate)
                console.log("xxxxxxxxxxxxxxx")

            }

            dataUpdate.forEach(async (element) => {

                await prisma.serviceOrderDetail.update({

                    where: {
                        id_serviceOrderDetail: Number(element.id)
                    },
                    data: {
                        subtotal: element.subtotal,
                        payMethod: "credit"
                    }


                });

            });

        }
        // const orderCategory = await prisma.serviceOrder.findFirst({
        //     where:{
        //         id_order:req.body.deliveryDetail.fk_idOrder,
        //     },
        //     select:{
        //         fk_categoryId:true,
        //     }
        // });
        const result = {
            "payment": payment,
            "delivery": delivery,
            "orderPayment": orderPayment
        }

        res.status(201).json(result);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}


export const createPaymentAdvance = async (req, res) => {

    console.log(req.body)

    try {
        const payment = prisma.payment.create({

            data: req.body.payment

        });


        const orderPayment = prisma.serviceOrder.update({
            where: {
                id_order: Number(req.body.payment.fk_idOrder),
            },
            data: {
                payStatus: 'paid',
                totalPrice: Number(req.body.payment.payTotal)
            },

        });

        const result = await prisma.$transaction([payment, orderPayment]);

        console.log("Se actualizo el pedido en pagos")

        if (req.body.payment.payMethod.toString() == "credit") {

            console.log("Entro al if credit")

            let dataUpdate;

            const orderCategory = await prisma.serviceOrder.findFirst({

                where: {
                    id_order: Number(req.params.payment.fk_idOrder)
                },

                select: {
                    fk_categoryId: true,

                }

            });

            const orderDetail = await prisma.serviceOrderDetail.findMany({

                where: {
                    fk_serviceOrder: Number(req.params.payment.fk_idOrder)
                },



                select: {
                    id_serviceOrderDetail: true,
                    units: true,
                    LaundryService: {
                        select: {
                            id_service: true,
                            description: true,
                            price: true,
                            priceCredit: true,
                        }
                    },
                    SelfService: {
                        select: {
                            id_service: true,
                            description: true,
                            price: true,
                            priceCredit: true,
                        }
                    },
                    IronService: {
                        select: {
                            id_service: true,
                            description: true,
                            price: true,
                            priceCredit: true,
                        }
                    },
                    DrycleanService: {
                        select: {
                            id_service: true,
                            description: true,
                            price: true,
                            priceCredit: true,
                        }
                    },
                    OtherService: {
                        select: {
                            id_service: true,
                            description: true,
                            price: true,
                            priceCredit: true,
                        }
                    }
                }

            });

            console.log(orderDetail)

            if (orderCategory.fk_categoryId == 1) {
                dataUpdate = orderDetail.map(item => ({
                    id: item.id_serviceOrderDetail,
                    subtotal: Number(item.units * item.SelfService.priceCredit)
                }))
                console.log(dataUpdate)
            }


            if (orderCategory.fk_categoryId == 2) {
                dataUpdate = orderDetail.map(item => ({
                    id: item.id_serviceOrderDetail,
                    subtotal: Number(item.units * item.LaundryService.priceCredit)
                }))
                console.log(dataUpdate)
            }

            if (orderCategory.fk_categoryId == 3) {
                dataUpdate = orderDetail.map(item => ({
                    id: item.id_serviceOrderDetail,
                    subtotal: Number(item.units * item.IronService.priceCredit)
                }))
                console.log(dataUpdate)
            }

            if (orderCategory.fk_categoryId == 4) {
                dataUpdate = orderDetail.map(item => ({
                    id: item.id_serviceOrderDetail,
                    subtotal: Number(item.units * item.DrycleanService.priceCredit)
                }))
                console.log(dataUpdate)
            }

            if (orderCategory.fk_categoryId == 5) {
                dataUpdate = orderDetail.map(item => ({
                    id: item.id_serviceOrderDetail,
                    subtotal: Number(item.units * item.OtherService.priceCredit)
                }))
                console.log(dataUpdate)

            }

            dataUpdate.forEach(async (element) => {

                await prisma.serviceOrderDetail.update({

                    where: {
                        id_serviceOrderDetail: Number(element.id)
                    },

                    data: {
                        subtotal: element.subtotal,
                        payMethod: "credit"
                    }


                });

            });

        }


        res.status(201).json(result);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const testPayment = async (req, res) => {

    try {

        let dataUpdate;

        const orderCategory = await prisma.serviceOrder.findFirst({

            where: {
                id_order: Number(req.params.id)
            },

            select: {
                fk_categoryId: true,

            }

        });

        const orderDetail = await prisma.serviceOrderDetail.findMany({

            where: {
                fk_serviceOrder: Number(req.params.id)
            },



            select: {
                id_serviceOrderDetail: true,
                units: true,
                LaundryService: {
                    select: {
                        id_service: true,
                        description: true,
                        price: true,
                        priceCredit: true,
                    }
                },
                SelfService: {
                    select: {
                        id_service: true,
                        description: true,
                        price: true,
                        priceCredit: true,
                    }
                },
                IronService: {
                    select: {
                        id_service: true,
                        description: true,
                        price: true,
                        priceCredit: true,
                    }
                },
                DrycleanService: {
                    select: {
                        id_service: true,
                        description: true,
                        price: true,
                        priceCredit: true,
                    }
                },
                OtherService: {
                    select: {
                        id_service: true,
                        description: true,
                        price: true,
                        priceCredit: true,
                    }
                }
            }

        });

        console.log(orderDetail)

        if (orderCategory.fk_categoryId == 1) {
            dataUpdate = orderDetail.map(item => ({
                id: item.id_serviceOrderDetail,
                subtotal: Number(item.units * item.SelfService.priceCredit)
            }))
            console.log(dataUpdate)
        }


        if (orderCategory.fk_categoryId == 2) {
            dataUpdate = orderDetail.map(item => ({
                id: item.id_serviceOrderDetail,
                subtotal: Number(item.units * item.LaundryService.priceCredit)
            }))
            console.log(dataUpdate)
        }

        if (orderCategory.fk_categoryId == 3) {
            dataUpdate = orderDetail.map(item => ({
                id: item.id_serviceOrderDetail,
                subtotal: Number(item.units * item.IronService.priceCredit)
            }))
            console.log(dataUpdate)
        }

        if (orderCategory.fk_categoryId == 4) {
            dataUpdate = orderDetail.map(item => ({
                id: item.id_serviceOrderDetail,
                subtotal: Number(item.units * item.DrycleanService.priceCredit)
            }))
            console.log(dataUpdate)
        }

        if (orderCategory.fk_categoryId == 5) {
            dataUpdate = orderDetail.map(item => ({
                id: item.id_serviceOrderDetail,
                subtotal: Number(item.units * item.OtherService.priceCredit)
            }))
            console.log(dataUpdate)

        }

        dataUpdate.forEach(async (element) => {

            await prisma.serviceOrderDetail.update({

                where: {
                    id_serviceOrderDetail: Number(element.id)
                },

                subtotal: element.subtotal

            });

        });

        // const orderCategory = await prisma.serviceOrder.findFirst({
        //     where:{
        //         id_order:req.body.deliveryDetail.fk_idOrder,
        //     },
        //     select:{
        //         fk_categoryId:true,
        //     }
        // });


        // const result = {
        //     "payment":payment,
        //     "delivery":delivery,
        //     "orderPayment":orderPayment
        // }

        res.status(201).json(dataUpdate);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}


export const updatePayment = async (req, res) => {
    try {
        const payment = await prisma.payment.update({
            where: {
                id_payment: Number(req.params.id)
            },

            data: req.body
        });
        res.status(200).json(payment);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}

export const deletePayment = async (req, res) => {
    try {
        const payment = await prisma.payment.delete({
            where: {
                id_payment: Number(req.params.id)
            },
        });
        res.status(200).json(payment);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
}